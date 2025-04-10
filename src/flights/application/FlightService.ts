import { FlightData, FlightEntity } from '../domain/Flight';

export class FlightService {
  private flights: Map<string, FlightEntity> = new Map();

  addOrUpdateFlight(flightData: FlightData): void {
    const existingFlight = this.flights.get(flightData.icao24);

    if (existingFlight) {
      existingFlight.updateFromFlightData(flightData);
    } else {
      const newFlight = FlightEntity.fromFlightData(flightData);
      this.flights.set(flightData.icao24, newFlight);
    }
  }

  getAllFlights(): FlightEntity[] {
    return Array.from(this.flights.values());
  }

  getActiveFlight(): FlightEntity[] {
    return this.getAllFlights().filter(flight => flight.isActive());
  }

  getFlightById(icao24: string): FlightEntity | undefined {
    return this.flights.get(icao24);
  }

  removeInactiveFlights(): void {
    for (const [id, flight] of this.flights.entries()) {
      if (!flight.isActive()) {
        this.flights.delete(id);
      }
    }
  }
} 