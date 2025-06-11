// app/dashboard/page.tsx or wherever your dashboard is rendered

import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardClaimsChart from "@/components/dashboard/DashboardClaimsChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import PolicyPieChart from "./PolicyPieChart";
import SummaryStats from "./SummaryStats";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

      {/* KPI Cards */}
      <DashboardStats />

      {/* 2nd Row: Chart + Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardClaimsChart />
        <RecentActivity />
      </div>
      <SummaryStats
              totalPolicies={10234}
              totalRevenue={189230}
              onCardClick={() => {}}
            />

            {/* Policy Distribution Chart */}
    <PolicyPieChart />
    </div>
  );
}
