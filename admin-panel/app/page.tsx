import AdminSidebar from "@/components/AdminSideBar.";
import AdminDashboardPage from "@/components/dashboard/AdminDashboard";
import DashboardStats from "@/components/dashboard/DashboardStats";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <AdminSidebar />
      <AdminDashboardPage />

    </div>
  );
}
