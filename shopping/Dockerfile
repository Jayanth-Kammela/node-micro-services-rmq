FROM node:18
LABEL authors="jayanth"

WORKDIR /app/shopping

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8007

CMD ["npm", "run", "start"]