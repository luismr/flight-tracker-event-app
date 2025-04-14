#!/bin/sh

# Create env.js with environment variables
cat <<EOF > /usr/share/nginx/html/env.js
window.environment = {
  GOOGLE_MAPS_API_KEY: "${GOOGLE_MAPS_API_KEY}",
  WEBSOCKET_URL: "${WEBSOCKET_URL}",
  WEBSOCKET_RECONNECT_INTERVAL: "${WEBSOCKET_RECONNECT_INTERVAL}",
  WEBSOCKET_MAX_RETRIES: "${WEBSOCKET_MAX_RETRIES}"
};
EOF

# Start nginx
exec nginx -g 'daemon off;'