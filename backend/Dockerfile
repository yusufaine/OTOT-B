FROM node:18-alpine

WORKDIR /app

COPY package.json /app/
COPY yarn.lock /app/
COPY tsconfig*.json /app/
RUN yarn install --prefer-offline --frozen-lockfile
COPY . .

RUN yarn build

EXPOSE 8080

CMD [ "node", "./dist/index.js" ]
