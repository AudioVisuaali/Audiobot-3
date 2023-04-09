FROM node:16-slim

WORKDIR /home/discord-bot

COPY package.json ./

RUN yarn install --frozen-lockfile

COPY . ./

run yarn build

ENV API_PORT=8080
EXPOSE 8080
CMD ["node", "./dist/app.js"]
