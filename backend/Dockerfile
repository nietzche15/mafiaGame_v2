FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY .env ./

RUN npm install

COPY . .

EXPOSE 4000
CMD [ "node", "index.js" ]