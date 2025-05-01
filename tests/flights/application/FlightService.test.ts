import { FlightService } from '../../../src/flights/application/FlightService';
import { PingDTO } from '../../../src/flights/application/dto/PingDTO';
import { PingMapper } from '../../../src/flights/application/dto/PingMapper';

describe('FlightService', () => {
  let flightService: FlightService;
  let mockPing: PingDTO;

  beforeEach(() => {
    flightService = new FlightService();
    mockPing = {
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
        velocity: 500,
        true_track: 90,
        vertical_rate: 0
      },
      position: {
        longitude: -122.4194,
        latitude: 37.7749,
        geo_altitude: 10000,
        baro_altitude: 10000,
        on_ground: false,
        source: 1,
        time: Date.now()
      },
      last_update: Date.now()
    };
  });

  describe('addOrUpdateFlight', () => {
    it('should add a new flight when it does not exist', () => {
      flightService.addOrUpdateFlight(mockPing);
      const flight = flightService.getFlightById(mockPing.aircraft.icao24);
      expect(flight).toBeDefined();
      expect(flight?.icao24).toBe(mockPing.aircraft.icao24);
    });

    it('should update existing flight when it exists', () => {
      flightService.addOrUpdateFlight(mockPing);
      const updatedPing = { 
        ...mockPing,
        position: {
          ...mockPing.position,
          geo_altitude: 15000
        }
      };
      flightService.addOrUpdateFlight(updatedPing);
      const flights = flightService.getAllFlights();
      expect(flights.length).toBe(1);
      expect(flights[0].geoAltitude).toBe(15000);
    });
  });

  describe('getAllFlights', () => {
    it('should return empty array when no flights exist', () => {
      const flights = flightService.getAllFlights();
      expect(flights).toEqual([]);
    });

    it('should return all flights when flights exist', () => {
      flightService.addOrUpdateFlight(mockPing);
      const flights = flightService.getAllFlights();
      expect(flights.length).toBe(1);
      expect(flights[0].icao24).toBe(mockPing.aircraft.icao24);
    });
  });

  describe('getActiveFlight', () => {
    it('should return only active flights', () => {
      const inactivePing = {
        ...mockPing,
        aircraft: { ...mockPing.aircraft, icao24: 'inactive123' },
        last_update: Date.now() - 600000 // 10 minutes old
      };
      flightService.addOrUpdateFlight(mockPing);
      flightService.addOrUpdateFlight(inactivePing);
      const activeFlights = flightService.getActiveFlight();
      expect(activeFlights.length).toBe(1);
      expect(activeFlights[0].icao24).toBe(mockPing.aircraft.icao24);
    });
  });

  describe('getFlightById', () => {
    it('should return undefined for non-existent flight', () => {
      const flight = flightService.getFlightById('nonexistent');
      expect(flight).toBeUndefined();
    });

    it('should return flight for existing id', () => {
      flightService.addOrUpdateFlight(mockPing);
      const flight = flightService.getFlightById(mockPing.aircraft.icao24);
      expect(flight).toBeDefined();
      expect(flight?.icao24).toBe(mockPing.aircraft.icao24);
    });
  });

  describe('removeInactiveFlights', () => {
    it('should remove inactive flights', () => {
      const inactivePing = {
        ...mockPing,
        aircraft: { ...mockPing.aircraft, icao24: 'inactive123' },
        last_update: Date.now() - 600000 // 10 minutes old
      };
      flightService.addOrUpdateFlight(mockPing);
      flightService.addOrUpdateFlight(inactivePing);
      flightService.removeInactiveFlights();
      const flights = flightService.getAllFlights();
      expect(flights.length).toBe(1);
      expect(flights[0].icao24).toBe(mockPing.aircraft.icao24);
    });

    it('should not remove active flights', () => {
      flightService.addOrUpdateFlight(mockPing);
      flightService.removeInactiveFlights();
      const flights = flightService.getAllFlights();
      expect(flights.length).toBe(1);
      expect(flights[0].icao24).toBe(mockPing.aircraft.icao24);
    });
  });
}); 