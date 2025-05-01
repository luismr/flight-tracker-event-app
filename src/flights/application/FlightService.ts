import { PingDTO } from './dto/PingDTO';
import { PingMapper } from './dto/PingMapper';
import { FlightEntity } from '../domain/Flight';

export class FlightService {
  private flights: Map<string, FlightEntity> = new Map();

  addOrUpdateFlight(ping: PingDTO): void {
    const flightData = PingMapper.toFlightEntity(ping);
    const existingFlight = this.flights.get(flightData.icao24);

    if (existingFlight) {
      existingFlight.update(flightData);
    } else {
      this.flights.set(flightData.icao24, flightData);
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
        console.log('removeInactiveFlights: removing flight with id =', id);
        this.flights.delete(id);
      }
    }
  }
} 