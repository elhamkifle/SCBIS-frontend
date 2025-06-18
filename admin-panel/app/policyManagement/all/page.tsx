"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, RefreshCw } from "lucide-react";
import { purchaseRequestsApi, PurchaseRequest } from "../../services/api";
import { usePurchaseRequestsSocket } from "../../services/socket";
import withAuth from "../../utils/withAuth";
import PurchaseRequestNotifications from "../../components/notifications/PurchaseRequestNotifications";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  canceled: "bg-red-100 text-red-800"
};

const statusDisplayNames = {
  pending: "Pending",
  approved: "Approved", 
  rejected: "Rejected",
  canceled: "Canceled"
};

function AllPoliciesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('all');
  const [policies, setPolicies] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });

  const socket = usePurchaseRequestsSocket();

  const fetchPolicies = async (currentPage = 1, currentSearch = search, currentFilter = filter) => {
    try {
      setLoading(true);
      setError(null);
      
      const params: {
        page: number;
        limit: number;
        search?: string;
        status?: 'pending' | 'approved' | 'rejected';
      } = {
        page: currentPage,
        limit: pagination.limit,
      };
      
      if (currentSearch.trim()) {
        params.search = currentSearch.trim();
      }
      
      if (currentFilter !== 'all') {
        params.status = currentFilter;
      }
      
      const response = await purchaseRequestsApi.getAllRequests(params);
      setPolicies(response.data || []);
      
      // Update pagination if meta exists
      if (response.meta) {
        setPagination(prev => ({
          ...prev,
          page: response.meta!.page,
          total: response.meta!.total,
          totalPages: Math.ceil(response.meta!.total / response.meta!.limit)
        }));
      }
    } catch (err) {
      console.error("Failed to fetch policies:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch policies");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPolicies(1, search, filter);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, filter]);

  useEffect(() => {
    fetchPolicies();

    // Set up Socket.IO listeners for real-time updates
    const setupSocketListeners = async () => {
      try {
        await socket.connect();

        // Listen for new purchase requests
        const unsubscribeNew = socket.on('new-purchase-request', (data) => {
          console.log('New purchase request:', data);
          // Refresh the list to include new request
          fetchPolicies(pagination.page, search, filter);
        });

        // Listen for status changes
        const unsubscribeStatusChange = socket.on('purchase-request-status-changed', (data) => {
          console.log('Status changed:', data);
          // Update the specific request in the list
          setPolicies(prev => prev.map(policy => 
            policy.id === data.data.id 
              ? { ...policy, status: data.data.newStatus }
              : policy
          ));
        });

        // Listen for approvals
        const unsubscribeApproved = socket.on('purchase-request-approved', (data) => {
          console.log('Request approved:', data);
          setPolicies(prev => prev.map(policy => 
            policy.id === data.data.id 
              ? { ...policy, status: 'approved' }
              : policy
          ));
        });

        // Listen for rejections
        const unsubscribeRejected = socket.on('purchase-request-rejected', (data) => {
          console.log('Request rejected:', data);
          setPolicies(prev => prev.map(policy => 
            policy.id === data.data.id 
              ? { ...policy, status: 'rejected' }
              : policy
          ));
        });

        // Listen for stats updates
        const unsubscribeStats = socket.on('purchase-requests-stats-updated', (data) => {
          console.log('Stats updated:', data);
          setStats(data.data);
        });

        // Return cleanup function
        return () => {
          unsubscribeNew();
          unsubscribeStatusChange();
          unsubscribeApproved();
          unsubscribeRejected();
          unsubscribeStats();
        };
      } catch (error) {
        console.error('Failed to setup Socket.IO listeners:', error);
      }
    };

    setupSocketListeners();
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchPolicies(newPage, search, filter);
  };

  const handleRefresh = () => {
    fetchPolicies(pagination.page, search, filter);
  };

  const clearFilters = () => {
    setSearch("");
    setFilter('all');
  };

  if (error) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">Policy Management</h1>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold">Error Loading Policies</p>
              <p className="mt-2">{error}</p>
              <Button 
                onClick={handleRefresh} 
                className="mt-4"
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
        <PurchaseRequestNotifications />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Policy Management</h1>
        <div className="flex items-center space-x-4">
          {/* Real-time Stats */}
          <div className="flex space-x-2 text-sm">
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              Pending: {stats.pending}
            </div>
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Approved: {stats.approved}
            </div>
            <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
              Rejected: {stats.rejected}
            </div>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <Label htmlFor="search" className="m-3">Search Policies</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by policy type, user name, or policy ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="filter" className="m-3">Filter by Status</Label>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              id="filter"
              title="Filter policies by status"
              className="border rounded-md w-full p-2 pl-10 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'pending' | 'approved' | 'rejected' | 'all')}
              disabled={loading}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="documentReuploadRequest">documentReuploadRequest</option>
              <option value="expired">Expired</option>
              <option value="premiumDecided">PremiumDecided</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-500">
          <div className="col-span-3">Policy Holder</div>
          <div className="col-span-2">Policy ID</div>
          <div className="col-span-2">Policy Type</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Submitted On</div>
          <div className="col-span-1">Actions</div>
        </div>

        {loading ? (
          // Loading skeleton
          Array.from({ length: 8 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24 mt-1" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="col-span-1">
                  <Skeleton className="h-8 w-12" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : policies.length > 0 ? (
          policies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-md transition-all duration-300">
              <CardContent className="p-4 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-3">
                  <h2 className="font-medium">{policy.user?.fullname || "Unknown User"}</h2>
                  <p className="text-sm text-gray-500">{policy.user?.email || "No email"}</p>
                </div>
                <div className="col-span-2 text-sm font-mono">{policy.id}</div>
                <div className="col-span-2 text-sm">{policy.policyType || "N/A"}</div>
                <div className="col-span-2">
                  <Badge 
                    variant="outline" 
                    className={`transition-colors duration-300 ${
                      statusColors[policy.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {statusDisplayNames[policy.status as keyof typeof statusDisplayNames] || policy.status}
                  </Badge>
                </div>
                <div className="col-span-2 text-sm">
                  <span className={
                    policy.status === "expired" || policy.status === "rejected" 
                      ? "text-red-600 font-medium" 
                      : ""
                  }>
                    {policy.submittedOn ? new Date(policy.submittedOn).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Link href={`/purchaseRequests/${policy.id}`}>
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
            <div className="text-gray-400 mb-4">
              {search || filter !== 'all' ? 'No policies found matching your criteria' : 'No policies found'}
            </div>
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1 || loading}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages} 
            ({pagination.total} total policies)
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}

      {/* Real-time notifications */}
      <PurchaseRequestNotifications />
    </div>
  );
}

export default withAuth(AllPoliciesPage);