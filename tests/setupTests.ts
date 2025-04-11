import '@testing-library/jest-dom';

// Mock Google Maps API
const google = {
  maps: {
    Map: class {},
    Marker: class {},
    LatLngBounds: class {
      extend() { return this; }
    },
    Point: class {},
  },
};

global.google = google as any;

// Mock the Config module
jest.mock('../src/flights/infrastructure/Config', () => ({
  __esModule: true,
  default: {
    GOOGLE_MAPS_API_KEY: 'test-api-key',
    WEBSOCKET_URL: 'ws://test.com',
    WEBSOCKET_RECONNECT_INTERVAL: 1000,
    WEBSOCKET_MAX_RETRIES: 3,
  },
})); 