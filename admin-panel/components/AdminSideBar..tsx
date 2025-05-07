"use client";
import Link from "next/link";
import {
  LayoutDashboard, FileText, ClipboardList, ShieldCheck,
  FileSearch, Users, BarChart, FileCheck, Mail, Settings, ChevronDown
} from "lucide-react";
import { useState } from "react";

const SidebarGroup = ({ title, links }: { title: string; links: { label: string; href: string; icon: any }[] }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 hover:bg-gray-100 rounded-lg transition-all"
      >
        <span>{title}</span>
        <ChevronDown
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          size={16}
        />
      </button>
      {open && (
        <div className="pl-2 mt-1 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 text-sm text-gray-700 hover:bg-gradient-to-r from-gray-50 to-blue-50 px-3 py-2 rounded-lg transition-all group"
            >
              <link.icon size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="group-hover:text-blue-600 font-medium transition-colors">{link.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white h-screen border-r border-gray-200 p-4 flex flex-col shadow-sm">
      <div className="mb-6 px-2 pt-1">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Admin Panel</h2>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r from-gray-50 to-blue-50 px-3 py-2 rounded-lg transition-all group"
        >
          <LayoutDashboard size={18} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
          <span className="group-hover:text-blue-600 transition-colors">Dashboard</span>
        </Link>

        <SidebarGroup
          title="Policy Operations"
          links={[
            { label: "Incoming Requests", href: "/purchaseRequests", icon: ClipboardList },
            { label: "Premium Calculation", href: "/premiumCalculation", icon: FileCheck }
          ]}
        />

        <SidebarGroup
          title="Policy Management"
          links={[
            { label: "All Policies", href: "/policyManagement/all", icon: FileText },
            { label: "Search Policies", href: "/admin/policies/search", icon: FileSearch },
            { label: "Policy Details", href: "/admin/policies/details", icon: FileText },
          ]}
        />

        <SidebarGroup
          title="Claims"
          links={[
            { label: "Incoming Claims", href: "/admin/claims/incoming", icon: ShieldCheck },
            { label: "Pending (Police Report)", href: "/admin/claims/police-report", icon: FileText },
            { label: "Ongoing/Closed", href: "/admin/claims/ongoing", icon: FileSearch },
            { label: "Notify Performa", href: "/admin/claims/performa", icon: Mail },
          ]}
        />

        <SidebarGroup
          title="Reports & Analytics"
          links={[
            { label: "Generate Reports", href: "/admin/reports", icon: BarChart },
            { label: "Underwriter Reports", href: "/admin/reports/underwriters", icon: FileText },
            { label: "Claims Dept Reports", href: "/admin/reports/claims", icon: FileText },
          ]}
        />

        <SidebarGroup
          title="User Management"
          links={[
            { label: "Users", href: "userManagement/users", icon: Users },
            { label: "Roles & Permissions", href: "/userManagement/rolesAndPermissions", icon: Settings },
          ]}
        />
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <Link
          href="/settings"
          className="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all group"
        >
          <Settings size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
          <span className="group-hover:text-blue-600 font-medium transition-colors">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
