FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN node -e "try { require('dotenv'); console.log('dotenv found'); } catch (e) { console.error('dotenv not found'); process.exit(1); }"
COPY . .
RUN ls /app/src/models
EXPOSE 5000
CMD ["/usr/local/bin/npm", "start"] 