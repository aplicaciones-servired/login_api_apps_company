FROM node:lts

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY . .

RUN npm install && node --run build

EXPOSE 80

CMD [ "npm", "start" ]