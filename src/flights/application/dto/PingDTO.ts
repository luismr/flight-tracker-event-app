export interface Aircraft {
  icao24: string;
  callsign: string;
  origin_country: string;
  last_contact: number;
  squawk: string;
  spi: boolean;
  sensors: number[];
}

export interface Vector {
  velocity: number;
  true_track: number;
  vertical_rate: number;
}

export interface Position {
  longitude: number;
  latitude: number;
  geo_altitude: number;
  baro_altitude: number;
  on_ground: boolean;
  source: number;
  time: number;
}

export class PingDTO {
  id: string;
  aircraft: Aircraft;
  vector: Vector;
  position: Position;
  last_update: number;

  constructor(
    id: string,
    aircraft: Aircraft,
    vector: Vector,
    position: Position,
    last_update: number
  ) {
    this.id = id;
    this.aircraft = aircraft;
    this.vector = vector;
    this.position = position;
    this.last_update = last_update;
  }
} 