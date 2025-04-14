# Stage 1: Build the application
FROM node:20.18-alpine as builder

ARG GOOGLE_MAPS_API_KEY
ARG WEBSOCKET_URL
ARG WEBSOCKET_RECONNECT_INTERVAL
ARG WEBSOCKET_MAX_RETRIES

ENV WEBSOCKET_URL=${WEBSOCKET_URL:-ws://localhost:8080/map-updates}
ENV WEBSOCKET_RECONNECT_INTERVAL=${WEBSOCKET_RECONNECT_INTERVAL:-5000}
ENV WEBSOCKET_MAX_RETRIES=${WEBSOCKET_MAX_RETRIES:-3}

# Set working directory
WORKDIR /app

# Copy package files
COPY ../package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

# Copy Nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Set entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"] 