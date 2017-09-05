FROM node:alpine

RUN mkdir -p /home/api

WORKDIR /home/api

COPY . .

RUN npm install

CMD ["npm", "start"]
