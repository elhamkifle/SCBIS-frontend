// components/dashboard/DashboardClaimsChart.tsx
"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { dashboardApi, ClaimsChartData } from "@/app/services/api";

export default function DashboardClaimsChart() {
  const [chartData, setChartData] = useState<ClaimsChartData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getDashboard();
      setChartData(response.claimsChart);
    } catch (error) {
      console.error('Failed to fetch claims chart data:', error);
      toast.error('Failed to load claims chart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow col-span-2 md:col-span-1">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!chartData || chartData.monthlyData.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow col-span-2 md:col-span-1">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Claim Status Overview</h2>
        <div className="h-48 flex items-center justify-center text-gray-500">
          <p>No claims data available</p>
        </div>
      </div>
    );
  }

  // Transform data for the chart - use last 6 months for better visibility
  const displayData = chartData.monthlyData.slice(-6).map(item => ({
    name: item.name,
    Pending: item.pending,
    Approved: item.approved,
    Rejected: item.rejected,
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow col-span-2 md:col-span-1">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Claim Status Overview</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={displayData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [value, name]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Bar dataKey="Pending" fill="#facc15" name="Pending" />
          <Bar dataKey="Approved" fill="#4ade80" name="Approved" />
          <Bar dataKey="Rejected" fill="#ef4444" name="Rejected" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
