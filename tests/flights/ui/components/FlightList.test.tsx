import React from 'react';
import { render, screen } from '@testing-library/react';
import { FlightList } from '../../../../src/flights/ui/components/FlightList';
import { FlightEntity } from '../../../../src/flights/domain/Flight';

// Mock the FlightMap component since we'll test it separately
jest.mock('../../../../src/flights/ui/components/FlightMap', () => ({
  FlightMap: () => <div data-testid="mock-flight-map" />
}));

describe('FlightList', () => {
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

  it('renders flight information correctly', () => {
    render(<FlightList flights={[mockFlight]} />);

    // Check if flight map is rendered
    expect(screen.getByTestId('mock-flight-map')).toBeInTheDocument();

    // Check if flight information is displayed
    expect(screen.getByText('TEST123')).toBeInTheDocument();
    expect(screen.getByText('270° (W)')).toBeInTheDocument();
    expect(screen.getByText('35000ft')).toBeInTheDocument();
    expect(screen.getByText('450kts')).toBeInTheDocument();
    expect(screen.getByText('✈️ In Air 🟢')).toBeInTheDocument();
  });

  it('renders multiple flights', () => {
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

    render(<FlightList flights={[mockFlight, mockFlight2]} />);

    expect(screen.getByText('TEST123')).toBeInTheDocument();
    expect(screen.getByText('TEST456')).toBeInTheDocument();
  });

  it('shows correct ground status', () => {
    const groundFlight = new FlightEntity(
      'ghi789',
      'TEST789',
      53.5074,
      -2.1278,
      0,
      0,
      0,
      true,
      new Date(),
      0
    );

    render(<FlightList flights={[groundFlight]} />);
    expect(screen.getByText('🛬 On Ground 🟢')).toBeInTheDocument();
  });

  it('shows inactive status correctly', () => {
    const inactiveFlight = new FlightEntity(
      'jkl012',
      'TEST012',
      54.5074,
      -3.1278,
      35000,
      450,
      0,
      false,
      new Date(Date.now() - 6 * 60 * 1000), // 6 minutes ago
      180
    );

    render(<FlightList flights={[inactiveFlight]} />);
    expect(screen.getByText('✈️ In Air 🔴')).toBeInTheDocument();
  });
}); 