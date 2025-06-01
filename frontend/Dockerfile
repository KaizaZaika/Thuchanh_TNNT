# frontend/Dockerfile.frontend
FROM nginx:alpine

# Xóa cấu hình Nginx mặc định
RUN rm /etc/nginx/conf.d/default.conf

# Sao chép tệp cấu hình nginx.conf vào container
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]