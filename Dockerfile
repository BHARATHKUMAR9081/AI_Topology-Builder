# Dockerfile

# ---- Build Stage ----
FROM node:20-alpine AS builder
ENV NODE_ENV=development
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Build frontend static assets
RUN npm run build

# Production prunes devDependencies
RUN npm prune --production


# ---- Runtime Stage ----
FROM node:20-alpine
ENV NODE_ENV=production
ENV PORT=3001

# Install nginx for static hosting and reverse proxy
RUN apk add --no-cache nginx

# Set work directory
WORKDIR /usr/src/app

# Copy built files plus backend code from builder
COPY --from=builder /usr/src/app .

# Configure nginx: serve static files and proxy API traffic
RUN mkdir -p /etc/nginx/conf.d \
    && printf 'server {\n\
    listen 80;\n\
    server_name localhost;\n\
\n\
    # Serve the Vite SPA build\n\
    location / {\n\
        root   /usr/src/app/dist;\n\
        index  index.html;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    # Proxy all /api requests to the Node.js backend\n\
    location /api {\n\
        proxy_pass http://127.0.0.1:${PORT};\n\
        proxy_http_version 1.1;\n\
        proxy_set_header Upgrade $http_upgrade;\n\
        proxy_set_header Connection upgrade;\n\
        proxy_set_header Host $host;\n\
        proxy_set_header X-Real-IP $remote_addr;\n\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\
        proxy_set_header X-Forwarded-Proto $scheme;\n\
    }\n\
    # Pass through the favicon\n\
    location = /favicon.ico { log_not_found off; access_log off; }\n\
} ' > /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 3001

# Start Node backend in background then run nginx
CMD ["sh","-c","mkdir -p /run/nginx && (node server/index.js &) && nginx -g 'daemon off;'"]