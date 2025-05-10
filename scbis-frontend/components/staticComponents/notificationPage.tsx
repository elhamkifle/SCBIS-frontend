"use client";

import { CheckCheck, Trash2 } from "lucide-react";
import { useNotificationStore } from "@/store/notificationStore/notifications";

export default function NotificationsPage() {
  const {
    notifications,
    filter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    setFilter,
    clearAllNotifications,
    resetToDefault,
  } = useNotificationStore();

  const filteredNotifications =
    filter === "All" ? notifications : notifications.filter((n) => n.type === filter);

  return (
    <div className="p-8 bg-white text-black max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-4">
          <button
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
            onClick={markAllAsRead}
          >
            <CheckCheck size={20} />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      <div className="flex w-full justify-between" style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 4px rgba(0, 0, 0, 0.1)' }}>
        {["All", "General", "Policy Updates", "Claim Updates"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 w-full text-center border font-medium rounded-md ${
              filter === tab
                ? "text-blue-500"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <h2 className="text-lg text-gray-500 font-semibold">Today</h2>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div key={notification.id} className="p-4 border-b border-blue-500 flex justify-between items-center">
                <div className="flex flex-col gap-4">
                  <div className={`${notification.unread ? "font-bold" : ""} text-black`}>{notification.title}</div>
                  {notification.details && (
                    <div className="text-sm text-gray-600">{notification.details}</div>
                  )}
                  <div className="text-xs text-gray-400">{notification.date} | {notification.time}</div>
                </div>
                <div className="flex items-center gap-2">
                  {notification.unread && (
                    <CheckCheck
                      size={20}
                      className="cursor-pointer text-green-500 hover:text-green-700"
                      onClick={() => markAsRead(notification.id)}
                    />
                  )}
                  <Trash2
                    size={20}
                    className="cursor-pointer text-red-500 hover:text-red-700"
                    onClick={() => deleteNotification(notification.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}