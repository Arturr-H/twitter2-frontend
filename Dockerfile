# This image will be used in the docker-compose file
# in hetzner or whatnot
FROM node:18-alpine
WORKDIR /app
COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 8082

CMD [ "serve", "-p", "8082", "-s", "dist" ]
