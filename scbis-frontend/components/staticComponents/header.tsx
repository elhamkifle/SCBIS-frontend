"use client";

import { useState } from "react";
import { Menu, X, Bell, HelpCircle, Settings, LogOut, User } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#1F4878] font-semibold text-white p-8 flex justify-between items-center relative">
      {/* Navigation Links (Desktop) */}
      <nav className="hidden lg:flex lg:space-x-8 lg:items-center w-full justify-center">
        <Link href="#" className="text-white hover:text-green-400">
          Home
        </Link>
        <Link href="#" className="text-white hover:text-green-400">
          Policy Purchase
        </Link>
        <Link href="#" className="text-white hover:text-green-400">
          Claim Submission
        </Link>
        <Link href="#" className="text-white hover:text-green-400">
          Claim Status
        </Link>
        <Link href="#" className="text-white hover:text-green-400">
          About Us
        </Link>
      </nav>

      {/* Bell Icon (Right side on large screens) */}
      <div className="hidden lg:block absolute right-4">
        <Bell size={24} className="cursor-pointer" />
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
        <Bell size={24} className="cursor-pointer" />
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
            <Link href="#" className="text-white hover:text-green-400">
              Home
            </Link>
            <Link href="#" className="text-white hover:text-green-400">
              Policy Purchase
            </Link>
            <Link href="#" className="text-white hover:text-green-400">
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
    </header>
  );
}
