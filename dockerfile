FROM node:10.17.0

WORKDIR /usr/src/wallet-api
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD npm start