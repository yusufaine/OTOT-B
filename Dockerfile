FROM node:16-alpine

WORKDIR /app

COPY package.json /app/
COPY yarn.lock /app/
COPY tsconfig*.json /app/
RUN yarn install
COPY . .

RUN yarn build

EXPOSE 8080

CMD [ "node", "./dist/index.js" ]
