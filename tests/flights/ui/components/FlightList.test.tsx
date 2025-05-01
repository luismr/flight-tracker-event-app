import React from 'react';
import { render, screen } from '@testing-library/react';
import { FlightList } from '../../../../src/flights/ui/components/FlightList';
import { PingDTO } from '../../../../src/flights/application/dto/PingDTO';

// Mock the FlightMap component since we'll test it separately
jest.mock('../../../../src/flights/ui/components/FlightMap', () => ({
  FlightMap: () => <div data-testid="mock-flight-map" />
}));

describe('FlightList', () => {
  const mockPing: PingDTO = {
    id: '123',
    aircraft: {
      icao24: 'abc123',
      callsign: 'TEST123',
      origin_country: 'TestCountry',
      last_contact: Date.now(),
      squawk: '1234',
      spi: false,
      sensors: [1, 2]
    },
    vector: {
      velocity: 450,
      true_track: 270,
      vertical_rate: 0
    },
    position: {
      longitude: -0.1278,
      latitude: 51.5074,
      geo_altitude: 35000,
      baro_altitude: 34800,
      on_ground: false,
      source: 1,
      time: Date.now()
    },
    last_update: Date.now()
  };

  it('renders flight information correctly', () => {
    render(<FlightList flights={[mockPing]} apiKey="test-api-key" />);

    // Check if flight map is rendered
    expect(screen.getByTestId('mock-flight-map')).toBeInTheDocument();

    // Check if flight information is displayed
    expect(screen.getByText('TEST123')).toBeInTheDocument();
    expect(screen.getByText('270° (W)')).toBeInTheDocument();
    expect(screen.getByText('35000ft')).toBeInTheDocument();
    expect(screen.getByText('450kts')).toBeInTheDocument();
    expect(screen.getByText('✈️ In Air')).toBeInTheDocument();
  });

  it('renders multiple flights', () => {
    const mockPing2: PingDTO = {
      ...mockPing,
      id: '456',
      aircraft: {
        ...mockPing.aircraft,
        icao24: 'def456',
        callsign: 'TEST456'
      },
      position: {
        ...mockPing.position,
        latitude: 52.5074,
        longitude: -1.1278,
        geo_altitude: 36000
      },
      vector: {
        ...mockPing.vector,
        velocity: 460,
        true_track: 90
      }
    };

    render(<FlightList flights={[mockPing, mockPing2]} apiKey="test-api-key" />);

    expect(screen.getByText('TEST123')).toBeInTheDocument();
    expect(screen.getByText('TEST456')).toBeInTheDocument();
  });

  it('shows correct ground status', () => {
    const groundPing: PingDTO = {
      ...mockPing,
      id: '789',
      aircraft: {
        ...mockPing.aircraft,
        icao24: 'ghi789',
        callsign: 'TEST789'
      },
      position: {
        ...mockPing.position,
        latitude: 53.5074,
        longitude: -2.1278,
        geo_altitude: 0,
        on_ground: true
      },
      vector: {
        velocity: 0,
        true_track: 0,
        vertical_rate: 0
      }
    };

    render(<FlightList flights={[groundPing]} apiKey="test-api-key" />);
    expect(screen.getByText('🛬 On Ground')).toBeInTheDocument();
  });

  it('shows inactive status correctly', () => {
    const inactivePing: PingDTO = {
      ...mockPing,
      id: '012',
      aircraft: {
        ...mockPing.aircraft,
        icao24: 'jkl012',
        callsign: 'TEST012'
      },
      position: {
        ...mockPing.position,
        latitude: 54.5074,
        longitude: -3.1278,
        geo_altitude: 35000
      },
      vector: {
        velocity: 450,
        true_track: 180,
        vertical_rate: 0
      },
      last_update: Date.now() - 6 * 60 * 1000 // 6 minutes ago
    };

    render(<FlightList flights={[inactivePing]} apiKey="test-api-key" />);
    expect(screen.getByText('✈️ In Air')).toBeInTheDocument();
  });
}); 