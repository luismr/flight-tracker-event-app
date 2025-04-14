interface Config {
  GOOGLE_MAPS_API_KEY: string;
  WEBSOCKET_URL: string;
  WEBSOCKET_RECONNECT_INTERVAL: number;
  WEBSOCKET_MAX_RETRIES: number;
}

const config: Config = {
  GOOGLE_MAPS_API_KEY: window.environment.GOOGLE_MAPS_API_KEY || '',
  WEBSOCKET_URL: window.environment.WEBSOCKET_URL || 'ws://localhost:8080/map-updates',
  WEBSOCKET_RECONNECT_INTERVAL: Number(window.environment.WEBSOCKET_RECONNECT_INTERVAL) || 5000,
  WEBSOCKET_MAX_RETRIES: Number(window.environment.WEBSOCKET_MAX_RETRIES) || 3,
};

export default config; 