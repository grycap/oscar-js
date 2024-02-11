# Compilation stage
FROM node:18-alpine as build
RUN apk add --no-cache git
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# Deploy stage
FROM node:18-slim
WORKDIR /usr/src/app
COPY --from=build  /usr/src/app/package*.json ./
COPY --from=build  /usr/src/app/dist ./dist

RUN npm install --production
CMD [ "npm", "run", "start:prod" ]