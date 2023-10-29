FROM node:18-alpine as build
RUN apk add --no-cache git
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .
RUN npm run build

CMD [ "npm", "run", "start:prod" ]