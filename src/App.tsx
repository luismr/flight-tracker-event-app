import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FlightList } from './flights/ui/components/FlightList';
import { FlightService } from './flights/application/FlightService';
import { WebSocketService } from './flights/infrastructure/websocket/WebSocketService';
import { PingDTO } from './flights/application/dto/PingDTO';
import config from './flights/infrastructure/Config';
import { PingMapper } from './flights/application/dto/PingMapper';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 1rem;
`;

const Header = styled.header`
  background-color: #ffffff;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  text-align: center;
`;

const ConnectionStatus = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: ${({ status }) => {
    switch (status) {
      case 'CONNECTED':
        return '#2ecc71';
      case 'CONNECTING':
        return '#f1c40f';
      default:
        return '#e74c3c';
    }
  }};
`;

function App() {
  const [flightService] = useState(() => new FlightService());
  const [webSocketService] = useState(
    () => new WebSocketService(
      config.WEBSOCKET_URL,
      config.WEBSOCKET_RECONNECT_INTERVAL,
      config.WEBSOCKET_MAX_RETRIES
    )
  );
  const [flights, setFlights] = useState<PingDTO[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');

  useEffect(() => {
    const updateFlights = () => {
      const activeFlights = flightService.getActiveFlight();
      const pingDTOs = activeFlights.map(flight => PingMapper.fromFlightEntity(flight));
      setFlights(pingDTOs);
    };

    const handleFlightData = (ping: PingDTO) => {
      flightService.addOrUpdateFlight(ping);  
      updateFlights();
    };

    // Connect to WebSocket and set up message handler
    webSocketService.connect();
    webSocketService.onMessage(handleFlightData);

    // Update connection status periodically
    const statusInterval = setInterval(() => {
      setConnectionStatus(webSocketService.getStatus());
    }, 1000);

    // Clean up inactive flights periodically
    const cleanupInterval = setInterval(() => {
      flightService.removeInactiveFlights();
      updateFlights();
    }, 60000); // Every minute

    return () => {
      webSocketService.disconnect();
      clearInterval(cleanupInterval);
      clearInterval(statusInterval);
      webSocketService.offMessage(handleFlightData);
    };
  }, [flightService, webSocketService]);

  return (
    <AppContainer>
      <Header>
        <Title>Flight Tracker</Title>
        <ConnectionStatus status={connectionStatus}>
          {connectionStatus === 'CONNECTED' ? '🟢' : connectionStatus === 'CONNECTING' ? '🟡' : '🔴'} {connectionStatus}
        </ConnectionStatus>
      </Header>
      <FlightList flights={flights} apiKey={config.GOOGLE_MAPS_API_KEY} />
    </AppContainer>
  );
}

export default App; 