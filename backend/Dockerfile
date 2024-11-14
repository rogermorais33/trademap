FROM node:18.19.0

RUN npm i npm@latest -g

WORKDIR /opt/backend

COPY . .

RUN npm install

EXPOSE 5000

CMD [ "npm", "start" ]
