// config.template.js
// Dies ist die Vorlage für die Konfiguration.
// Die Platzhalter werden durch ein Skript ersetzt.

// Possible Options for VITE_DATABASE_TYPE
// generic, postgresql, mysql, sql_server, mariadb, sqlite, clickhouse, cockroachdb, oracle

window.env = {
    VITE_OPENAI_API_KEY: '__VITE_OPENAI_API_KEY__',
    VITE_OPENAI_API_ENDPOINT: '__VITE_OPENAI_API_ENDPOINT__',
    VITE_LLM_MODEL_NAME: '__VITE_LLM_MODEL_NAME__',
    VITE_IS_CHARTDB_IO: '__VITE_IS_CHARTDB_IO__',
    VITE_APP_URL: '__VITE_APP_URL__',
    VITE_HOST_URL: '__VITE_HOST_URL__',
    VITE_HIDE_CHARTDB_CLOUD: '__VITE_HIDE_CHARTDB_CLOUD__',
    VITE_DISABLE_ANALYTICS: '__VITE_DISABLE_ANALYTICS__',
    VITE_AUTO_LOAD_JSON: '__VITE_AUTO_LOAD_JSON__',
    VITE_AUTO_LOAD_API_ENDPOINT: '__VITE_AUTO_LOAD_API_ENDPOINT__',
    VITE_DATABASE_TYPE: '__VITE_DATABASE_TYPE__',
    VITE_AUTO_LOAD_SQL_API_ENDPOINT: '__VITE_AUTO_LOAD_SQL_API_ENDPOINT__',
};
