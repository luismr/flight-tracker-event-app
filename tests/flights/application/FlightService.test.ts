import { FlightService } from '../../../src/flights/application/FlightService';
import { FlightData } from '../../../src/flights/domain/Flight';

describe('FlightService', () => {
  let flightService: FlightService;
  let mockFlightData: FlightData;

  beforeEach(() => {
    flightService = new FlightService();
    mockFlightData = {
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
  });

  describe('addOrUpdateFlight', () => {
    it('should add a new flight when it does not exist', () => {
      flightService.addOrUpdateFlight(mockFlightData);
      const flight = flightService.getFlightById(mockFlightData.icao24);
      expect(flight).toBeDefined();
      expect(flight?.icao24).toBe(mockFlightData.icao24);
    });

    it('should update existing flight when it exists', () => {
      flightService.addOrUpdateFlight(mockFlightData);
      const updatedFlightData = { 
        ...mockFlightData,
        geo_altitude: 15000
      };
      flightService.addOrUpdateFlight(updatedFlightData);
      
      const flights = flightService.getAllFlights();
      expect(flights.length).toBe(1);
      expect(flights[0].altitude).toBe(15000);
    });
  });

  describe('getAllFlights', () => {
    it('should return empty array when no flights exist', () => {
      const flights = flightService.getAllFlights();
      expect(flights).toEqual([]);
    });

    it('should return all flights when flights exist', () => {
      flightService.addOrUpdateFlight(mockFlightData);
      const flights = flightService.getAllFlights();
      expect(flights.length).toBe(1);
      expect(flights[0].icao24).toBe(mockFlightData.icao24);
    });
  });

  describe('getActiveFlight', () => {
    it('should return only active flights', () => {
      const inactiveFlightData = {
        ...mockFlightData,
        timestamp: Math.floor((Date.now() - 600000) / 1000), // 10 minutes old
      };

      flightService.addOrUpdateFlight(mockFlightData);
      flightService.addOrUpdateFlight({ ...inactiveFlightData, icao24: 'inactive123' });

      const activeFlights = flightService.getActiveFlight();
      expect(activeFlights.length).toBe(1);
      expect(activeFlights[0].icao24).toBe(mockFlightData.icao24);
    });
  });

  describe('getFlightById', () => {
    it('should return undefined for non-existent flight', () => {
      const flight = flightService.getFlightById('nonexistent');
      expect(flight).toBeUndefined();
    });

    it('should return flight for existing id', () => {
      flightService.addOrUpdateFlight(mockFlightData);
      const flight = flightService.getFlightById(mockFlightData.icao24);
      expect(flight).toBeDefined();
      expect(flight?.icao24).toBe(mockFlightData.icao24);
    });
  });

  describe('removeInactiveFlights', () => {
    it('should remove inactive flights', () => {
      const inactiveFlightData = {
        ...mockFlightData,
        icao24: 'inactive123',
        timestamp: Math.floor((Date.now() - 600000) / 1000), // 10 minutes old
      };

      flightService.addOrUpdateFlight(mockFlightData);
      flightService.addOrUpdateFlight(inactiveFlightData);
      
      flightService.removeInactiveFlights();
      
      const flights = flightService.getAllFlights();
      expect(flights.length).toBe(1);
      expect(flights[0].icao24).toBe(mockFlightData.icao24);
    });

    it('should not remove active flights', () => {
      flightService.addOrUpdateFlight(mockFlightData);
      flightService.removeInactiveFlights();
      
      const flights = flightService.getAllFlights();
      expect(flights.length).toBe(1);
      expect(flights[0].icao24).toBe(mockFlightData.icao24);
    });
  });
}); 