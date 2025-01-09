FROM node:18.19.1-alpine3.19

#Set working dir
WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3001

CMD [ "npm", "start" ]