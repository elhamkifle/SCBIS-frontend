"use client";

import { useState } from "react";
import { CheckCheck, Trash2 } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  date: string;
  time: string;
  type: "General" | "Policy Updates" | "Claim Updates";
  unread: boolean;
  details?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
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
  ]);

  const [filter, setFilter] = useState("All");

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => (n.id === id ? { ...n, unread: false } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications =
    filter === "All" ? notifications : notifications.filter(n => n.type === filter);

  return (
    <div className="p-8 bg-white text-black max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
          onClick={markAllAsRead}
        >
          <CheckCheck size={20} />
          <span>Mark All as Read</span>
        </button>
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