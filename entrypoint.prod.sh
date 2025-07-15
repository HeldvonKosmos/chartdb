#!/bin/sh

set -e

# Pfade innerhalb des Nginx-Containers
CONFIG_TEMPLATE="/usr/share/nginx/html/config.template.js"
CONFIG_FILE="/usr/share/nginx/html/config.js"

echo "Generiere Konfigurationsdatei für die Produktion..."

# Prüfen, ob die Vorlage existiert
if [ ! -f "$CONFIG_TEMPLATE" ]; then
    echo "FEHLER: Die Vorlagendatei $CONFIG_TEMPLATE wurde nicht gefunden."
    exit 1
fi

# Kopiere die Vorlage zur finalen Zieldatei
cp "$CONFIG_TEMPLATE" "$CONFIG_FILE"

# Ersetze die Platzhalter mit den Umgebungsvariablen.
# Wichtig: Hier verwenden wir keine Fallback-Werte, da in der Produktion
# alle Variablen explizit gesetzt werden sollten.
sed -i "s|__VITE_OPENAI_API_KEY__|${VITE_OPENAI_API_KEY}|g" "$CONFIG_FILE"
sed -i "s|__VITE_OPENAI_API_ENDPOINT__|${VITE_OPENAI_API_ENDPOINT}|g" "$CONFIG_FILE"
sed -i "s|__VITE_LLM_MODEL_NAME__|${VITE_LLM_MODEL_NAME}|g" "$CONFIG_FILE"
sed -i "s|__VITE_IS_CHARTDB_IO__|${VITE_IS_CHARTDB_IO}|g" "$CONFIG_FILE"
sed -i "s|__VITE_APP_URL__|${VITE_APP_URL}|g" "$CONFIG_FILE"
sed -i "s|__VITE_HOST_URL__|${VITE_HOST_URL}|g" "$CONFIG_FILE"
sed -i "s|__VITE_HIDE_CHARTDB_CLOUD__|${VITE_HIDE_CHARTDB_CLOUD}|g" "$CONFIG_FILE"
sed -i "s|__VITE_DISABLE_ANALYTICS__|${VITE_DISABLE_ANALYTICS}|g" "$CONFIG_FILE"
sed -i "s|__VITE_AUTO_LOAD_JSON__|${VITE_AUTO_LOAD_JSON}|g" "$CONFIG_FILE"
sed -i "s|__VITE_AUTO_LOAD_API_ENDPOINT__|${VITE_AUTO_LOAD_API_ENDPOINT}|g" "$CONFIG_FILE"
sed -i "s|__VITE_DATABASE_TYPE__|${VITE_DATABASE_TYPE}|g" "$CONFIG_FILE"
sed -i "s|__VITE_AUTO_LOAD_SQL_API_ENDPOINT__|${VITE_AUTO_LOAD_SQL_API_ENDPOINT}|g" "$CONFIG_FILE"

echo "✅ public/config.js wurde erfolgreich generiert."

# Starte den Nginx-Server im Vordergrund
exec nginx -g 'daemon off;'
