FROM node:16-slim

#Set working dir
WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start"]