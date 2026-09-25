FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
# Copy all backend source and dependencies from builder
COPY --from=builder /app /app
# Copy frontend build artifacts into nginx static folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Install nginx and create configuration
RUN apk add --no-cache nginx \
    && mkdir -p /run/nginx /etc/nginx/conf.d \
    && rm -f /etc/nginx/conf.d/*.conf
RUN printf "server {\n\
    listen 80;\n\
    server_name localhost;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files \$uri \$uri/ /index.html;\n\
    }\n\
    location /api {\n\
        proxy_pass http://127.0.0.1:8000;\n\
        proxy_set_header Host \$host;\n\
        proxy_set_header X-Real-IP \$remote_addr;\n\
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;\n\
        proxy_set_header X-Forwarded-Proto \$scheme;\n\
    }\n\
}\n" > /etc/nginx/conf.d/default.conf

ENV PORT=8000
ENV NODE_ENV=production

EXPOSE 80
CMD ["sh", "-c", "node server/index.js & exec nginx -g 'daemon off;'"]