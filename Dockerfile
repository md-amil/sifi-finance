FROM node:lts

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "./bin/www" ]
