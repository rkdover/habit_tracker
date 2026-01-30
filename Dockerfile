# Use official Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Allow port to be set via environment variable, default to 3000
ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}

# Start the server
CMD ["npm", "start"]
