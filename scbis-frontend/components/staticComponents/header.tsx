"use client";

import { useState, useEffect } from "react";
import { Menu, X, Bell, HelpCircle, Settings, LogOut, User, Expand, CheckCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notificationStore/notifications";;
import { useUserStore } from "@/store/authStore/useUserStore";
import { fetchUserData } from '@/utils/userUtils';

const API_BASE_URL = "https://scbis-git-dev-hailes-projects-a12464a1.vercel.app";


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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
    filter === "All" ? notifications : notifications.filter((n) => n.category === filter);

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

    // Initial fetch of notifications
    fetch(`${API_BASE_URL}/notifications/user/${user._id}`, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Failed to fetch notifications", err));

    // Socket.io logic commented out until backend supports it
    /*
    const socket = io(SOCKET_URL, {
      auth: {
        token: user.accessToken,
      },
    });

    socket.emit("joinNotifications", user._id);

    socket.on("newNotification", (notification) => {
      addNotification(notification);
    });

    return () => {
      socket.disconnect();
    };
    */
  }, [user]);

  const router = useRouter();
  const logout = useUserStore((state) => state.logout);


  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
    router.push("/notifications");
    setNotificationsOpen(false);
  };

  const handleExpandClick = () => {
    router.push("/notifications");
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      logout();
      router.push('/login');
    }
  };


  return (
    <header className="bg-[#1F4878] font-semibold text-white p-8 flex justify-between items-center relative">
      {/* Navigation Links (Desktop) */}
      <nav className="hidden lg:flex lg:space-x-8 lg:items-center w-full justify-center">
        <Link href="/" className="text-white hover:text-green-400 font-syne">
          Home
        </Link>
        <Link href="/policy-purchase/personal-information/personalDetails" className="text-white hover:text-green-400 font-syne">
          Policy Purchase
        </Link>
        <Link href="/claim-submission/vehicle-selection" className="text-white hover:text-green-400 font-syne">
          Claim Submission
        </Link>
        <Link href="#" className="text-white hover:text-green-400 font-syne">
          Claim Status
        </Link>
        <Link href="#" className="text-white hover:text-green-400 font-syne">
          About Us
        </Link>
      </nav>


      {/* Bell Icon (Right side on large screens) */}
      <div className="hidden lg:block absolute right-4">
        <div className="relative">
          <Bell
            size={24}
            className="cursor-pointer"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </div>
      </div>

      {/* Hamburger / Close Button */}
      <button
        className="lg:hidden absolute top-4 right-4"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* User and Bell icons (Mobile) */}
      <div className="lg:hidden absolute top-4 right-16">
        <div className="relative">
          <Bell
            size={24}
            className="cursor-pointer"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </div>
      </div>
      <div className="lg:hidden absolute top-4 right-28">
        <User size={24} className="cursor-pointer" />
      </div>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full bg-[#1F4878] font-semibold flex flex-col items-center space-y-4 p-8 lg:hidden absolute top-16 left-0 right-0 shadow-md"
          >
            <Link href="/" className="text-white hover:text-green-400">
              Home
            </Link>
            <Link href="/policy-purchase/personal-information/personalDetails" className="text-white hover:text-green-400">
              Policy Purchase
            </Link>
            <Link href="/claim-submission/vehicle-selection" className="text-white hover:text-green-400">
              Claim Submission
            </Link>
            <Link href="#" className="text-white hover:text-green-400">
              Claim Status
            </Link>
            <Link href="#" className="text-white hover:text-green-400">
              About Us
            </Link>

            {/* Icons for Help, Settings, Logout */}
            <div className="flex justify-center gap-4 mt-4">
              <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600">
                <HelpCircle size={24} />
              </button>
              <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600">
                <Settings size={24} />
              </button>
              <button
                className="p-2 bg-gray-700 rounded-full hover:bg-red-500"
                onClick={handleLogout}
              >
                <LogOut size={24} />
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Notifications Popup */}
      <AnimatePresence>
        {notificationsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 right-4 bg-white text-black rounded-lg shadow-lg w-80 lg:w-1/2 p-4 z-50"
          >
            <div className="flex justify-between items-center mb-6 pt-2">
              <p className="text-xl font-semibold">Notifications</p>

              <div className="flex gap-2 items-center">
                <Expand
                  size={20}
                  className="cursor-pointer text-gray-600 hover:text-black"
                  onClick={handleExpandClick}
                />
                <X
                  size={20}
                  className="cursor-pointer text-gray-600 hover:text-black"
                  onClick={() => setNotificationsOpen(false)}
                />
              </div>
            </div>
            <div className="flex justify-between items-center border-b bg-[#B3B3B3] bg-opacity-50 p-4 mb-4">
              <div className="flex gap-4">
                <span
                  className={`cursor-pointer ${filter === "All" ? "font-bold" : "text-gray-500"}`}
                  onClick={() => setFilter("All")}
                >
                  All ({notifications.length})
                </span>
                <span
                  className={`cursor-pointer ${filter === "Unread" ? "font-bold" : "text-gray-500"}`}
                  onClick={() => setFilter("Unread")}
                >
                  Unread ({unreadCount})
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <CheckCheck
                  size={20}
                  className="text-blue-500 cursor-pointer"
                  onClick={markAllAsRead}
                />
                <span
                  className="text-black cursor-pointer hover:underline"
                  onClick={markAllAsRead}
                >
                  Mark All as Read
                </span>
              </div>
            </div>
            <div className="space-y-2 lg:space-y-6 max-h-[300px] overflow-y-auto">
              {filteredNotifications.length === 0 && (
                <p className="text-center text-gray-500">No notifications found.</p>
              )}
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className="px-4 py-2 rounded flex justify-between items-start hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleNotificationClick(notification._id)}
                >
                  <div className="w-full flex flex-col justify-between">
                    <div className={`${!notification.isRead ? "font-bold" : ""} text-black mb-2`}>
                      {/* {notification.title} */}
                    </div>

                     <div className="flex flex-col gap-4">
                  {notification.message && (
                    <div className="text-sm text-gray-600">
                      {notification.message}
                    </div>
                  )}
                </div>
                    <div className="text-xs text-gray-400">
                      {new Date(notification.createdAt).toLocaleDateString()} |{" "}
                      {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}