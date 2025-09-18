#!/bin/bash

# Google Cloud Run Deployment Script for Coding Challenge Platform
# Make sure you have gcloud CLI installed and authenticated

set -e

# Configuration - UPDATE THESE VALUES
PROJECT_ID="your-project-id"  # Replace with your GCP project ID
REGION="us-central1"          # Replace with your preferred region
SERVICE_NAME_SERVER="coding-challenge-server"
SERVICE_NAME_CLIENT="coding-challenge-client"
MONGODB_URI="mongodb+srv://sichardsayaz_db_user:CWltCWdNrob9uIFU@cluster0.bapctqm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Deploying Coding Challenge Platform to Google Cloud Run${NC}"
echo -e "${YELLOW}Project ID: ${PROJECT_ID}${NC}"
echo -e "${YELLOW}Region: ${REGION}${NC}"

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Set the project
echo -e "${YELLOW}📋 Setting project to ${PROJECT_ID}${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${YELLOW}🔧 Enabling required APIs${NC}"
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Create Artifact Registry repository
echo -e "${YELLOW}📦 Creating Artifact Registry repository${NC}"
gcloud artifacts repositories create coding-challenge-repo \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for coding challenge platform" || echo "Repository already exists"

# Configure Docker authentication
echo -e "${YELLOW}🔐 Configuring Docker authentication${NC}"
gcloud auth configure-docker $REGION-docker.pkg.dev

# Build and push server
echo -e "${GREEN}🏗️  Building and pushing server image${NC}"
cd server
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/coding-challenge-repo/$SERVICE_NAME_SERVER:latest .
cd ..

# Build and push client
echo -e "${GREEN}🏗️  Building and pushing client image${NC}"
cd client
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/coding-challenge-repo/$SERVICE_NAME_CLIENT:latest .
cd ..

# Deploy server to Cloud Run
echo -e "${GREEN}🚀 Deploying server to Cloud Run${NC}"
gcloud run deploy $SERVICE_NAME_SERVER \
    --image $REGION-docker.pkg.dev/$PROJECT_ID/coding-challenge-repo/$SERVICE_NAME_SERVER:latest \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory 512Mi \
    --cpu 1 \
    --max-instances 10 \
    --set-env-vars="PORT=8080,MONGODB_URI=$MONGODB_URI" \
    --timeout 300

# Get server URL
SERVER_URL=$(gcloud run services describe $SERVICE_NAME_SERVER --region=$REGION --format='value(status.url)')
echo -e "${GREEN}✅ Server deployed at: ${SERVER_URL}${NC}"

# Deploy client to Cloud Run
echo -e "${GREEN}🚀 Deploying client to Cloud Run${NC}"
gcloud run deploy $SERVICE_NAME_CLIENT \
    --image $REGION-docker.pkg.dev/$PROJECT_ID/coding-challenge-repo/$SERVICE_NAME_CLIENT:latest \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory 256Mi \
    --cpu 1 \
    --max-instances 5 \
    --set-env-vars="PORT=8080,VITE_API_URL=$SERVER_URL" \
    --timeout 300

# Get client URL
CLIENT_URL=$(gcloud run services describe $SERVICE_NAME_CLIENT --region=$REGION --format='value(status.url)')
echo -e "${GREEN}✅ Client deployed at: ${CLIENT_URL}${NC}"

echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo -e "1. ✅ MongoDB Atlas is already configured"
echo -e "2. ✅ Client is configured to use server URL automatically"
echo -e "3. Test your application at: ${CLIENT_URL}"
echo -e ""
echo -e "${GREEN}🌐 Your application URLs:${NC}"
echo -e "Frontend: ${CLIENT_URL}"
echo -e "Backend:  ${SERVER_URL}"
echo -e "Health:   ${SERVER_URL}/api/health"
