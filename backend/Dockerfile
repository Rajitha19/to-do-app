# Use Node.js 18 LTS (Debian-based for better compatibility)
FROM node:18

# Install MySQL client for health checks and database connectivity
RUN apt-get update && apt-get install -y default-mysql-client curl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with retry and timeout settings
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5 && \
    npm ci --only=production

# Copy Prisma schema first
COPY prisma ./prisma/

# Install dev dependencies needed for Prisma and build
RUN npm install --only=dev

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY src ./src
COPY tsconfig.json ./
COPY .env ./
COPY start.sh ./

# Make the startup script executable
RUN chmod +x start.sh

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Reinstall Prisma CLI for migrations
RUN npm install prisma@latest

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application using the startup script
CMD ["./start.sh"]
