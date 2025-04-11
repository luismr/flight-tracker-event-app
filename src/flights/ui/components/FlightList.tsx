import React from 'react';
import styled from 'styled-components';
import { FlightEntity } from '../../domain/models/Flight';  
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
  flights: FlightEntity[];
  apiKey: string;
}

const getCardinalDirection = (heading: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((heading % 360) / 45)) % 8;
  return directions[index];
};

export const FlightList: React.FC<FlightListProps> = ({ flights, apiKey }) => {
  return (
    <Container>
      <FlightMap flights={flights} apiKey={apiKey} />
      <ListContainer>
        {flights.map((flight) => (
          <FlightCard key={flight.icao24}>
            <FlightHeader>
              <Callsign>{flight.callsign}</Callsign>
              <span>
                {flight.onGround ? '🛬 On Ground' : '✈️ In Air'} 
                {flight.isActive() ? ' 🟢' : ' 🔴'}
              </span>
            </FlightHeader>
            <FlightInfo>
              <div>
                <strong>Heading:</strong> {Math.round(flight.trueTrack)}° ({getCardinalDirection(flight.trueTrack)})
              </div>
              <div>
                <strong>Altitude:</strong> {Math.round(flight.altitude)}ft
              </div>
              <div>
                <strong>Speed:</strong> {Math.round(flight.velocity)}kts
              </div>
              <div>
                <strong>Vertical Rate:</strong> {Math.round(flight.verticalRate)}ft/min
              </div>
              <div>
                <strong>Position:</strong> {flight.latitude.toFixed(4)}, {flight.longitude.toFixed(4)}
              </div>
              <div>
                <strong>Last Update:</strong>{' '}
                {flight.lastUpdate.toLocaleTimeString()}
              </div>
            </FlightInfo>
          </FlightCard>
        ))}
      </ListContainer>
    </Container>
  );
}; 