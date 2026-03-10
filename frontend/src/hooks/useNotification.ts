import { useEffect, useState } from 'react';
import { getSocket } from './useSocket';
import api from '../services/api';


export interface Notification {
  notification_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount]     = useState(0);
 
  // ── Load existing notifications from REST on mount ──────────────────────
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const res = await api.get('/notifications');
        const data: Notification[] = res.data.data.notifications || [];
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      } catch { /* silent */ }
    };
    fetchInitial();
  }, []);

  // ── Listen for real-time pushes via Socket.IO ───────────────────────────
 // hooks/useNotifications.ts
useEffect(() => {
  const socket = getSocket();

  // All event names your backend actually emits
  const EVENTS = [
    'new_appointment',
    'appointment_accepted',
    'appointment_declined',
    'appointment_cancelled',
    'doctor_suspended',
  ];

  const handleNew = (payload: { notification: Notification }) => {
    setNotifications(prev => [payload.notification, ...prev]);
    setUnreadCount(c => c + 1);
  };

  const handleMarkedRead = ({ notification_id }: { notification_id: string }) => {
    setNotifications(prev =>
      prev.map(n => n.notification_id === notification_id ? { ...n, is_read: true } : n)
    );
    setUnreadCount(c => Math.max(0, c - 1));
  };

  EVENTS.forEach(event => socket.on(event, handleNew));
  socket.on('notification_marked_read', handleMarkedRead);

  return () => {
    EVENTS.forEach(event => socket.off(event, handleNew));
    socket.off('notification_marked_read', handleMarkedRead);
  };
}, []);

  // ── Mark a notification as read ─────────────────────────────────────────
  const markRead = (notification_id: string) => {
    const socket = getSocket();
    socket.emit('mark_notification_read', { notification_id });
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch { /* silent */ }
  };

  return { notifications, unreadCount, markRead, markAllRead };
};