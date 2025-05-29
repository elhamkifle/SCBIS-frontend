"use client";
import { useState } from "react";
import AdminSidebar from "@/components/AdminSideBar.";
import AdminDashboardPage from "@/components/dashboard/AdminDashboard";



export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="text-2xl font-bold p-3 flex justify-between items-center md:justify-start">
        <button
          className="md:hidden text-blue-600"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          Admin Panel
        </button>
        <span className="hidden md:block">Admin Panel</span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row h-screen">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform transition-transform duration-300 md:relative md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSidebar />
        </div>

        {/* Overlay for smaller screens */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Dashboard + Summary + Pie Chart */}
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            <AdminDashboardPage />
          </div>
        </div>
      </div>
    </div>
  );
}

