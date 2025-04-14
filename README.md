# Flight Tracker Event App

[![Vite](https://img.shields.io/badge/Vite-5.1.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Node](https://img.shields.io/badge/Node-20.11-339933?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)
[![Jest](https://img.shields.io/badge/Jest-6.4.x-C21325?logo=jest)](https://jestjs.io/)
[![codecov](https://codecov.io/gh/luismr/flight-tracker-event-app/branch/main/graph/badge.svg)](https://codecov.io/gh/luismr/flight-tracker-event-app)

A real-time flight tracking application built with React and TypeScript, following Domain-Driven Design principles.

## Prerequisites

### Development Environment
- Node.js 20.18 or higher
- npm 10.8 or higher
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Google Maps API Key
You'll need a Google Maps API key to display the map. Here's how to get one:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the required APIs:
   - Maps JavaScript API
   - Places API (if you plan to add search functionality)
4. Create credentials:
   - Go to "Credentials" in the left sidebar
   - Click "Create Credentials" > "API Key"
   - Your new API key will be displayed

5. (Recommended) Restrict the API key:
   - Go back to the Credentials page
   - Click on the newly created API key
   - Under "Application restrictions", choose "HTTP referrers"
   - Add your development and production domains
   - Under "API restrictions", select "Restrict key"
   - Select the APIs you enabled (Maps JavaScript API, etc.)
   - Click "Save"

## Project Structure

The project follows a feature-based Domain-Driven Design approach where each feature is organized in its own directory with DDD layers:

```
src/
├── flights/                # Flight tracking feature
│   ├── ui/                 # Presentation components
│   ├── application/        # Use cases and services
│   ├── domain/             # Entities and value objects
│   └── infrastructure/     # External services and adapters
├── shared/                 # Shared utilities and components
└── App.tsx                 # Application entry point

tests/
├── flights/              # Flight feature tests
│   ├── ui/              # UI component tests
│   ├── domain/          # Domain logic tests
│   └── infrastructure/  # Infrastructure tests
└── setupTests.ts        # Test environment setup
```

Each feature follows the DDD layered architecture:
- **UI Layer**: React components and hooks
- **Application Layer**: Services and use cases that orchestrate domain logic
- **Domain Layer**: Business entities, value objects, and core business rules
- **Infrastructure Layer**: External services, repositories, and technical implementations

The test structure mirrors the source code organization, making it easy to locate and maintain tests for each component.

## Getting Started

1. Clone the repository:
```bash
git clone git@github.com:luismr/flight-tracker-event-app.git
cd flight-tracker-event-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root:
```env
# WebSocket Configuration
VITE_WEBSOCKET_URL=ws://localhost:8080/map-updates
VITE_WEBSOCKET_RECONNECT_INTERVAL=5000
VITE_WEBSOCKET_MAX_RETRIES=5

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

- Real-time flight tracking via WebSocket
- Interactive Google Maps display showing all flights
- Custom airplane icons with status indicators
- Detailed flight information cards
- Automatic map bounds adjustment to show all flights
- Responsive design for mobile browsers

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Docker Deployment

Build and run the application using Docker:

### Using Docker Compose (Recommended)

```bash
# Create a .env file with your Google Maps API Key
echo "VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here" > .env

docker-compose up -d
```

The application will be available at `http://localhost`.

### Manual Docker Build

```bash
docker build -t flight-tracker-app .
```

### Running the Container Manually

```bash
docker run -d -p 80:80 \
  -e VITE_WEBSOCKET_URL=ws://your-websocket-server/map-updates \
  -e VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here \
  --name flight-tracker flight-tracker-app
```

### Environment Variables

When running with Docker Compose, edit the environment variables in `docker-compose.yml`:

```yaml
environment:
  - VITE_WEBSOCKET_URL=ws://your-websocket-server/map-updates
  - VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
  - VITE_WEBSOCKET_RECONNECT_INTERVAL=5000
  - VITE_WEBSOCKET_MAX_RETRIES=5
```

When running the container manually, pass all required environment variables:

```bash
docker run -d -p 80:80 \
  -e VITE_WEBSOCKET_URL=ws://your-websocket-server/map-updates \
  -e VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here \
  -e VITE_WEBSOCKET_RECONNECT_INTERVAL=5000 \
  -e VITE_WEBSOCKET_MAX_RETRIES=5 \
  --name flight-tracker flight-tracker-app
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

The test suite includes:
- Unit tests for domain logic
- Component tests with React Testing Library
- Integration tests for infrastructure services

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch:
```bash
git checkout -b feature/amazing-feature
```
3. Commit your changes:
```bash
git commit -m 'Add some amazing feature'
```
4. Push to the branch:
```bash
git push origin feature/amazing-feature
```
5. Open a Pull Request

Please make sure to:
- Follow the existing code style
- Add tests if applicable
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. 

