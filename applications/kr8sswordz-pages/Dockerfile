FROM node:7

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY gulpfile.js /usr/src/app/

RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3002

CMD [ "npm", "run", "start" ]