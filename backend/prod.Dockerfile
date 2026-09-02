FROM node:22-alpine3.19 AS builder

WORKDIR /usr/src/

COPY package*.json ./

RUN npm ci

COPY app ./app

COPY tests ./tests

RUN npm test

#Segundo stage para produccion
FROM node:22-alpine3.19 AS production

RUN apk add --no-cache tzdata && ln -s /usr/share/zoneinfo/America/Mexico_City /etc/localtime

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /usr/src/app .

RUN mkdir -p /usr/src/app/logs && chmod 775 -R /usr/src/app/logs/ \
    && mkdir -p /usr/src/app/uploads/adjuntos && chown node:node -R /usr/src/app/uploads && chmod 775 -R /usr/src/app/uploads/adjuntos

EXPOSE 9008

CMD ["npm", "run", "start"]