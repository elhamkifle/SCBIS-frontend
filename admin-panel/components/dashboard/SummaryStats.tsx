"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { dashboardApi, RevenueSummary, PolicyDistribution } from "@/app/services/api";

type SummaryStatsProps = {
  onCardClick: (type: "policies" | "revenue") => void;
};

export default function SummaryStats({ onCardClick }: SummaryStatsProps) {
  const [revenueSummary, setRevenueSummary] = useState<RevenueSummary | null>(null);
  const [policyData, setPolicyData] = useState<PolicyDistribution | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getDashboard();
      setRevenueSummary(response.revenueSummary);
      setPolicyData(response.policyDistribution);
    } catch (error) {
      console.error('Failed to fetch summary stats:', error);
      toast.error('Failed to load summary statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card className="p-4 shadow-md">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-8 w-24" />
        </Card>
        <Card className="p-4 shadow-md">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-8 w-32" />
        </Card>
      </div>
    );
  }

  if (!revenueSummary || !policyData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card className="p-4 shadow-md border-red-200">
          <p className="text-red-600">Failed to load data</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <Card
        onClick={() => onCardClick("policies")}
        className="cursor-pointer p-4 shadow-md hover:shadow-lg transition"
      >
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Total Active Policies
        </h2>
        <p className="text-2xl font-bold text-blue-600">
          {policyData.totalPolicies.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Across all policy types
        </p>
      </Card>

      <Card
        onClick={() => onCardClick("revenue")}
        className="cursor-pointer p-4 shadow-md hover:shadow-lg transition"
      >
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Total Earned Revenue
        </h2>
        <p className="text-2xl font-bold text-green-600">
          ETB {revenueSummary.totalRevenue.toLocaleString()}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-gray-500">
            This month: ETB {revenueSummary.monthlyRevenue.toLocaleString()}
          </p>
          <span className={`text-xs px-2 py-1 rounded ${
            revenueSummary.revenueGrowth.trend === 'up' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {revenueSummary.revenueGrowth.trend === 'up' ? '↗' : '↘'} {revenueSummary.revenueGrowth.percentage}
          </span>
        </div>
      </Card>
    </div>
  );
}
