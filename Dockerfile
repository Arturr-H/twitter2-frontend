# This image will be used in the docker-compose file
# in hetzner or whatnot
FROM node:latest as build

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

FROM docker.io/nginx:alpine as production
WORKDIR /usr/share/nginx/

RUN rm -rf html
RUN mkdir html

WORKDIR /
COPY ./nginx/nginx.conf /etc/nginx
COPY --from=build ./app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
