import { FlightData, FlightEntity } from '../../../src/flights/domain/Flight';

describe('FlightEntity', () => {
  const mockFlightData: FlightData = {
    ping_id: '123',
    icao24: 'abc123',
    callsign: 'TEST123',
    latitude: 51.5074,
    longitude: -0.1278,
    geo_altitude: 35000,
    baro_altitude: 34800,
    on_ground: false,
    velocity: 450,
    vertical_rate: 0,
    true_track: 270,
    timestamp: Math.floor(Date.now() / 1000)
  };

  it('should create a flight entity from flight data', () => {
    const flight = FlightEntity.fromFlightData(mockFlightData);

    expect(flight.icao24).toBe(mockFlightData.icao24);
    expect(flight.callsign).toBe(mockFlightData.callsign);
    expect(flight.latitude).toBe(mockFlightData.latitude);
    expect(flight.longitude).toBe(mockFlightData.longitude);
    expect(flight.altitude).toBe(mockFlightData.geo_altitude);
    expect(flight.velocity).toBe(mockFlightData.velocity);
    expect(flight.verticalRate).toBe(mockFlightData.vertical_rate);
    expect(flight.onGround).toBe(mockFlightData.on_ground);
    expect(flight.trueTrack).toBe(mockFlightData.true_track);
  });

  it('should update flight entity from new flight data', () => {
    const flight = FlightEntity.fromFlightData(mockFlightData);
    const updatedData: FlightData = {
      ...mockFlightData,
      latitude: 52.5074,
      longitude: -1.1278,
      geo_altitude: 36000,
      velocity: 460,
      true_track: 280,
    };

    flight.updateFromFlightData(updatedData);

    expect(flight.latitude).toBe(updatedData.latitude);
    expect(flight.longitude).toBe(updatedData.longitude);
    expect(flight.altitude).toBe(updatedData.geo_altitude);
    expect(flight.velocity).toBe(updatedData.velocity);
    expect(flight.trueTrack).toBe(updatedData.true_track);
  });

  it('should correctly determine if flight is active', () => {
    const flight = FlightEntity.fromFlightData(mockFlightData);
    expect(flight.isActive()).toBe(true);

    // Create a flight with old timestamp (more than 5 minutes ago)
    const oldFlightData = {
      ...mockFlightData,
      timestamp: Math.floor(Date.now() / 1000) - 400
    };
    const oldFlight = FlightEntity.fromFlightData(oldFlightData);
    expect(oldFlight.isActive()).toBe(false);
  });

  it('should return correct position data', () => {
    const flight = FlightEntity.fromFlightData(mockFlightData);
    const position = flight.getPosition();

    expect(position).toEqual({
      latitude: mockFlightData.latitude,
      longitude: mockFlightData.longitude,
      altitude: mockFlightData.geo_altitude
    });
  });

  it('should return correct status data', () => {
    const flight = FlightEntity.fromFlightData(mockFlightData);
    const status = flight.getStatus();

    expect(status).toEqual({
      velocity: mockFlightData.velocity,
      verticalRate: mockFlightData.vertical_rate,
      onGround: mockFlightData.on_ground
    });
  });
}); 