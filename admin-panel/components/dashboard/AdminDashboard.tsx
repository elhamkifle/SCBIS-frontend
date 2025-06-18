"use client";

import React from "react";
import DashboardStats from "./DashboardStats";
import DashboardClaimsChart from "./DashboardClaimsChart";
import RecentActivity from "./RecentActivity";
import PolicyPieChart from "./PolicyPieChart";
import SummaryStats from "./SummaryStats";

export default function AdminDashboard() {
  const handleCardClick = () => {
    // You can implement detailed view logic here
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome to your insurance management dashboard
          </p>
        </div>

        {/* Summary Stats */}
        <SummaryStats onCardClick={handleCardClick} />

        {/* KPI Stats */}
        <div className="mb-6">
          <DashboardStats />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DashboardClaimsChart />
          <RecentActivity />
        </div>

        {/* Policy Distribution Chart */}
        <PolicyPieChart />
      </div>
    </div>
  );
}
