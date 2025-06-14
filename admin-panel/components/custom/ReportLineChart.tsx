'use client';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportLineChartProps {
  reportType: 'Policies' | 'Claims' | 'Users';
}

const dummyData = {
  Policies: [
    { date: '2024-01', count: 12 },
    { date: '2024-02', count: 19 },
    { date: '2024-03', count: 7 },
    { date: '2024-04', count: 23 },
    { date: '2024-05', count: 15 },
  ],
  Claims: [
    { date: '2024-01', count: 5 },
    { date: '2024-02', count: 9 },
    { date: '2024-03', count: 4 },
    { date: '2024-04', count: 14 },
    { date: '2024-05', count: 11 },
  ],
  Users: [
    { date: '2024-01', count: 30 },
    { date: '2024-02', count: 42 },
    { date: '2024-03', count: 25 },
    { date: '2024-04', count: 50 },
    { date: '2024-05', count: 38 },
  ],
};

export default function ReportLineChart({ reportType }: ReportLineChartProps) {
  const data = dummyData[reportType];

  return (
    <div className="w-full h-72 bg-white rounded-2xl shadow p-4">
      <h3 className="text-lg font-semibold mb-4">{reportType} Over Time</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
