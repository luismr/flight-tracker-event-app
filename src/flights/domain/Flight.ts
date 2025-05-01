export class FlightEntity {
  constructor(
    public readonly id: string,
    public readonly icao24: string,
    public readonly callsign: string,
    public readonly originCountry: string,
    public latitude: number,
    public longitude: number,
    public geoAltitude: number,
    public baroAltitude: number,
    public onGround: boolean,
    public velocity: number,
    public verticalRate: number,
    public trueTrack: number,
    public lastUpdate: Date,
    public squawk: string,
    public spi: boolean,
    public sensors: number[],
    public positionSource: number
  ) {}

  isActive(): boolean {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const isActive = this.lastUpdate > fiveMinutesAgo;  
    return isActive;
  }

  getPosition(): { latitude: number; longitude: number; geoAltitude: number; baroAltitude: number } {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
      geoAltitude: this.geoAltitude,
      baroAltitude: this.baroAltitude
    };
  }

  getStatus(): { velocity: number; verticalRate: number; onGround: boolean } {
    return {
      velocity: this.velocity,
      verticalRate: this.verticalRate,
      onGround: this.onGround
    };
  }

  update(entity: FlightEntity): void {
    this.latitude = entity.latitude;
    this.longitude = entity.longitude;
    this.geoAltitude = entity.geoAltitude;
    this.baroAltitude = entity.baroAltitude;
    this.onGround = entity.onGround;
    this.velocity = entity.velocity;
    this.verticalRate = entity.verticalRate;
    this.trueTrack = entity.trueTrack;
    this.squawk = entity.squawk;
    this.spi = entity.spi;
    this.sensors = entity.sensors;
    this.positionSource = entity.positionSource;
    this.lastUpdate = entity.lastUpdate;
  }
} 