FROM node:12

WORKDIR /app
ADD yarn.lock .
ADD package.json .

RUN yarn --frozen-lockfile

ADD . .

