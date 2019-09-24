FROM node:12-alpine

WORKDIR /usr/src/app/server

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"] 
