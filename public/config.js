// config.template.js
// Dies ist die Vorlage für die Konfiguration.
// Die Platzhalter werden durch ein Skript ersetzt.

window.env = {
    VITE_OPENAI_API_KEY: 'your_dev_key_here',
    VITE_OPENAI_API_ENDPOINT: 'https://api.openai.com/v1',
    VITE_LLM_MODEL_NAME: 'gpt-3.5-turbo',
    VITE_IS_CHARTDB_IO: 'false',
    VITE_APP_URL: 'http://localhost:5172',
    VITE_HOST_URL: 'http://localhost:5172',
    VITE_HIDE_CHARTDB_CLOUD: 'false',
    VITE_DISABLE_ANALYTICS: 'true',
    VITE_AUTO_LOAD_JSON: 'true',
    VITE_AUTO_LOAD_API_ENDPOINT: 'http://localhost:8000/api/drawdb',
    VITE_DATABASE_TYPE: 'postgresql',
    VITE_AUTO_LOAD_SQL_API_ENDPOINT: 'http://localhost:8000/api/drawdb/sql',
};
