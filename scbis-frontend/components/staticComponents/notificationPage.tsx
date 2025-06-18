"use client";

import { useEffect, useState } from "react";
import { CheckCheck } from "lucide-react";
import { useNotificationStore } from "@/store/notificationStore/notifications";
import { useUserStore } from "@/store/authStore/useUserStore";
import { fetchUserData } from "@/utils/userUtils";

const API_BASE_URL = "https://scbis-git-dev-hailes-projects-a12464a1.vercel.app";

export default function NotificationsPage() {
  const {
    notifications,
    filter,
    markAsRead,
    markAllAsRead,
    setFilter,
    setNotifications,
  } = useNotificationStore();

  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter((n) => n.category === filter);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        await fetchUserData(); // This internally sets user
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load the latest user data.");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (!user?._id || !user.accessToken) return;

    fetch(`${API_BASE_URL}/notifications/user/${user._id}`, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
      })
      .catch((err) => console.error("Failed to fetch notifications", err));
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user?.accessToken) return;
    try {
      await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      markAsRead(notificationId);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.accessToken) return;
    try {
      await fetch(`${API_BASE_URL}/notifications/read-all/${user._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      markAllAsRead();
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };

  return (
    <div className="p-8 bg-white text-black max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {loading && <p>Loading notifications...</p>}
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex gap-4">
          <button
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck size={20} />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      <div
        className="flex w-full justify-between"
        style={{
          boxShadow:
            "0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        {["All", "General", "Policy Updates", "Claim Updates"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 w-full text-center border font-medium rounded-md ${
              filter === tab ? "text-blue-500" : "text-gray-500 hover:text-blue-500"
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
              <div
                key={notification._id}
                className="p-4 border-b border-blue-500 flex justify-between items-center"
              >
                <div className="flex flex-col gap-4">
                  {notification.message && (
                    <div className="text-sm text-gray-600">
                      {notification.message}
                    </div>
                  )}
                  <div className="text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleDateString()} |{" "}
                    {new Date(notification.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.isRead && (
                    <CheckCheck
                      size={20}
                      className="cursor-pointer text-green-500 hover:text-green-700"
                      onClick={() => handleMarkAsRead(notification._id)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

