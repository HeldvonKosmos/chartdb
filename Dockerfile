# Stage 1: Bauen der React-Anwendung
FROM node:22-alpine AS builder
RUN npm install --global yarn

WORKDIR /usr/src/app

COPY package.json ./
RUN npm ci

COPY . .

# Der Build-Prozess ist jetzt komplett konfigurationsfrei.
RUN yarn run build

# Stage 2: Produktions-Image mit Nginx
FROM nginx:stable-alpine AS production

# Kopiere die gebaute Anwendung aus dem Builder-Stage
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Kopiere die Konfigurations-Vorlage, die vom Entrypoint verwendet wird
COPY ./config.template.js /usr/share/nginx/html/config.template.js

# Kopiere die Nginx-Konfiguration und das neue Entrypoint-Skript
COPY ./default.conf.template /etc/nginx/conf.d/default.conf.template
COPY ./entrypoint.prod.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

# Das Entrypoint-Skript wird beim Starten des Containers ausgeführt
ENTRYPOINT ["/entrypoint.sh"]
