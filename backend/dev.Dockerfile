FROM node:22-alpine3.19

RUN apk add --no-cache tzdata && ln -s /usr/share/zoneinfo/America/Mexico_City /etc/localtime

WORKDIR /usr/src

COPY package*.json .prettierignore ./

RUN npm install -g npm@10.8.2 && npm install

COPY app ./app

COPY tests ./tests

RUN mkdir -p /usr/src/app/logs && chmod 775 -R /usr/src/app/logs/ \
    && mkdir -p /usr/src/app/uploads/adjuntos && chown node:node -R /usr/src/app/uploads && chmod 775 -R /usr/src/app/uploads/adjuntos

CMD ["npm", "run", "dev"]