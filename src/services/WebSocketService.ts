
// Socket service for real-time communication between mobile and web browser

class WebSocketService {
  private socket: WebSocket | null = null;
  private sessionId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number = 2000; // Start with 2 seconds
  private listeners: Record<string, Array<(data: any) => void>> = {};
  private connectionStatus: 'connecting' | 'connected' | 'disconnected' = 'disconnected';
  private url = 'wss://echo.websocket.org'; // For demo purposes, replace with your real WebSocket server

  // Initialize connection
  connect(sessionId?: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        // Generate a session ID if not provided
        this.sessionId = sessionId || this.generateSessionId();
        this.connectionStatus = 'connecting';

        // Create WebSocket connection
        this.socket = new WebSocket(`${this.url}/${this.sessionId}`);

        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          this.connectionStatus = 'connected';
          this.reconnectAttempts = 0;
          this.reconnectTimeout = 2000;
          this.notifyListeners('connectionChange', { status: 'connected', sessionId: this.sessionId });
          resolve(true);
        };

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type && this.listeners[data.type]) {
              this.listeners[data.type].forEach(callback => callback(data.payload));
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.socket.onclose = () => {
          this.connectionStatus = 'disconnected';
          this.notifyListeners('connectionChange', { status: 'disconnected' });
          this.attemptReconnect();
          resolve(false);
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.connectionStatus = 'disconnected';
          this.notifyListeners('connectionChange', { status: 'error', error });
          resolve(false);
        };
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
        this.connectionStatus = 'disconnected';
        resolve(false);
      }
    });
  }

  // For demo purposes, we'll simulate actual WebSocket functionality
  private simulateWebSocketConnection(sessionId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.sessionId = sessionId;
        this.connectionStatus = 'connected';
        this.notifyListeners('connectionChange', { status: 'connected', sessionId });
        resolve(true);
      }, 1000);
    });
  }

  // Send message to WebSocket server
  sendMessage(type: string, payload: any): boolean {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Cannot send message, WebSocket is not connected');
      return false;
    }

    try {
      const message = JSON.stringify({ type, payload, sessionId: this.sessionId });
      this.socket.send(message);
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }

  // For demo, simulate sending a message
  simulateSendMessage(type: string, payload: any): void {
    console.log(`Simulating sending message: ${type}`, payload);
    // Simulate receiving the message back for testing purposes
    setTimeout(() => {
      if (type === 'documentScanned') {
        this.notifyListeners('documentReceived', payload);
      }
    }, 1500);
  }

  // Add event listener
  on(type: string, callback: (data: any) => void): void {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  // Remove event listener
  off(type: string, callback: (data: any) => void): void {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter(cb => cb !== callback);
    }
  }

  // Notify all listeners of an event
  private notifyListeners(type: string, data: any): void {
    if (this.listeners[type]) {
      this.listeners[type].forEach(callback => callback(data));
    }
  }

  // Attempt to reconnect with exponential backoff
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      this.connect(this.sessionId || undefined);
    }, this.reconnectTimeout);

    // Exponential backoff
    this.reconnectTimeout = Math.min(this.reconnectTimeout * 1.5, 30000);
  }

  // Disconnect WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.sessionId = null;
    this.connectionStatus = 'disconnected';
  }

  // Get current connection status
  getStatus(): 'connecting' | 'connected' | 'disconnected' {
    return this.connectionStatus;
  }

  // Get current session ID
  getSessionId(): string | null {
    return this.sessionId;
  }

  // Generate a random session ID
  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
