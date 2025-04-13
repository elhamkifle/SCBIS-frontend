import Link from "next/link";
import { LayoutDashboard, Users, FileText, FilePlus, ShieldCheck, Settings, Layers, BarChart2 } from "lucide-react";

const AdminSidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white shadow-md p-4 flex flex-col">
      <div className="text-2xl font-bold mb-6">Insurance Admin</div>
      <nav className="space-y-4 text-sm font-medium">
        <Link href="/admin/dashboard" className="flex items-center gap-2 hover:text-blue-600">
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link href="/admin/users" className="flex items-center gap-2 hover:text-blue-600">
          <Users size={18} /> Users
        </Link>
        <div className="space-y-1">
          <div className="text-gray-500 text-xs pl-2">Policies</div>
          <Link href="/admin/policies" className="flex items-center gap-2 pl-4 hover:text-blue-600">
            <FileText size={18} /> All Policies
          </Link>
          <Link href="/admin/policies/create" className="flex items-center gap-2 pl-4 hover:text-blue-600">
            <FilePlus size={18} /> Create Policy
          </Link>
        </div>
        <Link href="/admin/claims" className="flex items-center gap-2 hover:text-blue-600">
          <ShieldCheck size={18} /> Claims
        </Link>
        <Link href="/admin/transactions" className="flex items-center gap-2 hover:text-blue-600">
          <Layers size={18} /> Transactions
        </Link>
        <Link href="/admin/reports" className="flex items-center gap-2 hover:text-blue-600">
          <BarChart2 size={18} /> Reports
        </Link>
        <Link href="/admin/contracts" className="flex items-center gap-2 hover:text-blue-600">
          <FileText size={18} /> Smart Contracts
        </Link>
        <Link href="/admin/settings" className="flex items-center gap-2 hover:text-blue-600 mt-4">
          <Settings size={18} /> Settings
        </Link>
      </nav>
      <div className="mt-auto pt-6 border-t text-sm text-gray-500">
        Logged in as Admin
      </div>
    </aside>
  );
};

export default AdminSidebar;
