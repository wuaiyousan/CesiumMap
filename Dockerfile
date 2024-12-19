FROM nginx:stable-alpine-perl

COPY visualization/  /usr/share/nginx/html/visualization

EXPOSE 92

CMD ["nginx", "-g", "daemon off;"]
