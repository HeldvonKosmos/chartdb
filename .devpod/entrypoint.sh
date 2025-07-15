#!/bin/sh
# Bricht das Skript sofort ab, wenn ein Befehl fehlschlägt.
set -e

# Konfiguriert Git, den Credential Store zu verwenden.
# Dies geschieht beim Container-Start, nachdem die Volume-Mounts erfolgt sind.
git config --global credential.helper store
echo "Git credential helper configured."
# Setzt Git user.name und user.email aus Umgebungsvariablen, falls vorhanden.
if [ -n "$GIT_USER_NAME" ]; then
    git config --global user.name "$GIT_USER_NAME"
    echo "Git user.name set to '$GIT_USER_NAME'"
fi

if [ -n "$GIT_USER_EMAIL" ]; then
    git config --global user.email "$GIT_USER_EMAIL"
    echo "Git user.email set to '$GIT_USER_EMAIL'"
fi

cd /app

# --- Generiere dynamisch config.js ---
CONFIG_TEMPLATE="/app/config.template.js"
CONFIG_FILE="/app/public/config.js"

echo "Generating configuration file for development..."

if [ ! -f "$CONFIG_TEMPLATE" ]; then
    echo "Error: The template file $CONFIG_TEMPLATE was not found."
    exit 1
fi

# Kopiert die Vorlage und ersetzt die Platzhalter durch Umgebungsvariablen.
cp "$CONFIG_TEMPLATE" "$CONFIG_FILE"
sed -i "s|__VITE_OPENAI_API_KEY__|${VITE_OPENAI_API_KEY:-your_dev_key_here}|g" "$CONFIG_FILE"
sed -i "s|__VITE_OPENAI_API_ENDPOINT__|${VITE_OPENAI_API_ENDPOINT:-https://api.openai.com/v1}|g" "$CONFIG_FILE"
sed -i "s|__VITE_LLM_MODEL_NAME__|${VITE_LLM_MODEL_NAME:-gpt-3.5-turbo}|g" "$CONFIG_FILE"
sed -i "s|__VITE_IS_CHARTDB_IO__|${VITE_IS_CHARTDB_IO:-false}|g" "$CONFIG_FILE"
sed -i "s|__VITE_APP_URL__|${VITE_APP_URL:-http://localhost:5173}|g" "$CONFIG_FILE"
sed -i "s|__VITE_HOST_URL__|${VITE_HOST_URL:-http://localhost:5173}|g" "$CONFIG_FILE"
sed -i "s|__VITE_HIDE_CHARTDB_CLOUD__|${VITE_HIDE_CHARTDB_CLOUD:-false}|g" "$CONFIG_FILE"
sed -i "s|__VITE_DISABLE_ANALYTICS__|${VITE_DISABLE_ANALYTICS:-true}|g" "$CONFIG_FILE"
sed -i "s|__VITE_AUTO_LOAD_JSON__|${VITE_AUTO_LOAD_JSON:-true}|g" "$CONFIG_FILE"
sed -i "s|__VITE_AUTO_LOAD_API_ENDPOINT__|${VITE_AUTO_LOAD_API_ENDPOINT:-http://localhost:8000/api/drawdb}|g" "$CONFIG_FILE"
sed -i "s|__VITE_DATABASE_TYPE__|${VITE_DATABASE_TYPE:-postgresql}|g" "$CONFIG_FILE"
sed -i "s|__VITE_AUTO_LOAD_SQL_API_ENDPOINT__|${VITE_AUTO_LOAD_SQL_API_ENDPOINT:-http://localhost:8000/api/drawdb/sql}|g" "$CONFIG_FILE"

echo "✅ public/config.js generated successfully."

exec tail -f /dev/null