"use client";

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { dashboardApi, PolicyDistribution } from "@/app/services/api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function PolicyPieChart() {
  const [policyData, setPolicyData] = useState<PolicyDistribution | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPolicyData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getDashboard();
      setPolicyData(response.policyDistribution);
    } catch (error) {
      console.error('Failed to fetch policy distribution:', error);
      toast.error('Failed to load policy distribution');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicyData();
  }, []);

  if (loading) {
    return (
      <div className="mt-8 p-4 bg-white rounded-xl shadow-md">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!policyData || policyData.distribution.length === 0) {
    return (
      <div className="mt-8 p-4 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Policy Distribution
        </h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>No policy data available.</p>
        </div>
      </div>
    );
  }

  // Format policy names for better display
  const formatPolicyName = (name: string) => {
    switch (name) {
      case 'Compulsory Third-Party Cover':
        return 'Third Party';
      case 'Own Damage Cover':
        return 'Own Damage';
      case 'Comprehensive Cover':
        return 'Comprehensive';
      default:
        return name;
    }
  };

  const chartData = policyData.distribution.map(item => ({
    name: formatPolicyName(item.name),
    value: item.value,
    percentage: item.percentage,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">Policies: {data.value}</p>
          <p className="text-gray-600">Percentage: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-8 p-4 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Policy Distribution
        </h2>
        <div className="text-sm text-gray-500">
          Total: {policyData.totalPolicies.toLocaleString()} policies
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={({ name, percentage }) => `${name}: ${percentage}%`}
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
