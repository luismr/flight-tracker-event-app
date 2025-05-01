import React from 'react';
import { render, screen } from '@testing-library/react';
import { FlightMap } from '../../../../src/flights/ui/components/FlightMap';
import { PingDTO } from '../../../../src/flights/application/dto/PingDTO';

// Mock the Google Maps components
const mockUseLoadScript = jest.fn(() => ({
  isLoaded: true,
  loadError: null
}));

jest.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-google-map">{children}</div>
  ),
  Marker: () => <div data-testid="mock-marker" />,
  useLoadScript: () => mockUseLoadScript()
}));

describe('FlightMap', () => {
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

  const testApiKey = 'test-api-key';

  beforeEach(() => {
    mockUseLoadScript.mockReturnValue({ isLoaded: true, loadError: null });
  });

  it('renders loading state correctly', () => {
    mockUseLoadScript.mockReturnValue({ isLoaded: false, loadError: null });
    render(<FlightMap flights={[]} apiKey={testApiKey} />);
    expect(screen.getByText('Loading maps...')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    mockUseLoadScript.mockReturnValue({ isLoaded: false, loadError: new Error('Failed to load') });
    render(<FlightMap flights={[]} apiKey={testApiKey} />);
    expect(screen.getByText('Error loading maps')).toBeInTheDocument();
  });

  it('renders map with flight markers', () => {
    render(<FlightMap flights={[mockPing]} apiKey={testApiKey} />);
    expect(screen.getByTestId('mock-google-map')).toBeInTheDocument();
    expect(screen.getByTestId('mock-marker')).toBeInTheDocument();
  });

  it('renders multiple flight markers', () => {
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

    render(<FlightMap flights={[mockPing, mockPing2]} apiKey={testApiKey} />);
    expect(screen.getByTestId('mock-google-map')).toBeInTheDocument();
    const markers = screen.getAllByTestId('mock-marker');
    expect(markers).toHaveLength(2);
  });
}); 