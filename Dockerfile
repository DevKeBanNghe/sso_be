##### Dockerfile #####
## build stage ##
FROM node:21-alpine AS build

ARG APP_NAME=app

WORKDIR /${APP_NAME}

COPY package*.json .

RUN npm install --only=development

COPY . .

RUN npm run build

## run stage ##
FROM node:21-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG APP_NAME=app

WORKDIR /${APP_NAME}

COPY package*.json .

RUN npm install --only=production

COPY . .

COPY --from=build /${APP_NAME}/dist ./dist
COPY --from=build /${APP_NAME}/prisma/os prisma/

CMD npm run pris-mig-db && node dist/main.js