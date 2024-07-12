FROM node:18.17.0 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g copyfiles prisma

COPY . .
COPY .env.prod .env
COPY prisma ./prisma
COPY ./prisma/schema.prisma ./

RUN ls -l /usr/src/app/prisma
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build

FROM node:18.17.0-alpine

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node --loader ./prisma/seeds/seed.js && npm start"]
