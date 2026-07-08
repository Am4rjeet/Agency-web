# Use official lightweight Node.js Alpine base image
FROM node:20-alpine

# Set working directory for the application
WORKDIR /app

# Copy root configurations and package manifests
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy backend server components
COPY server/ ./server/

# Set production environment flags
ENV NODE_ENV=production
ENV PORT=5000

# Expose backend port
EXPOSE 5000

# Set default startup command running the API server
CMD ["node", "server/server.js"]
