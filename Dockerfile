# Build stage
FROM node:23.6.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Set BASE_URL environment variable for build
ARG BASE_URL
ENV BASE_URL=${BASE_URL}

# Build the application
RUN npm run build

# Production stage
FROM node:23.6.0-alpine

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/.output /app
COPY --from=builder /app/.nuxt /app/.nuxt
COPY --from=builder /app/package*.json /app/

# Install only production dependencies
RUN npm install --only=production

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Start the application
CMD ["node", "/app/server/index.mjs"]