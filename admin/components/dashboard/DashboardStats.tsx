import { Users, ShieldCheck, ClipboardList, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    label: "Total Users",
    value: "1,280",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Active Policies",
    value: "932",
    icon: ShieldCheck,
    color: "bg-green-100 text-green-600",
  },
  {
    label: "Pending Requests",
    value: "14",
    icon: ClipboardList,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    label: "Pending Claims",
    value: "7",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-600",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-2 rounded-md ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
