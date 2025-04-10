export interface FlightData {
  ping_id: string;
  icao24: string;
  callsign: string;
  latitude: number;
  longitude: number;
  geo_altitude: number;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number;
  vertical_rate: number;
  timestamp: number;
}

export class FlightEntity {
  constructor(
    public readonly icao24: string,
    public readonly callsign: string,
    public latitude: number,
    public longitude: number,
    public altitude: number,
    public velocity: number,
    public verticalRate: number,
    public onGround: boolean,
    public lastUpdate: Date
  ) {}

  static fromFlightData(data: FlightData): FlightEntity {
    return new FlightEntity(
      data.icao24,
      data.callsign,
      data.latitude,
      data.longitude,
      data.geo_altitude,
      data.velocity,
      data.vertical_rate,
      data.on_ground,
      new Date(data.timestamp * 1000) // Convert Unix timestamp to Date
    );
  }

  updateFromFlightData(data: FlightData): void {
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.altitude = data.geo_altitude;
    this.velocity = data.velocity;
    this.verticalRate = data.vertical_rate;
    this.onGround = data.on_ground;
    this.lastUpdate = new Date(data.timestamp * 1000);
  }

  isActive(): boolean {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return this.lastUpdate > fiveMinutesAgo;
  }

  getPosition(): { latitude: number; longitude: number; altitude: number } {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
      altitude: this.altitude
    };
  }

  getStatus(): { velocity: number; verticalRate: number; onGround: boolean } {
    return {
      velocity: this.velocity,
      verticalRate: this.verticalRate,
      onGround: this.onGround
    };
  }
} 