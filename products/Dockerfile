FROM node:18
LABEL authors="jayanth"

WORKDIR /app/products

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8006

CMD ["npm", "run", "start"]
