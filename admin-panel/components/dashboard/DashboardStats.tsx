import { Users, ShieldCheck, ClipboardList, AlertTriangle, ArrowUp, ArrowDown, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

const stats = [
  {
    label: "Total Users",
    value: "1,280",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
    trend: "up",
    trendValue: "12%",
    progress: 75,
  },
  {
    label: "Active Policies",
    value: "932",
    icon: ShieldCheck,
    color: "bg-green-100 text-green-600",
    trend: "up",
    trendValue: "5%",
    progress: 60,
  },
  {
    label: "Pending Requests",
    value: "14",
    icon: ClipboardList,
    color: "bg-yellow-100 text-yellow-600",
    trend: "down",
    trendValue: "3%",
    progress: 30,
  },
  {
    label: "Pending Claims",
    value: "7",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-600",
    trend: "down",
    trendValue: "10%",
    progress: 20,
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
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
  );
}