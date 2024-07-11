FROM node:latest

WORKDIR /container-2

COPY package.json .

RUN npm install

COPY . .

CMD ["node","server.js"]