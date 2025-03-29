# Stage 1: Build the application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN npm run build

# Stage 2: Deploy the application
FROM node:18-alpine AS deploy

# Install Vulkan drivers for GPU acceleration
RUN apk add --update --no-cache vulkan-loader

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy build artifacts from the build stage
COPY --from=build /app/dist ./dist

# Expose the port the app runs on
EXPOSE ${PORT:-5066}

# Start the application
CMD ["npm", "start"]