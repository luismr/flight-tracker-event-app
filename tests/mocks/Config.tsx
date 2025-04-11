interface Config {
  GOOGLE_MAPS_API_KEY: string;
  WEBSOCKET_URL: string;
  WEBSOCKET_RECONNECT_INTERVAL: number;
  WEBSOCKET_MAX_RETRIES: number;
}

const config: Config = {
  GOOGLE_MAPS_API_KEY: 'test-api-key',
  WEBSOCKET_URL: 'ws://test.com',
  WEBSOCKET_RECONNECT_INTERVAL: 1000,
  WEBSOCKET_MAX_RETRIES: 3,
};

export default config; 