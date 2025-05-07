"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const mockUsers = [
  { id: "u12345", fullname: "Alice Johnson" },
  { id: "u67890", fullname: "Bereket Tesfaye" },
];

const mockPolicies = [
  { id: "p-001", type: "Car Insurance", status: "Active", startDate: "2024-04-01", endDate: "2025-04-01" },
  { id: "p-002", type: "Car Insurance", status: "Expired", startDate: "2023-04-01", endDate: "2024-04-01" },
  { id: "p-003", type: "Car Insurance", status: "Expired", startDate: "2023-04-01", endDate: "2024-04-01" },
  { id: "p-004", type: "Car Insurance", status: "Expired", startDate: "2023-04-01", endDate: "2024-04-01" },
  { id: "p-005", type: "Car Insurance", status: "Expired", startDate: "2023-04-01", endDate: "2024-04-01" },
];

export default function PoliciesPage() {
  const { id } = useParams();
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Find the user by ID
  const user = mockUsers.find((user) => user.id === id);

  const filteredPolicies = mockPolicies.filter((policy) =>
    policy.id.toLowerCase().includes(search.toLowerCase()) ||
    policy.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Policies for {user ? user.fullname : "Unknown User"}
      </h1>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Search Policies</Label>
          <Input
            id="search"
            placeholder="Search by policy ID or type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Policies Table */}
      <Card>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell>{policy.id}</TableCell>
                  <TableCell>{policy.type}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        policy.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {policy.status}
                    </span>
                  </TableCell>
                  <TableCell>{policy.startDate}</TableCell>
                  <TableCell>{policy.endDate}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/userManagement/users/${id}/policies/${policy.id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPolicies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400 py-6">
                    No policies found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}