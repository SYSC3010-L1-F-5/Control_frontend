FROM node:alpine

ADD VERSION .

WORKDIR /frontend
COPY package*.json ./
RUN apk add --no-cache git make gcc g++ python\
    && npm install

EXPOSE 8080

CMD npm start