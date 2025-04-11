import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';
import { WebSocketService } from '../src/flights/infrastructure/websocket/WebSocketService';
import { FlightService } from '../src/flights/application/FlightService';
import { FlightData } from '../src/flights/domain/Flight';

// Mock services
const mockConnect = jest.fn();
const mockDisconnect = jest.fn();
const mockOnMessage = jest.fn();
const mockOffMessage = jest.fn();
const mockGetStatus = jest.fn();
const mockAddOrUpdateFlight = jest.fn();
const mockGetActiveFlight = jest.fn();
const mockRemoveInactiveFlights = jest.fn();

// Mock WebSocket service
jest.mock('../src/flights/infrastructure/websocket/WebSocketService', () => ({
  WebSocketService: jest.fn().mockImplementation(() => ({
    connect: mockConnect,
    disconnect: mockDisconnect,
    onMessage: mockOnMessage,
    offMessage: mockOffMessage,
    getStatus: mockGetStatus
  }))
}));

// Mock FlightService
jest.mock('../src/flights/application/FlightService', () => ({
  FlightService: jest.fn().mockImplementation(() => ({
    addOrUpdateFlight: mockAddOrUpdateFlight,
    getActiveFlight: mockGetActiveFlight,
    removeInactiveFlights: mockRemoveInactiveFlights
  }))
}));

describe('App', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    
    // Set default mock return values
    mockGetStatus.mockReturnValue('DISCONNECTED');
    mockGetActiveFlight.mockReturnValue([]);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders the title and connection status', () => {
    mockGetStatus.mockReturnValue('CONNECTED');
    render(<App />);
    
    expect(screen.getByText('Flight Tracker')).toBeInTheDocument();
    expect(screen.getByText(/CONNECTED/)).toBeInTheDocument();
  });

  it('connects to WebSocket on mount', () => {
    render(<App />);
    
    expect(mockConnect).toHaveBeenCalled();
    expect(mockOnMessage).toHaveBeenCalled();
  });

  xit('updates connection status periodically', () => {
    mockGetStatus
      .mockReturnValueOnce('DISCONNECTED');

    render(<App />);

    expect(screen.getByText(/DISCONNECTED/)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/CONNECTING/)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/CONNECTED/)).toBeInTheDocument();
  });

  it('handles flight data updates', () => {
    render(<App />);

    const mockFlightData: FlightData = {
      ping_id: '123',
      icao24: 'abc123',
      callsign: 'TEST123',
      latitude: 37.7749,
      longitude: -122.4194,
      geo_altitude: 10000,
      baro_altitude: 10000,
      on_ground: false,
      velocity: 500,
      vertical_rate: 0,
      true_track: 90,
      timestamp: Math.floor(Date.now() / 1000)
    };

    // Get the message handler callback and call it
    const [[messageHandler]] = mockOnMessage.mock.calls;
    act(() => {
      messageHandler(mockFlightData);
    });

    expect(mockAddOrUpdateFlight).toHaveBeenCalledWith(mockFlightData);
    expect(mockGetActiveFlight).toHaveBeenCalled();
  });

  it('cleans up inactive flights periodically', () => {
    render(<App />);

    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(mockRemoveInactiveFlights).toHaveBeenCalled();
    expect(mockGetActiveFlight).toHaveBeenCalled();
  });

  it('cleans up on unmount', () => {
    const { unmount } = render(<App />);

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
    expect(mockOffMessage).toHaveBeenCalled();
  });
}); 