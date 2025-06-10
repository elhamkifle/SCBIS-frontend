"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { userApi, Transaction } from "../../../../services/api";

export default function UserTransactionsPage() {
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<{
    totalTransactions: number;
    totalAmount: number;
    lastTransaction: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions from API
  const fetchTransactions = async (searchQuery = "", typeQuery = "All") => {
    if (!id || typeof id !== 'string') {
      setError("Invalid user ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await userApi.getUserTransactions(id, {
        search: searchQuery || undefined,
        type: typeQuery !== "All" ? typeQuery : undefined,
        limit: 50
      });
      
      setTransactions(response.transactions || []);
      setSummary(response.summary || null);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch transactions");
      setTransactions([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  // Load transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, [id]);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTransactions(search, typeFilter);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, typeFilter]);

  const filteredTransactions = transactions;

  const downloadReport = () => {
    if (transactions.length === 0) {
      alert("No transactions to download");
      return;
    }

    const content = `
User Transactions Report
========================

Summary:
- Total Transactions: ${summary?.totalTransactions || transactions.length}
- Total Amount: $${summary?.totalAmount || transactions.reduce((acc, tx) => acc + tx.amount, 0)}
- Last Transaction: ${summary?.lastTransaction || transactions[0]?.date || "N/A"}

Transactions:
${transactions.map(tx => 
  `${tx.date} | ${tx.type} | $${tx.amount} | ${tx.status} | ${tx.reference}`
).join('\n')}
    `;
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_${id}_transactions.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">User Transactions</h1>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold">Error Loading Transactions</p>
              <p className="mt-2">{error}</p>
              <Button 
                onClick={() => fetchTransactions(search, typeFilter)} 
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">User Transactions</h1>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Transactions</p>
            {loading ? (
              <Skeleton className="h-6 w-16 mt-1" />
            ) : (
              <p className="text-xl font-bold">{summary?.totalTransactions || transactions.length}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Amount</p>
            {loading ? (
              <Skeleton className="h-6 w-20 mt-1" />
            ) : (
              <p className="text-xl font-bold">
                ${summary?.totalAmount || transactions.reduce((acc, tx) => acc + tx.amount, 0)}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Last Transaction</p>
            {loading ? (
              <Skeleton className="h-6 w-24 mt-1" />
            ) : (
              <p className="text-xl font-bold">
                {summary?.lastTransaction || transactions[0]?.date || "N/A"}
              </p>
            )}
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
            disabled={loading}
          />
        </div>
        <div className="w-full md:w-64">
          <Label htmlFor="filter">Filter by Type</Label>
          <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val)} disabled={loading}>
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
        <Button 
          className="mt-6 md:mt-0" 
          onClick={downloadReport}
          disabled={loading || transactions.length === 0}
        >
          Download Report
        </Button>
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
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))
            ) : filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-6">
                  {search || typeFilter !== "All" 
                    ? "No transactions found matching your criteria." 
                    : "No transactions found."
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{tx.id}</TableCell>
                  <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell>{tx.reference}</TableCell>
                  <TableCell className={`font-medium ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${Math.abs(tx.amount)}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      tx.status === 'Success' ? 'bg-green-100 text-green-700' :
                      tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {tx.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
