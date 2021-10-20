FROM node:14.18.1 as dev

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

CMD [ "yarn", "start" ]
