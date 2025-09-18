# Google Cloud Run Deployment Guide

## Prerequisites

1. **Google Cloud Account**: Sign up at [cloud.google.com](https://cloud.google.com)
2. **Google Cloud CLI**: Install gcloud CLI
3. **MongoDB Atlas**: Set up a free MongoDB Atlas cluster

## Setup Steps

### 1. Install Google Cloud CLI

**macOS:**
```bash
brew install google-cloud-sdk
```

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Windows:**
Download from [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

### 2. Authenticate with Google Cloud

```bash
gcloud auth login
gcloud auth application-default login
```

### 3. Create a New Project

```bash
# Create a new project (replace with your project name)
gcloud projects create your-project-id

# Set the project
gcloud config set project your-project-id

# Enable billing (required for Cloud Run)
# Go to: https://console.cloud.google.com/billing
```

### 4. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Create a database user
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/coding_challenge`)

### 5. Deploy to Cloud Run

**Option A: Use the automated script**
```bash
# Edit the script to set your project ID
nano deploy-cloudrun.sh

# Run the deployment
./deploy-cloudrun.sh
```

**Option B: Manual deployment**

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
export REGION="us-central1"

# Enable APIs
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# Create Artifact Registry
gcloud artifacts repositories create coding-challenge-repo \
    --repository-format=docker \
    --location=$REGION

# Build and deploy server
cd server
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/coding-challenge-repo/server:latest -f Dockerfile.cloudrun .
gcloud run deploy coding-challenge-server \
    --image $REGION-docker.pkg.dev/$PROJECT_ID/coding-challenge-repo/server:latest \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory 512Mi \
    --set-env-vars="PORT=8080,MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/coding_challenge"

# Build and deploy client
cd ../client
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/coding-challenge-repo/client:latest -f Dockerfile.cloudrun .
gcloud run deploy coding-challenge-client \
    --image $REGION-docker.pkg.dev/$PROJECT_ID/coding-challenge-repo/client:latest \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory 256Mi
```

## Environment Variables

### Server Environment Variables
- `PORT=8080` (required by Cloud Run)
- `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/coding_challenge`
- `CLIENT_ORIGIN=https://your-client-url.a.run.app`

### Client Environment Variables
- `PORT=8080` (required by Cloud Run)

## Post-Deployment

1. **Update CORS**: The server will automatically use the client URL for CORS
2. **Test the application**: Visit your client URL
3. **Monitor logs**: Use `gcloud run services logs read service-name --region=region`

## Cost Optimization

- **Server**: 512Mi memory, 1 CPU (scales to 0 when not used)
- **Client**: 256Mi memory, 1 CPU (scales to 0 when not used)
- **MongoDB Atlas**: Free tier (512MB storage)

## Troubleshooting

### Common Issues

1. **Build failures**: Check Dockerfile syntax and dependencies
2. **CORS errors**: Verify CLIENT_ORIGIN environment variable
3. **Database connection**: Check MongoDB Atlas network access and credentials
4. **Memory issues**: Increase memory allocation if needed

### Useful Commands

```bash
# View service logs
gcloud run services logs read coding-challenge-server --region=us-central1

# Update environment variables
gcloud run services update coding-challenge-server \
    --region=us-central1 \
    --set-env-vars="MONGODB_URI=new-connection-string"

# Scale services
gcloud run services update coding-challenge-server \
    --region=us-central1 \
    --max-instances=20

# Delete services
gcloud run services delete coding-challenge-server --region=us-central1
gcloud run services delete coding-challenge-client --region=us-central1
```

## Security Considerations

- Services are deployed with `--allow-unauthenticated` for public access
- MongoDB Atlas provides network security
- Cloud Run automatically handles HTTPS
- Consider adding authentication for production use
