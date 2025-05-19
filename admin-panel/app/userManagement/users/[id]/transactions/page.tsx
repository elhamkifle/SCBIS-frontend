"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockTransactions = [
  {
    id: "tx-001",
    date: "2025-04-01",
    type: "Policy Purchase",
    amount: 1200,
    status: "Success",
    reference: "Auto Policy #456",
  },
  {
    id: "tx-002",
    date: "2025-04-15",
    type: "Claim Payout",
    amount: -800,
    status: "Success",
    reference: "Claim #CL-204",
  },
  {
    id: "tx-003",
    date: "2025-04-18",
    type: "Policy Refund",
    amount: -200,
    status: "Pending",
    reference: "Refund #RF-901",
  },
];

export default function UserTransactionsPage() {
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredTransactions = mockTransactions.filter((tx) => {
    return (
      (typeFilter === "All" || tx.type === typeFilter) &&
      (tx.id.includes(search) || tx.reference.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">User Transactions</h1>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="text-xl font-bold">{mockTransactions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-xl font-bold">
              ${mockTransactions.reduce((acc, tx) => acc + tx.amount, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Last Transaction</p>
            <p className="text-xl font-bold">{mockTransactions[0]?.date || "N/A"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Search by ID or Reference</Label>
          <Input
            id="search"
            placeholder="e.g. tx-001 or claim"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
  <Label htmlFor="filter">Filter by Type</Label>
  <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val)}>
    <SelectTrigger id="filter" className="w-full">
      <span>{typeFilter || "All"}</span>
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="All">All</SelectItem>
      <SelectItem value="Policy Purchase">Policy Purchase</SelectItem>
      <SelectItem value="Claim Payout">Claim Payout</SelectItem>
      <SelectItem value="Policy Refund">Policy Refund</SelectItem>
    </SelectContent>
  </Select>
</div>
        <Button className="mt-6 md:mt-0">Download Report</Button>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.id}</TableCell>
                <TableCell>{tx.date}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell>{tx.reference}</TableCell>
                <TableCell className="font-medium ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}">
                  ${tx.amount}
                </TableCell>
                <TableCell>{tx.status}</TableCell>
              </TableRow>
            ))}
            {filteredTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-6">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
