import { PingDTO } from './PingDTO';
import { FlightEntity } from '../../domain/Flight';

export class PingMapper {
  static toFlightEntity(ping: PingDTO): FlightEntity {
    // Convert timestamp from seconds to milliseconds
    const timestamp = (ping.last_update || ping.position.time) * 1000;
    return new FlightEntity(
      ping.id,
      ping.aircraft.icao24,
      ping.aircraft.callsign,
      ping.aircraft.origin_country,
      ping.position.latitude,
      ping.position.longitude,
      ping.position.geo_altitude,
      ping.position.baro_altitude,
      ping.position.on_ground,
      ping.vector.velocity,
      ping.vector.vertical_rate,
      ping.vector.true_track,
      new Date(timestamp),
      ping.aircraft.squawk,
      ping.aircraft.spi,
      ping.aircraft.sensors,
      ping.position.source
    );
  }

  static fromFlightEntity(entity: FlightEntity): PingDTO {
    return new PingDTO(
      entity.id,
      {
        icao24: entity.icao24,
        callsign: entity.callsign,
        origin_country: entity.originCountry,
        last_contact: entity.lastUpdate.getTime(),
        squawk: entity.squawk,
        spi: entity.spi,
        sensors: entity.sensors
      },
      {
        velocity: entity.velocity,
        vertical_rate: entity.verticalRate,
        true_track: entity.trueTrack
      },
      {
        longitude: entity.longitude,
        latitude: entity.latitude,
        geo_altitude: entity.geoAltitude,
        baro_altitude: entity.baroAltitude,
        on_ground: entity.onGround,
        source: entity.positionSource,
        time: entity.lastUpdate.getTime()
      },
      entity.lastUpdate.getTime()
    );
  }
} 