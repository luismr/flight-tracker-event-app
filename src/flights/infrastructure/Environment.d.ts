declare global {
  interface Window {
    environment: {
      GOOGLE_MAPS_API_KEY: string;
      WEBSOCKET_URL: string;
      WEBSOCKET_RECONNECT_INTERVAL: string;
      WEBSOCKET_MAX_RETRIES: string;
    };
  }
}

export {};
