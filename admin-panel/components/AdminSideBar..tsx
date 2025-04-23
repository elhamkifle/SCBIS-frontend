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
    <div>
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-xs text-gray-500 uppercase tracking-wide px-2 py-1">
        {title}
        <ChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} size={16} />
      </button>
      {open && (
        <div className="pl-4 space-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600">
              <link.icon size={18} /> {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white h-screen shadow-md p-4 space-y-6 flex flex-col">
      <nav className="flex-1 space-y-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm hover:text-blue-600">
          <LayoutDashboard size={18} /> Dashboard
        </Link>

        <SidebarGroup
          title="Policy Operations"
          links={[
            { label: "Incoming Requests", href: "/purchaseRequests", icon: ClipboardList },
            { label: "Premium Calculation", href: "/premiumCalculation", icon: FileCheck },
            { label: "Payment Confirmations", href: "/admin/payments", icon: Mail },
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

      <div className="text-sm text-gray-400 border-t pt-4">
        <Link href="/admin/settings" className="flex items-center gap-2 hover:text-blue-600">
          <Settings size={18} /> Settings
        </Link>
      </div>
    </aside>
  );
}
