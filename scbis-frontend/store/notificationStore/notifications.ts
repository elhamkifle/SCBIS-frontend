import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Notification {
  _id: string;
  userId: string;
  category: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  filter: string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  setFilter: (filter: string) => void;
  clearAllNotifications: () => void;
  resetToDefault: () => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      filter: "All",
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n._id === id ? { ...n, isRead: true } : n
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),
      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n._id !== id),
        })),
      setFilter: (filter) => set({ filter }),
      clearAllNotifications: () => set({ notifications: [] }),
      resetToDefault: () => set({ notifications: [], filter: "All" }),
      setNotifications: (notifications) => set({ notifications }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
