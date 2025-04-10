import { FlightData } from '../../domain/models/Flight';

interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxRetries: number;
}

type MessageHandler = (data: FlightData) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private retryCount = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();

  constructor() {
    this.config = {
      url: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080/map-updates',
      reconnectInterval: Number(import.meta.env.VITE_WEBSOCKET_RECONNECT_INTERVAL) || 5000,
      maxRetries: Number(import.meta.env.VITE_WEBSOCKET_MAX_RETRIES) || 5
    };
    
    console.log('WebSocket configuration loaded:', {
      url: this.config.url,
      reconnectInterval: this.config.reconnectInterval,
      maxRetries: this.config.maxRetries
    });
  }

  connect(): void {
    try {
      console.log(`Attempting to connect to WebSocket at ${this.config.url}`);
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
      console.log(`WebSocket connection established to ${this.config.url}`);
      this.retryCount = 0;
    };

    this.ws.onclose = (event) => {
      console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
      this.handleReconnection();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);
        this.messageHandlers.forEach(handler => handler(data));
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
  }

  private handleReconnection(): void {
    if (this.retryCount >= this.config.maxRetries) {
      console.error(`Max reconnection attempts (${this.config.maxRetries}) reached. Giving up.`);
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      this.retryCount++;
      console.log(`Attempting to reconnect (${this.retryCount}/${this.config.maxRetries})`);
      this.connect();
    }, this.config.reconnectInterval);
  }

  onMessage(handler: MessageHandler): void {
    this.messageHandlers.add(handler);
    console.log('Added message handler, total handlers:', this.messageHandlers.size);
  }

  offMessage(handler: MessageHandler): void {
    this.messageHandlers.delete(handler);
    console.log('Removed message handler, remaining handlers:', this.messageHandlers.size);
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