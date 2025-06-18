"use client";

import { useState, useEffect } from "react";
import { Users, ShieldCheck, ClipboardList, AlertTriangle, ArrowUp, ArrowDown, MoreHorizontal, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { dashboardApi, DashboardStats as DashboardStatsType } from "@/app/services/api";

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getDashboard();
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await dashboardApi.refreshDashboard();
      await fetchStats();
      toast.success('Dashboard refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
      toast.error('Failed to refresh dashboard');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-2 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-red-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Failed to load statistics</p>
            <Button onClick={fetchStats} className="mt-2" size="sm">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsConfig = [
    {
      label: "Total Users",
      value: stats.totalUsers.value.toLocaleString(),
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      trend: stats.totalUsers.trend,
      trendValue: stats.totalUsers.trendValue,
      progress: stats.totalUsers.progress,
    },
    {
      label: "Active Policies",
      value: stats.activePolicies.value.toLocaleString(),
      icon: ShieldCheck,
      color: "bg-green-100 text-green-600",
      trend: stats.activePolicies.trend,
      trendValue: stats.activePolicies.trendValue,
      progress: stats.activePolicies.progress,
    },
    {
      label: "Pending Requests",
      value: stats.pendingRequests.value.toLocaleString(),
      icon: ClipboardList,
      color: "bg-yellow-100 text-yellow-600",
      trend: stats.pendingRequests.trend,
      trendValue: stats.pendingRequests.trendValue,
      progress: stats.pendingRequests.progress,
    },
    {
      label: "Pending Claims",
      value: stats.pendingClaims.value.toLocaleString(),
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600",
      trend: stats.pendingClaims.trend,
      trendValue: stats.pendingClaims.trendValue,
      progress: stats.pendingClaims.progress,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Key Performance Indicators</h2>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat) => (
          <Card key={stat.label} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{stat.label}</CardTitle>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className={`flex items-center text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {stat.trend === "up" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      <span className="ml-1">{stat.trendValue} from last month</span>
                    </div>
                  </div>
                </div>
              </div>
              <Progress value={stat.progress} className="mt-4 h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}