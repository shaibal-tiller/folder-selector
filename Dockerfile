# Stage 1: Build the React app
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json .

# Configure npm
RUN npm config set fetch-retry-maxtimeout 60000 -g
RUN npm config set fetch-retries 5
RUN npm config set strict-ssl false

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 80
EXPOSE 3000

CMD ["npm", "start"]

