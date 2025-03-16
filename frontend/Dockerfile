# # Stage 1: Build the React app
# FROM node:14-alpine AS build

# WORKDIR /app

# COPY package.json ./
# COPY package-lock.json ./
# RUN npm install

# COPY . ./
# RUN npm run build

# # Stage 2: Serve the app with nginx
# FROM nginx:alpine

# COPY --from=build /app/dist /usr/share/nginx/html

# # Add nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

FROM node:18

WORKDIR /app

COPY package*.json ./

# RUN apk add --no-cache nodejs-current 

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist"]