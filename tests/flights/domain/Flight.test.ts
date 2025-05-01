import { FlightEntity } from '../../../src/flights/domain/Flight';
import { PingDTO } from '../../../src/flights/application/dto/PingDTO';
import { PingMapper } from '../../../src/flights/application/dto/PingMapper';

describe('FlightEntity', () => {
  const mockPing: PingDTO = {
    id: '123',
    aircraft: {
      icao24: 'abc123',
      callsign: 'TEST123',
      origin_country: 'TestCountry',
      last_contact: Math.floor(Date.now() / 1000),
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
      time: Math.floor(Date.now() / 1000)
    },
    last_update: Math.floor(Date.now() / 1000)
  };

  it('should create a flight entity from PingDTO', () => {
    const flight = PingMapper.toFlightEntity(mockPing);
    expect(flight.icao24).toBe(mockPing.aircraft.icao24);
    expect(flight.callsign).toBe(mockPing.aircraft.callsign);
    expect(flight.latitude).toBe(mockPing.position.latitude);
    expect(flight.longitude).toBe(mockPing.position.longitude);
    expect(flight.geoAltitude).toBe(mockPing.position.geo_altitude);
    expect(flight.velocity).toBe(mockPing.vector.velocity);
    expect(flight.verticalRate).toBe(mockPing.vector.vertical_rate);
    expect(flight.onGround).toBe(mockPing.position.on_ground);
    expect(flight.trueTrack).toBe(mockPing.vector.true_track);
  });

  it('should update flight entity from new PingDTO', () => {
    const flight = PingMapper.toFlightEntity(mockPing);
    const updatedPing: PingDTO = {
      ...mockPing,
      position: {
        ...mockPing.position,
        latitude: 52.5074,
        longitude: -1.1278,
        geo_altitude: 36000
      },
      vector: {
        ...mockPing.vector,
        velocity: 460,
        true_track: 280
      }
    };
    // Update the entity in-place
    flight.latitude = updatedPing.position.latitude;
    flight.longitude = updatedPing.position.longitude;
    flight.geoAltitude = updatedPing.position.geo_altitude;
    flight.velocity = updatedPing.vector.velocity;
    flight.trueTrack = updatedPing.vector.true_track;
    expect(flight.latitude).toBe(updatedPing.position.latitude);
    expect(flight.longitude).toBe(updatedPing.position.longitude);
    expect(flight.geoAltitude).toBe(updatedPing.position.geo_altitude);
    expect(flight.velocity).toBe(updatedPing.vector.velocity);
    expect(flight.trueTrack).toBe(updatedPing.vector.true_track);
  });

  it('should correctly determine if flight is active', () => {
    const flight = PingMapper.toFlightEntity(mockPing);
    expect(flight.isActive()).toBe(true);
    // Create a flight with old timestamp (more than 5 minutes ago)
    const oldPing: PingDTO = {
      ...mockPing,
      last_update: Math.floor((Date.now() - 400 * 1000) / 1000)
    };
    const oldFlight = PingMapper.toFlightEntity(oldPing);
    expect(oldFlight.isActive()).toBe(false);
  });

  it('should return correct position data', () => {
    const flight = PingMapper.toFlightEntity(mockPing);
    const position = flight.getPosition();
    expect(position).toEqual({
      latitude: mockPing.position.latitude,
      longitude: mockPing.position.longitude,
      geoAltitude: mockPing.position.geo_altitude,
      baroAltitude: mockPing.position.baro_altitude
    });
  });

  it('should return correct status data', () => {
    const flight = PingMapper.toFlightEntity(mockPing);
    const status = flight.getStatus();
    expect(status).toEqual({
      velocity: mockPing.vector.velocity,
      verticalRate: mockPing.vector.vertical_rate,
      onGround: mockPing.position.on_ground
    });
  });
}); 