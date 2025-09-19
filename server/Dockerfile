# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Install Python 3 and Java (OpenJDK 17) for running code
RUN apk add --no-cache python3 py3-pip openjdk17-jre-headless openjdk17-jdk

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Use PORT environment variable (Cloud Run uses 8080, local can use 4000)
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]
