FROM node:alpine

RUN mkdir -p /home/api

WORKDIR /home/api

COPY . .

RUN npm install

ENV NODE_ENV=prod
ENV VALIDATE_DB=ON

CMD ["npm", "start"]
