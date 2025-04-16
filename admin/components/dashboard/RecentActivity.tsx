// components/dashboard/RecentActivity.tsx
export default function RecentActivity() {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>✅ Policy purchased by Alice</li>
          <li>🕒 Claim submitted by Bob</li>
          <li>✅ Payment confirmed for Charles</li>
        </ul>
      </div>
    );
  }
  