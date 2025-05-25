"use client";

import { useState } from "react";
import { Menu, X, Bell, HelpCircle, Settings, LogOut, User, Expand, CheckCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notificationStore/notifications";;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [filter, setFilter] = useState<"All" | "Unread">("All");
  
  // Use the Zustand store
  const {
    notifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const router = useRouter();

  const filteredNotifications = filter === "Unread" 
    ? notifications.filter(n => n.unread) 
    : notifications;

  const handleNotificationClick = (notificationId: number) => {
    markAsRead(notificationId);
    router.push("/notifications");
  };

  const handleExpandClick = () => {
    router.push("/notifications");
  };

  return (
    <header className="bg-[#1F4878] font-semibold text-white p-8 flex justify-between items-center relative">
      {/* Navigation Links (Desktop) */}
      <nav className="hidden lg:flex lg:space-x-8 lg:items-center w-full justify-center">
        <Link href="/landing-page" className="text-white hover:text-green-400 font-syne">
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
          {notifications.some(n => n.unread) && (
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
          {notifications.some(n => n.unread) && (
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
            <Link href="landing-page" className="text-white hover:text-green-400">
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
              <button className="p-2 bg-gray-700 rounded-full hover:bg-red-500">
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
              <p className="text-xl"> Notifications </p>

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
                >All</span>
                <span
                  className={`cursor-pointer ${filter === "Unread" ? "font-bold" : "text-gray-500"}`}
                  onClick={() => setFilter("Unread")}
                >Unread ({notifications.filter(n => n.unread).length})</span>
              </div>
              <div className="flex gap-2 items-center">
                <CheckCheck size={20} className="text-blue-500 cursor-pointer" onClick={markAllAsRead} />
                <span className="text-black cursor-pointer hover:underline" onClick={markAllAsRead}>Mark All as Read</span>
              </div>
            </div>
            <div className="space-y-2 lg:space-y-6">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="px-4 py-2 rounded flex justify-between items-start hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="w-full flex flex-col justify-between">
                    <div className={`${notification.unread ? "font-bold" : ""} text-black mb-2`}>
                      {notification.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {notification.date} | {notification.time}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {notification.unread && (
                      <CheckCheck
                        size={20}
                        className="cursor-pointer text-green-500 hover:text-green-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      />
                    )}
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