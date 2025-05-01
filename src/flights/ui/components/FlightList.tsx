import React from 'react';
import styled from 'styled-components';
import { PingDTO } from '../../application/dto/PingDTO';
import { FlightMap } from './FlightMap';

const Container = styled.div`
  padding: 1rem;
  max-width: 100%;
  overflow-x: hidden;
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const FlightCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FlightHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Callsign = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #333;
`;

const FlightInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
`;

interface FlightListProps {
  flights: PingDTO[];
  apiKey: string;
}

const getCardinalDirection = (heading: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((heading % 360) / 45)) % 8;
  return directions[index];
};

export const FlightList: React.FC<FlightListProps> = ({ flights, apiKey }) => {
  const validFlights = flights.filter(flight => 
    flight &&
    flight.aircraft &&
    flight.vector &&
    flight.position &&
    typeof flight.position.latitude === 'number' &&
    !isNaN(flight.position.latitude) &&
    typeof flight.position.longitude === 'number' &&
    !isNaN(flight.position.longitude)
  );

  return (
    <Container>
      <FlightMap flights={validFlights} apiKey={apiKey} />
      <ListContainer>
        {validFlights.map((flight) => (
          <FlightCard key={flight.aircraft?.icao24 || flight.id}>
            <FlightHeader>
              <Callsign>{flight.aircraft?.callsign || 'UNKNOWN'}</Callsign>
              <span>
                {flight.position?.on_ground ? '🛬 On Ground' : '✈️ In Air'}
              </span>
            </FlightHeader>
            <FlightInfo>
              <div>
                <strong>Heading:</strong> {flight.vector?.true_track !== undefined ? Math.round(flight.vector.true_track) : 'N/A'}° ({getCardinalDirection(flight.vector?.true_track || 0)})
              </div>
              <div>
                <strong>Altitude:</strong> {flight.position?.geo_altitude !== undefined ? Math.round(flight.position.geo_altitude) : 'N/A'}ft
              </div>
              <div>
                <strong>Speed:</strong> {flight.vector?.velocity !== undefined ? Math.round(flight.vector.velocity) : 'N/A'}kts
              </div>
              <div>
                <strong>Vertical Rate:</strong> {flight.vector?.vertical_rate !== undefined ? Math.round(flight.vector.vertical_rate) : 'N/A'}ft/min
              </div>
              <div>
                <strong>Position:</strong> {flight.position?.latitude?.toFixed(4) || 'N/A'}, {flight.position?.longitude?.toFixed(4) || 'N/A'}
              </div>
              <div>
                <strong>Last Update:</strong>{' '}
                {flight.last_update ? new Date(flight.last_update).toLocaleTimeString() : 'N/A'}
              </div>
            </FlightInfo>
          </FlightCard>
        ))}
      </ListContainer>
    </Container>
  );
}; 