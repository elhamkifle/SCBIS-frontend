import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Enums matching backend
export enum PolicyType {
  ThirdParty = "Compulsory Third-Party Cover",
  OwnDamage = "Own Damage Cover",
  Comprehensive = "Comprehensive Cover",
}

// Mock DTO structure
interface PolicySelectionDto {
  selectedPolicy: PolicyType;
}

// Mock policy data
const mockPolicies: PolicySelectionDto[] = [
  { selectedPolicy: PolicyType.Comprehensive },
  { selectedPolicy: PolicyType.ThirdParty },
  { selectedPolicy: PolicyType.Comprehensive },
  { selectedPolicy: PolicyType.OwnDamage },
  { selectedPolicy: PolicyType.ThirdParty },
  { selectedPolicy: PolicyType.OwnDamage },
  { selectedPolicy: PolicyType.Comprehensive },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function PolicyPieChart() {
  // Count policies by type
  const policyCounts: Record<PolicyType, number> = {
    [PolicyType.ThirdParty]: 0,
    [PolicyType.OwnDamage]: 0,
    [PolicyType.Comprehensive]: 0,
  };

  mockPolicies.forEach((policy) => {
    if (policy.selectedPolicy in policyCounts) {
      policyCounts[policy.selectedPolicy]++;
    }
  });

  const data = Object.entries(policyCounts)
    .filter(([, count]) => count > 0)
    .map(([name, value]) => ({
      name,
      value,
    }));

  return (
    <div className="mt-8 p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Policy Distribution
      </h2>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">No policy data available.</p>
      )}
    </div>
  );
}
