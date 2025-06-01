FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g react-scripts
RUN ls /app/node_modules/.bin || echo "react-scripts not found in .bin"
COPY . .
RUN ls /app/src
EXPOSE 3000
CMD ["/usr/local/bin/npm", "start"] 