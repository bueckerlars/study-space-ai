# Stage 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app

# Define build arguments
ARG VITE_API_URL
# Make build arg available as environment variable during build
ENV VITE_API_URL=$VITE_API_URL

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . ./

# Build the application
RUN npm run build

# Stage 2: Serve the app with nginx
FROM nginx:alpine AS deploy

# Copy build output from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]