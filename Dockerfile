# build stage 
FROM node:18-alpine AS development

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --development --ignore-scripts
COPY . .
RUN npm run pris-gen-pg
RUN npm run build

# run stage 
FROM node:18-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production --ignore-scripts
RUN npm rebuild bcrypt
COPY . .
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/node_modules/@prisma/ ./node_modules/@prisma/

CMD ["node", "dist/main.js"]        