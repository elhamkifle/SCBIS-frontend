// components/dashboard/DashboardClaimsChart.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", Pending: 10, Approved: 5 },
  { name: "Feb", Pending: 14, Approved: 9 },
  { name: "Mar", Pending: 7, Approved: 11 },
  { name: "Apr", Pending: 5, Approved: 14 },
];

export default function DashboardClaimsChart() {
  return (
    <div className="bg-white p-4 rounded-xl shadow col-span-2 md:col-span-1">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Claim Status Overview</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Pending" fill="#facc15" />
          <Bar dataKey="Approved" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
