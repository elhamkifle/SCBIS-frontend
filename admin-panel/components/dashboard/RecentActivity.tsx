"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { dashboardApi, RecentActivity as RecentActivityType } from "@/app/services/api";

export default function RecentActivity() {
  const [activityData, setActivityData] = useState<RecentActivityType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getDashboard();
      setActivityData(response.recentActivity);
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
      toast.error('Failed to load recent activity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityData();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'policy_purchased':
        return '🛡️';
      case 'claim_submitted':
        return '📋';
      case 'payment_confirmed':
        return '💰';
      case 'user_verified':
        return '✅';
      case 'proforma_sent':
        return '📄';
      default:
        return '📌';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow col-span-2 md:col-span-1">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex justify-between border-b pb-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!activityData || activityData.activities.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow col-span-2 md:col-span-1">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h2>
        <div className="text-center text-gray-500 py-8">
          <p>No recent activity found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow col-span-2 md:col-span-1">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h2>
      <ul className="space-y-3 max-h-48 overflow-y-auto">
        {activityData.activities.slice(0, 10).map((item) => (
          <li
            key={item.id}
            className="text-sm text-gray-700 flex justify-between items-center border-b pb-2 last:border-b-0"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{getActivityIcon(item.type)}</span>
              <div>
                <span className="font-medium">{item.message}</span>
                {item.userName && (
                  <span className="text-gray-500 ml-1">by {item.userName}</span>
                )}
              </div>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
              {item.relativeTime}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
