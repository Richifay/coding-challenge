# Multi-stage build for React app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app with environment variable
ARG VITE_API_URL=https://coding-challenge-server-qa7d7w5fka-ew.a.run.app
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration (works for both local and Cloud Run)
COPY nginx.conf /etc/nginx/nginx.conf

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Use PORT environment variable (Cloud Run uses 8080, local uses 80)
EXPOSE $PORT

# Start nginx with environment variable substitution
CMD ["/start.sh"]
