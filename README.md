# Flight Tracker Event App

[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Node](https://img.shields.io/badge/Node-20.11-339933?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)

A real-time flight tracking application built with React and TypeScript, following Domain-Driven Design principles.

## Tech Stack

- Node.js 20.18
- npm 10.8
- TypeScript
- React
- Vite
- WebSocket
- Styled Components

## Project Structure

The project follows a domain-driven design approach with the following layers:

```
src/
├── ui/           # Presentation layer components
├── application/  # Application services and use cases
├── domain/       # Domain entities, value objects, and business logic
└── infrastructure/  # External services, repositories, and adapters
```

## Getting Started

### Prerequisites

- Node.js 20.18 or higher
- npm 10.8 or higher

### Installation

1. Clone the repository:
```bash
git clone git@github.com:luismr/flight-tracker-event-app.git
cd flight-tracker-event-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root with your WebSocket configuration:
```env
VITE_WEBSOCKET_URL="ws://localhost:8080/map-updates"
VITE_WEBSOCKET_RECONNECT_INTERVAL=5000
VITE_WEBSOCKET_MAX_RETRIES=5
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

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