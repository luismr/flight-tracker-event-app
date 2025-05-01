import { PingDTO } from '../../application/dto/PingDTO';

interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxRetries: number;
}

type MessageHandler = (data: PingDTO) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private retryCount = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();

  constructor(url: string, reconnectInterval: number, maxRetries: number) {
    this.config = {
      url: url,
      reconnectInterval: reconnectInterval,
      maxRetries: maxRetries
    };
  }

  connect(): void {
    try {
      this.ws = new WebSocket(this.config.url);
      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnection();
    }
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket: Connected');
      this.retryCount = 0;
    };

    this.ws.onclose = (event) => {
      if (event.code !== 1000) { // Only log abnormal closures
        console.log('WebSocket: Disconnected', event.code);
      }
      this.handleReconnection();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);
        if (
          !rawData.id ||
          !rawData.aircraft ||
          !rawData.vector ||
          !rawData.position ||
          typeof rawData.last_update !== 'number'
        ) {
          // Only log invalid messages
          console.warn('Invalid flight data received');
          return;
        }

        const data: PingDTO = {
          id: rawData.id,
          aircraft: {
            icao24: rawData.aircraft.icao24,
            callsign: rawData.aircraft.callsign,
            origin_country: rawData.aircraft.origin_country,
            last_contact: rawData.aircraft.last_contact,
            squawk: rawData.aircraft.squawk,
            spi: rawData.aircraft.spi,
            sensors: Array.isArray(rawData.aircraft.sensors) ? rawData.aircraft.sensors : [],
          },
          vector: {
            velocity: rawData.vector.velocity,
            true_track: rawData.vector.true_track,
            vertical_rate: rawData.vector.vertical_rate,
          },
          position: {
            longitude: rawData.position.longitude,
            latitude: rawData.position.latitude,
            geo_altitude: rawData.position.geo_altitude,
            baro_altitude: rawData.position.baro_altitude,
            on_ground: rawData.position.on_ground,
            source: rawData.position.source,
            time: rawData.position.time,
          },
          last_update: rawData.last_update,
        };
        this.messageHandlers.forEach(handler => handler(data));
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
  }

  private handleReconnection(): void {
    if (this.retryCount >= this.config.maxRetries) {
      console.error('WebSocket: Max reconnection attempts reached');
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      this.retryCount++;
      this.connect();
    }, this.config.reconnectInterval);
  }

  onMessage(handler: MessageHandler): void {
    this.messageHandlers.add(handler);
  }

  offMessage(handler: MessageHandler): void {
    this.messageHandlers.delete(handler);
  }

  send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  disconnect(): void {
    if (this.ws) {
      console.log('Disconnecting WebSocket');
      this.ws.close();
      this.ws = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  getStatus(): string {
    if (!this.ws) return 'DISCONNECTED';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'CONNECTED';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'CLOSED';
      default:
        return 'UNKNOWN';
    }
  }
} 