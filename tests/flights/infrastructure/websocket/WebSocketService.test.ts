import { WebSocketService } from '../../../../src/flights/infrastructure/websocket/WebSocketService';
import { PingDTO } from '../../../../src/flights/application/dto/PingDTO';

// Mock Vite's import.meta.env
jest.mock('../../../../src/flights/infrastructure/websocket/WebSocketService', () => {
  const actual = jest.requireActual('../../../../src/flights/infrastructure/websocket/WebSocketService');
  return {
    ...actual,
    WebSocketService: class extends actual.WebSocketService {
      constructor() {
        super();
        // Mock the environment variables
        (this as any).config = {
          url: 'ws://test.com',
          reconnectInterval: 1000,
          maxRetries: 3
        };
      }
    }
  };
});

// Mock WebSocket
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  onopen: (() => void) | null = null;
  onclose: ((event: any) => void) | null = null;
  onerror: ((error: any) => void) | null = null;
  onmessage: ((event: any) => void) | null = null;

  constructor(public url: string) {
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.onopen?.();
    }, 0);
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.({ code: 1000, reason: 'Normal closure' });
  }

  send(data: string) {
    // Mock send implementation
  }
}

describe('WebSocketService', () => {
  let webSocketService: WebSocketService;
  let mockWebSocket: typeof MockWebSocket;
  const TEST_URL = 'ws://test.com';
  const TEST_RECONNECT_INTERVAL = 100; // Reduced for faster tests
  const TEST_MAX_RETRIES = 3;
  
  beforeAll(() => {
    mockWebSocket = MockWebSocket;
    (global as any).WebSocket = mockWebSocket;
    jest.useFakeTimers();
  });

  beforeEach(() => {
    // Reset WebSocket mock for each test
    (global as any).WebSocket = mockWebSocket;
    webSocketService = new WebSocketService(TEST_URL, TEST_RECONNECT_INTERVAL, TEST_MAX_RETRIES);
  });

  afterEach(() => {
    webSocketService.disconnect();
    jest.clearAllMocks();
  });

  afterAll(() => {
    (global as any).WebSocket = undefined;
    jest.useRealTimers();
  });

  describe('connection management', () => {
    it('should connect to WebSocket server', () => {
      webSocketService.connect();
      expect(webSocketService.getStatus()).toBe('CONNECTING');
      
      jest.runAllTimers();
      expect(webSocketService.getStatus()).toBe('CONNECTED');
    });

    it('should handle disconnection', () => {
      webSocketService.connect();
      jest.runAllTimers();
      webSocketService.disconnect();
      expect(webSocketService.getStatus()).toBe('DISCONNECTED');
    });

    it('should return correct connection status', () => {
      expect(webSocketService.getStatus()).toBe('DISCONNECTED');
      webSocketService.connect();
      expect(['CONNECTING', 'CONNECTED']).toContain(webSocketService.getStatus());
    });
  });

  describe('message handling', () => {
    it('should handle message subscription and unsubscription', () => {
      const handler = (data: PingDTO) => {};
      webSocketService.connect();
      jest.runAllTimers();
      
      webSocketService.onMessage(handler);
      webSocketService.offMessage(handler);
    });

    it('should process incoming messages', () => {
      const mockData = {
        id: '123',
        aircraft: {
          icao24: 'abc123',
          callsign: 'TEST123',
          origin_country: 'US',
          last_contact: Math.floor(Date.now() / 1000),
          squawk: '1234',
          spi: false,
          sensors: []
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
          time: Math.floor(Date.now() / 1000)
        },
        last_update: Math.floor(Date.now() / 1000)
      };

      const handler = jest.fn();
      webSocketService.connect();
      webSocketService.onMessage(handler);

      jest.runAllTimers();
      
      // Simulate receiving a message
      const ws = (webSocketService as any).ws;
      ws.onmessage?.({ data: JSON.stringify(mockData) });

      expect(handler).toHaveBeenCalledWith(mockData);
    });

    it('should handle invalid message data', () => {
      const handler = jest.fn();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      webSocketService.connect();
      webSocketService.onMessage(handler);

      jest.runAllTimers();
      
      // Simulate receiving invalid JSON
      const ws = (webSocketService as any).ws;
      ws.onmessage?.({ data: 'invalid json' });

      expect(handler).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('error handling', () => {
    it('should handle connection errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Force a connection error
      (global as any).WebSocket = class {
        constructor() {
          throw new Error('Connection failed');
        }
      };

      webSocketService.connect();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      (global as any).WebSocket = mockWebSocket;
    });

    it('should attempt reconnection on close', () => {
      const connectSpy = jest.spyOn(WebSocketService.prototype, 'connect');
      
      webSocketService.connect();
      jest.runAllTimers(); // Wait for initial connection

      const ws = (webSocketService as any).ws;
      ws.onclose?.({ code: 1006, reason: 'Abnormal closure' });

      // Wait for reconnection attempt
      jest.runAllTimers();
      expect(connectSpy).toHaveBeenCalledTimes(2); // Initial + 1 retry

      connectSpy.mockRestore();
    });
  });
}); 