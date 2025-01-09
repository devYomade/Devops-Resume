#Step 1: Build Stage
FROM node:16-slim AS build

#Set working directory inside the container
WORKDIR /app

#copy package.json and package-lock.json to leveragee Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Build the React app for production (this will create a 'build' directory)
RUN npm run build

FROM node:16-slim

WORKDIR /app

COPY --from=build /app/build /app/build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]