"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type NotificationType = "General" | "Policy Updates" | "Claim Updates";

export interface Notification {
  id: number;
  title: string;
  date: string;
  time: string;
  type: NotificationType;
  unread: boolean;
  details?: string;
}

interface NotificationState {
  notifications: Notification[];
  filter: string;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: number) => void;
  setFilter: (filter: string) => void;
  clearAllNotifications: () => void;
  resetToDefault: () => void;
}

const defaultNotifications: Notification[] = [
  {
    id: 1,
    title: "Scheduled system maintenance",
    date: "March 8, 2025",
    time: "9:00PM",
    type: "General",
    unread: true,
  },
  {
    id: 2,
    title: "Your policy is about to Expire, Action Required.",
    date: "March 8, 2025",
    time: "9:00PM",
    type: "Policy Updates",
    unread: true,
    details: "Policy #1234 (Comprehensive Cover) for your [Vehicle Model] is set to expire in 5 days. Renew now to avoid any coverage gaps.",
  },
  {
    id: 3,
    title: "Your policy request has been rejected.",
    date: "March 8, 2025",
    time: "9:00PM",
    type: "Policy Updates",
    unread: true,
    details: "Reason: Incorrect vehicle details. Please resubmit.",
  },
  {
    id: 4,
    title: "Your claim is under review",
    date: "March 8, 2025",
    time: "9:00PM",
    type: "Claim Updates",
    unread: true,
  },
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: defaultNotifications,
      filter: "All",
      markAsRead: (id: number) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, unread: false } : n
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, unread: false })),
        })),
      deleteNotification: (id: number) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      setFilter: (filter: string) => set({ filter }),
      clearAllNotifications: () => set({ notifications: [] }),
      resetToDefault: () => set({ notifications: defaultNotifications, filter: "All" }),
    }),
    {
      name: "notification-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);