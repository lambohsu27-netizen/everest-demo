# Build Vite SPA; bake VITE_API_BASE_URL at build time (public browser URL to backoffice-service).
# Example: docker build --build-arg VITE_API_BASE_URL=https://everest-api.merpati.io/backoffice .
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY interstellar-component ./interstellar-component
RUN npm install

COPY . .


RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
