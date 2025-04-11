import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { codecovVitePlugin } from '@codecov/vite-plugin';

// Plugin to log the execution of other plugins
const debugPlugin = (): Plugin => ({
  name: 'debug-plugin',
  configResolved(config) {
    console.log('\nActive Vite Plugins:');
    config.plugins.forEach((plugin) => {
      console.log(`  - ${plugin.name}`);
    });
    console.log('\n');
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    debugPlugin(),
    react({
      babel: {
        plugins: [
          ['babel-plugin-styled-components', { displayName: true, fileName: false }]
        ]
      }
    }),
    // Put the Codecov vite plugin after all other plugins
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: "flight-tracker-event-app",
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  build: {
    sourcemap: true, // Enable source maps for better coverage reporting
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'maps-vendor': ['@react-google-maps/api'],
        }
      }
    }
  }
}); 