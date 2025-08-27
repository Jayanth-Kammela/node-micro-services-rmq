FROM node:18
LABEL authors="jayanth"

WORKDIR /app/customer

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8005

CMD ["npm", "run", "start"]