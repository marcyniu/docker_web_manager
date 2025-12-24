# Build Stage
FROM node:25-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY webpack.config.js ./
COPY jest.config.js ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Build server and client
RUN npm run build

# Production Stage with Nginx
FROM nginx:alpine

# Install Node.js in the Nginx image for running the backend
RUN apk add --no-cache nodejs npm

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create data directory for SQLite
RUN mkdir -p /app/data

# Expose ports
EXPOSE 80 3000

# Create startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'node /app/dist/server/index.js &' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

CMD ["/start.sh"]
