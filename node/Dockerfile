FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

EXPOSE 3000

CMD ["./wait-for-it.sh", "mysql:3306", "--timeout=60", "--strict", "--", "npm", "start"]
