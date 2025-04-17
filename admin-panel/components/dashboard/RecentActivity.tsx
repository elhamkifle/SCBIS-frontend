// components/dashboard/RecentActivity.tsx
export default function RecentActivity() {
  const data = [
    { message: "Policy purchased by Alice", time: "2 mins ago" },
    { message: "Claim submitted by Bob", time: "10 mins ago" },
    { message: "Payment confirmed from John", time: "30 mins ago" },
    { message: "Performa sent to Claims Dept", time: "1 hr ago" },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow col-span-2 md:col-span-1">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h2>
      <ul className="space-y-3">
        {data.map((item, idx) => (
          <li
            key={idx}
            className="text-sm text-gray-700 flex justify-between border-b pb-2 last:border-b-0"
          >
            <span>{item.message}</span>
            <span className="text-xs text-gray-400">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
