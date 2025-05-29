import React from "react";
import { Card } from "@/components/ui/card";

type SummaryStatsProps = {
  totalPolicies: number;
  totalRevenue: number;
  onCardClick: (type: "policies" | "revenue") => void;
};

export default function SummaryStats({
  totalPolicies,
  totalRevenue,
  onCardClick,
}: SummaryStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 ">
      <Card
        onClick={() => onCardClick("policies")}
        className="cursor-pointer p-4 shadow-md hover:shadow-lg transition"
      >
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Total Purchased Policies
        </h2>
        <p className="text-2xl font-bold text-blue-600">{totalPolicies}</p>
      </Card>

      <Card
        onClick={() => onCardClick("revenue")}
        className="cursor-pointer p-4 shadow-md hover:shadow-lg transition"
      >
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Total Earned Revenue
        </h2>
        <p className="text-2xl font-bold text-green-600">${totalRevenue}</p>
      </Card>
    </div>
  );
}
