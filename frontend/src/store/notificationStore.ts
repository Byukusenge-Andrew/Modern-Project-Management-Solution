import { create } from 'zustand';
import { Notification } from '../types';
import { generateId } from '../utils/id';

interface NotificationState {
  notifications: Notification[];
  addNotification: (userId: string, title: string, message: string, type: Notification['type']) => void;
  markAsRead: (notificationId: string) => void;
  clearAll: (userId: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (userId, title, message, type) => {
    const notification: Notification = {
      id: generateId(),
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
  },
  markAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    })),
  clearAll: (userId) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.userId !== userId),
    })),
}));