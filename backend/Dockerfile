#Step 1: Build Stage
FROM node:18.19.1-alpine3.19 AS build

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker's cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Step 2: Runtime Stage
FROM node:18.19.1-alpine3.19

# Set working directory inside the container
WORKDIR /app

# Copy node_modules and app files from the build stage
COPY --from=build /app /app

# Expose the port the app will run on
EXPOSE 3001

CMD [ "npm", "start" ]