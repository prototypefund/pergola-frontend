## This Dockerfile assumes to be run in context of the git-repository
FROM nginx:stable-alpine
COPY ./www /app
COPY ./.circleci/deployment/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
