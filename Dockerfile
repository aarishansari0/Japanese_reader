FROM node:18

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything else
COPY . .

EXPOSE 8000

CMD ["node", "server.js"]