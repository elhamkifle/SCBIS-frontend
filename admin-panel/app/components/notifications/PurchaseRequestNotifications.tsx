"use client";

import { useEffect, useState } from 'react';
import { Bell, X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { usePurchaseRequestsSocket } from '../../services/socket';

interface Notification {
  id: string;
  type: 'NEW_REQUEST' | 'STATUS_CHANGE' | 'APPROVED' | 'REJECTED' | 'STATS_UPDATE' | 'REUPLOAD_REQUESTED';
  title: string;
  message: string;
  timestamp: Date;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
}

export default function PurchaseRequestNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socket = usePurchaseRequestsSocket();

  useEffect(() => {
    let mounted = true;

    const connectSocket = async () => {
      try {
        await socket.connect();
        if (mounted) {
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        if (mounted) {
          setIsConnected(false);
        }
      }
    };

    connectSocket();

    // Subscribe to events
    const unsubscribeFunctions: (() => void)[] = [];

    // New purchase request
    const unsubscribeNew = socket.on('new-purchase-request', (data) => {
      if (!mounted) return;
      
      const notification: Notification = {
        id: `new-${data.data.id}-${Date.now()}`,
        type: 'NEW_REQUEST',
        title: 'New Purchase Request',
        message: `New request ${data.data.id} from ${data.data.user.name}`,
        timestamp: new Date(data.timestamp),
        icon: <AlertCircle className="w-5 h-5" />,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep only 10 latest
    });
    unsubscribeFunctions.push(unsubscribeNew);

    // Purchase request approved
    const unsubscribeApproved = socket.on('purchase-request-approved', (data) => {
      if (!mounted) return;
      
      const notification: Notification = {
        id: `approved-${data.data.id}-${Date.now()}`,
        type: 'APPROVED',
        title: 'Request Approved',
        message: `Request ${data.data.id} has been approved`,
        timestamp: new Date(data.timestamp),
        icon: <CheckCircle className="w-5 h-5" />,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 9)]);
    });
    unsubscribeFunctions.push(unsubscribeApproved);

    // Purchase request rejected
    const unsubscribeRejected = socket.on('purchase-request-rejected', (data) => {
      if (!mounted) return;
      
      const notification: Notification = {
        id: `rejected-${data.data.id}-${Date.now()}`,
        type: 'REJECTED',
        title: 'Request Rejected',
        message: `Request ${data.data.id} has been rejected`,
        timestamp: new Date(data.timestamp),
        icon: <XCircle className="w-5 h-5" />,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 9)]);
    });
    unsubscribeFunctions.push(unsubscribeRejected);

    // Status change
    const unsubscribeStatusChange = socket.on('purchase-request-status-changed', (data) => {
      if (!mounted) return;
      
      const notification: Notification = {
        id: `status-${data.data.id}-${Date.now()}`,
        type: 'STATUS_CHANGE',
        title: 'Status Changed',
        message: `Request ${data.data.id} status: ${data.data.oldStatus} → ${data.data.newStatus}`,
        timestamp: new Date(data.timestamp),
        icon: <AlertCircle className="w-5 h-5" />,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
      
      setNotifications(prev => [notification, ...prev.slice(0, 9)]);
    });
    unsubscribeFunctions.push(unsubscribeStatusChange);

    // File reupload requested
    const unsubscribeReuploadRequested = socket.on('purchase-request-reupload-requested', (data) => {
      console.log('🔔 [Notifications] Reupload request event received:', data);
      
      if (!mounted) {
        console.log('⚠️ [Notifications] Component not mounted, ignoring event');
        return;
      }
      
      const notification: Notification = {
        id: `reupload-${data.data.id}-${Date.now()}`,
        type: 'REUPLOAD_REQUESTED',
        title: 'File Reupload Requested',
        message: `Files requested for reupload on request ${data.data.id}: ${data.data.files}`,
        timestamp: new Date(data.timestamp),
        icon: <AlertCircle className="w-5 h-5" />,
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
      
      console.log('📋 [Notifications] Adding notification:', notification);
      setNotifications(prev => [notification, ...prev.slice(0, 9)]);
    });
    unsubscribeFunctions.push(unsubscribeReuploadRequested);

    return () => {
      mounted = false;
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
      socket.disconnect();
      setIsConnected(false);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  if (notifications.length === 0) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center space-x-2 bg-white border rounded-lg px-3 py-2 shadow-sm">
          <Bell className={`w-4 h-4 ${isConnected ? 'text-green-500' : 'text-gray-400'}`} />
          <span className="text-xs text-gray-500">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {/* Connection Status */}
      <div className="flex items-center justify-between bg-white border rounded-lg px-3 py-2 shadow-sm">
        <div className="flex items-center space-x-2">
          <Bell className={`w-4 h-4 ${isConnected ? 'text-green-500' : 'text-gray-400'}`} />
          <span className="text-xs text-gray-500">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </span>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Notifications */}
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${notification.bgColor} border ${notification.borderColor} rounded-lg p-4 shadow-lg animate-slide-in`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`${
                notification.type === 'APPROVED' ? 'text-green-600' :
                notification.type === 'REJECTED' ? 'text-red-600' :
                notification.type === 'NEW_REQUEST' ? 'text-blue-600' :
                notification.type === 'REUPLOAD_REQUESTED' ? 'text-orange-600' :
                'text-yellow-600'
              }`}>
                {notification.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-700 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600 ml-2"
              aria-label="Close notification"
              title="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 