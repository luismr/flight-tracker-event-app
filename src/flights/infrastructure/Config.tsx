interface Config {
  GOOGLE_MAPS_API_KEY: string;
  WEBSOCKET_URL: string;
  WEBSOCKET_RECONNECT_INTERVAL: number;
  WEBSOCKET_MAX_RETRIES: number;
}

const config: Config = {
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080/map-updates',
  WEBSOCKET_RECONNECT_INTERVAL: Number(import.meta.env.VITE_WEBSOCKET_RECONNECT_INTERVAL) || 5000,
  WEBSOCKET_MAX_RETRIES: Number(import.meta.env.VITE_WEBSOCKET_MAX_RETRIES) || 3,
};

export default config; 