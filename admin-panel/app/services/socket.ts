import { io, Socket } from 'socket.io-client';

// Socket.IO events interfaces based on backend
export interface PurchaseRequestBasic {
  id: string;
  user: {
    id: string;
    name: string;
  };
  policyType: string;
  submittedOn: Date;
  status: string;
}

export interface PurchaseRequestWebSocketEvents {
  // Client to Server events
  'join-admin-room': { adminId: string; role: string };
  
  // Server to Client events
  'joined-admin-room': { 
    message: string; 
    adminId: string; 
    role: string; 
  };
  
  'new-purchase-request': {
    type: 'NEW_REQUEST';
    data: PurchaseRequestBasic;
    timestamp: Date;
    message: string;
  };
  
  'purchase-request-status-changed': {
    type: 'STATUS_CHANGE';
    data: PurchaseRequestBasic & {
      oldStatus: string;
      newStatus: string;
      updatedBy?: string;
    };
    timestamp: Date;
    message: string;
  };
  
  'purchase-request-approved': {
    type: 'APPROVED';
    data: PurchaseRequestBasic & {
      approvedBy: string;
      notes?: string;
    };
    timestamp: Date;
    message: string;
  };
  
  'purchase-request-rejected': {
    type: 'REJECTED';
    data: PurchaseRequestBasic & {
      rejectedBy: string;
      reason: string;
    };
    timestamp: Date;
    message: string;
  };
  
  'purchase-requests-stats-updated': {
    type: 'STATS_UPDATE';
    data: {
      pending: number;
      approved: number;
      rejected: number;
      total: number;
    };
    timestamp: Date;
  };

  'purchase-request-reupload-requested': {
    type: 'REUPLOAD_REQUESTED';
    data: PurchaseRequestBasic & {
      requestedBy: string;
      files: string;
      reason?: string;
    };
    timestamp: Date;
    message: string;
  };
}

// Type for callback functions
type EventCallback = (...args: any[]) => void;

class PurchaseRequestsSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private listeners = new Map<string, EventCallback[]>();

  // Initialize Socket.IO connection
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Get auth token
        const token = localStorage.getItem('accessToken');
        if (!token) {
          reject(new Error('No authentication token found'));
          return;
        }

        // Connect to the purchase requests namespace
        this.socket = io('https://scbis-git-dev-hailes-projects-a12464a1.vercel.app', {
          auth: {
            token: `Bearer ${token}`
          },
          transports: ['polling', 'websocket'],
          timeout: 10000,
          forceNew: true,
        });

        this.socket.on('connect', () => {
          // console.log('Connected to purchase requests WebSocket');
          this.isConnected = true;
          
          // Join admin room with user data
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          this.joinAdminRoom(userData._id || 'unknown', 'admin');
          
          resolve();
        });

        this.socket.on('disconnect', () => {
          // console.log('Disconnected from purchase requests WebSocket');
          this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          this.isConnected = false;
          reject(error);
        });

        // Handle successful room join
        this.socket.on('joined-admin-room', () => {
          // console.log('Successfully joined admin room:', data);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  // Join admin room
  private joinAdminRoom(adminId: string, role: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-admin-room', { adminId, role });
    }
  }

  // Subscribe to events
  on<K extends keyof PurchaseRequestWebSocketEvents>(
    event: K,
    callback: (data: PurchaseRequestWebSocketEvents[K]) => void
  ) {
    if (!this.listeners.has(event as string)) {
      this.listeners.set(event as string, []);
    }
    
    this.listeners.get(event as string)!.push(callback);

    if (this.socket) {
      this.socket.on(event as string, callback as any);
    }

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event as string);
      if (eventListeners) {
        const index = eventListeners.indexOf(callback);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
      
      if (this.socket) {
        this.socket.off(event as string, callback as any);
      }
    };
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  // Check connection status
  getConnectionStatus() {
    return this.isConnected;
  }

  // Get socket instance (for direct access if needed)
  getSocket() {
    return this.socket;
  }
}

// Create singleton instance
export const purchaseRequestsSocket = new PurchaseRequestsSocketService();

// Helper hook for easier React integration
export const usePurchaseRequestsSocket = () => {
  return {
    connect: () => purchaseRequestsSocket.connect(),
    disconnect: () => purchaseRequestsSocket.disconnect(),
    on: purchaseRequestsSocket.on.bind(purchaseRequestsSocket),
    isConnected: purchaseRequestsSocket.getConnectionStatus(),
  };
}; 