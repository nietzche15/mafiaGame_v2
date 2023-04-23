FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY .env ./

RUN npm install

COPY . .

EXPOSE 7070
CMD [ "node", "index.js" ]