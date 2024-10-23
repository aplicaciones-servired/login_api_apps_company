FROM node:lts-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY . .

RUN yarn && yarn build

EXPOSE 80

CMD [ "yarn", "start" ]