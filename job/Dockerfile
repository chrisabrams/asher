FROM node:alpine

RUN mkdir -p /app

ADD index.js /app/index.js
ADD worker /app/worker

ADD package.json /app/package.json

RUN npm install

CMD node /app/index.js
