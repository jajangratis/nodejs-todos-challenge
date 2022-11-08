FROM node:16

# Create app directory
WORKDIR /trian-app

COPY ./setup.sql /docker-entrypoint-initdb.d/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install -g knex
RUN npm install -g pm2
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
# RUN knex migrate:latest
# RUN knex migrate:latest

EXPOSE 3030
CMD [ "pm2-runtime", "app.js"]