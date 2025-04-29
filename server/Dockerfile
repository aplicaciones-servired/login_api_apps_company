FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY . .

RUN npm install -g bun

RUN bun install && bun run build

EXPOSE 80

CMD [ "bun", "start" ]
