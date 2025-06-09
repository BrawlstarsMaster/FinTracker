FROM node:20-slim

WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/ ./

EXPOSE 5000

CMD [ "npm", "start" ] 