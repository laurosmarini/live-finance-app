# Multi-stage build for production
# Build stage for React frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# Build stage for Node.js backend
FROM node:18-alpine AS backend-build

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production

WORKDIR /app/db
COPY db/package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine AS production

# Install PostgreSQL client for database operations
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy backend dependencies and source
COPY --from=backend-build /app/server/node_modules ./server/node_modules
COPY server ./server

# Copy database files
COPY --from=backend-build /app/db/node_modules ./db/node_modules
COPY db ./db

# Copy built frontend
COPY --from=frontend-build /app/client/build ./client/build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node server/health-check.js

# Start command
CMD ["node", "server/index.js"]
