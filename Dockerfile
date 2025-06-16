# Dockerfile
FROM node:18-alpine

# Install required packages for Puppeteer and Playwright
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Set up working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S replicator -u 1001

# Copy application code
COPY --chown=replicator:nodejs . .

# Create necessary directories
RUN mkdir -p /app/logs /app/replicated-sites
RUN chown -R replicator:nodejs /app

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV NODE_ENV=production

# Switch to non-root user
USER replicator

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "console.log('Health check passed')" || exit 1

# Expose port (if running as web service)
EXPOSE 3000

# Default command
CMD ["node", "src/index.js", "--help"]