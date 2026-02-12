FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy server files
COPY server ./server

# Expose ports
EXPOSE 5000 2525

# Start the server
CMD ["node", "server/index.js"]
