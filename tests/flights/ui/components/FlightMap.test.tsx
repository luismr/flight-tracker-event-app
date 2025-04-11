import React from 'react';
import { render, screen } from '@testing-library/react';
import { FlightMap } from '../../../../src/flights/ui/components/FlightMap';
import { FlightEntity } from '../../../../src/flights/domain/Flight';

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
  const mockFlight = new FlightEntity(
    'abc123',
    'TEST123',
    51.5074,
    -0.1278,
    35000,
    450,
    0,
    false,
    new Date(),
    270
  );

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
    render(<FlightMap flights={[mockFlight]} apiKey={testApiKey} />);
    expect(screen.getByTestId('mock-google-map')).toBeInTheDocument();
    expect(screen.getByTestId('mock-marker')).toBeInTheDocument();
  });

  it('renders multiple flight markers', () => {
    const mockFlight2 = new FlightEntity(
      'def456',
      'TEST456',
      52.5074,
      -1.1278,
      36000,
      460,
      0,
      false,
      new Date(),
      90
    );

    render(<FlightMap flights={[mockFlight, mockFlight2]} apiKey={testApiKey} />);
    expect(screen.getByTestId('mock-google-map')).toBeInTheDocument();
    const markers = screen.getAllByTestId('mock-marker');
    expect(markers).toHaveLength(2);
  });
}); 