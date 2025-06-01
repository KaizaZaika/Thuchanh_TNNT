# frontend/Dockerfile
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx configuration file into container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy frontend files
COPY frontend/ .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]