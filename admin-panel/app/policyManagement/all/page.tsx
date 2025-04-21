"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

const mockPolicies = [
    {
        id: "POL-001",
        holder: "Alice Johnson",
        license: "ABC-1234",
        status: "Active",
        issueDate: "2024-04-01",
        expiryDate: "2025-04-01",
    },
    {
        id: "POL-002",
        holder: "Bob Smith",
        license: "XYZ-5678",
        status: "Expired",
        issueDate: "2023-03-01",
        expiryDate: "2024-03-01",
    },
    {
        id: "POL-003",
        holder: "Charlie Brown",
        license: "LMN-9101",
        status: "Terminated",
        issueDate: "2022-01-15",
        expiryDate: "2023-01-15",
    },
    {
        id: "POL-004",
        holder: "Diana Prince",
        license: "OPQ-2345",
        status: "Active",
        issueDate: "2023-06-10",
        expiryDate: "2024-06-10",
    },
    {
        id: "POL-005",
        holder: "Ethan Hunt",
        license: "RST-6789",
        status: "Expired",
        issueDate: "2021-09-20",
        expiryDate: "2022-09-20",
    },
    {
        id: "POL-006",
        holder: "Fiona Gallagher",
        license: "UVW-3456",
        status: "Active",
        issueDate: "2023-11-01",
        expiryDate: "2024-11-01",
    },
    {
        id: "POL-007",
        holder: "George Michael",
        license: "XYZ-7890",
        status: "Terminated",
        issueDate: "2020-05-05",
        expiryDate: "2021-05-05",
    },
    {
        id: "POL-008",
        holder: "Hannah Montana",
        license: "ABC-5678",
        status: "Active",
        issueDate: "2023-08-15",
        expiryDate: "2024-08-15",
    },
];

const statusColors = {
  Active: "bg-green-100 text-green-800",
  Expired: "bg-yellow-100 text-yellow-800",
  Terminated: "bg-red-100 text-red-800"
};

export default function AllPoliciesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = mockPolicies.filter((p) => {
    const matchSearch =
      p.holder.toLowerCase().includes(search.toLowerCase()) ||
      p.license.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === "All" || p.status === filter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Policy Management</h1>
        <Button asChild>
          <Link href="/admin/policy-management/new">Create New Policy</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Label htmlFor="search" className="m-3">Search Policies</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by name, license or policy ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="filter" className="m-3">Filter by Status</Label>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              id="filter"
              className="border rounded-md w-full p-2 pl-10 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-500">
          <div className="col-span-3">Policy Holder</div>
          <div className="col-span-2">Policy ID</div>
          <div className="col-span-2">License</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Expiry Date</div>
          <div className="col-span-1">Actions</div>
        </div>

        {filtered.length > 0 ? (
          filtered.map((policy) => (
            <Card key={policy.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3">
                  <h2 className="font-medium">{policy.holder}</h2>
                  <p className="text-sm text-gray-500">{policy.issueDate}</p>
                </div>
                <div className="col-span-2 text-sm font-mono">{policy.id}</div>
                <div className="col-span-2 text-sm font-mono">{policy.license}</div>
                <div className="col-span-2">
                  <Badge variant="outline" className={statusColors[policy.status as keyof typeof statusColors]}>
                    {policy.status}
                  </Badge>
                </div>
                <div className="col-span-2 text-sm">
                  <span className={policy.status === "Expired" ? "text-red-600 font-medium" : ""}>
                    {policy.expiryDate}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Link href={`/admin/policy-management/all/${policy.id}`}>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 mb-4">No policies found</div>
            <Button variant="outline" onClick={() => { setSearch(""); setFilter("All"); }}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}