/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEBSOCKET_URL: string
  readonly VITE_WEBSOCKET_RECONNECT_INTERVAL: string
  readonly VITE_WEBSOCKET_MAX_RETRIES: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 