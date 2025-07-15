// src/lib/env.ts

// Definiere einen Typ für unsere globale Konfiguration für mehr Sicherheit
type AppConfig = {
    [key: string]: string;
};

// Greife auf das globale Konfigurationsobjekt zu.
// Wir fügen einen leeren Fallback hinzu, falls es nicht geladen werden kann.
const env: AppConfig = window.env || {};

// Exportiere die Konfigurationswerte.
// Die Werte werden direkt aus dem globalen Objekt gelesen.

export const OPENAI_API_KEY: string = env.VITE_OPENAI_API_KEY ?? '';
export const OPENAI_API_ENDPOINT: string =
    env.VITE_OPENAI_API_ENDPOINT ?? 'https://api.openai.com/v1';
export const LLM_MODEL_NAME: string =
    env.VITE_LLM_MODEL_NAME ?? 'gpt-3.5-turbo';

// Wichtig: Umgebungsvariablen sind immer Strings. Wir müssen Booleans explizit umwandeln.
export const IS_CHARTDB_IO: boolean = env.VITE_IS_CHARTDB_IO === 'true';
export const HIDE_CHARTDB_CLOUD: boolean =
    env.VITE_HIDE_CHARTDB_CLOUD === 'true';
export const DISABLE_ANALYTICS: boolean = env.VITE_DISABLE_ANALYTICS === 'true';
export const AUTO_LOAD_JSON: boolean = env.VITE_AUTO_LOAD_JSON === 'true';

// URLs und andere Strings
export const APP_URL: string = env.VITE_APP_URL ?? '';
export const HOST_URL: string = env.VITE_HOST_URL ?? '';
export const AUTO_LOAD_API_ENDPOINT: string =
    env.VITE_AUTO_LOAD_API_ENDPOINT ?? '';
export const DATABASE_TYPE: string = env.VITE_DATABASE_TYPE ?? '';
export const AUTO_LOAD_SQL_API_ENDPOINT: string =
    env.VITE_AUTO_LOAD_SQL_API_ENDPOINT ?? '';
