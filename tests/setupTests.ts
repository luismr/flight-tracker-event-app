import '@testing-library/jest-dom';

// Mock Vite's import.meta.env
const importMetaEnv = {
  VITE_GOOGLE_MAPS_API_KEY: 'test-api-key',
};

global.import = {
  meta: {
    env: importMetaEnv,
  },
};

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