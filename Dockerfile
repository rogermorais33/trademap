FROM node:18.19.0

RUN npm i npm@latest -g

WORKDIR /opt/app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
