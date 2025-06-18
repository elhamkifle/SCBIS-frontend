"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { purchaseRequestsApi, PurchaseRequest } from "../services/api";
import { usePurchaseRequestsSocket } from "../services/socket";
import withAuth from "../utils/withAuth";
import PurchaseRequestNotifications from "../components/notifications/PurchaseRequestNotifications";

function IncomingRequestsPage() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  
  const socket = usePurchaseRequestsSocket();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await purchaseRequestsApi.getAll();
      setRequests(response.data || []);
    } catch (err) {
      console.error("Failed to fetch purchase requests:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch purchase requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    // Set up Socket.IO listeners for real-time updates
    const setupSocketListeners = async () => {
      try {
        await socket.connect();

        // Listen for new purchase requests
        const unsubscribeNew = socket.on('new-purchase-request', (data) => {
          // Add new request to the top of the list with proper type conversion
          const newRequest: PurchaseRequest = {
            ...data.data,
            submittedOn: new Date(data.timestamp).toISOString()
          };
          setRequests(prev => [newRequest, ...prev]);
        });

        // Listen for status changes
        const unsubscribeStatusChange = socket.on('purchase-request-status-changed', (data) => {
          // Update the request in the list
          setRequests(prev => prev.map(req => 
            req.id === data.data.id 
              ? { ...req, status: data.data.newStatus }
              : req
          ));
        });

        // Listen for approvals
        const unsubscribeApproved = socket.on('purchase-request-approved', (data) => {
          // Update the request status
          setRequests(prev => prev.map(req => 
            req.id === data.data.id 
              ? { ...req, status: 'approved' }
              : req
          ));
        });

        // Listen for rejections
        const unsubscribeRejected = socket.on('purchase-request-rejected', (data) => {
          // Update the request status
          setRequests(prev => prev.map(req => 
            req.id === data.data.id 
              ? { ...req, status: 'rejected' }
              : req
          ));
        });

        // Listen for stats updates
        const unsubscribeStats = socket.on('purchase-requests-stats-updated', (data) => {
          setStats(data.data);
        });

        // Listen for reupload requests
        const unsubscribeReuploadRequested = socket.on('purchase-request-reupload-requested', (data) => {
          // This is a global notification - no need to update the request list
          // The notification will be handled by PurchaseRequestNotifications component
        });

        // Return cleanup function
        return () => {
          unsubscribeNew();
          unsubscribeStatusChange();
          unsubscribeApproved();
          unsubscribeRejected();
          unsubscribeStats();
          unsubscribeReuploadRequested();
          socket.disconnect();
        };
      } catch (error) {
        console.error('Failed to setup Socket.IO listeners:', error);
      }
    };

    setupSocketListeners();
  }, []);

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Incoming Purchase Requests</h1>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold">Error Loading Requests</p>
              <p className="mt-2">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Incoming Purchase Requests</h1>
        
        {/* Real-time Stats */}
        <div className="flex space-x-4 text-sm">
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            Pending: {stats.pending}
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
            Approved: {stats.approved}
          </div>
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
            Rejected: {stats.rejected}
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            Total: {stats.total}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-9 w-24" />
              </CardContent>
            </Card>
          ))
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <p className="text-lg font-semibold">No Purchase Requests</p>
              <p className="mt-2">There are currently no incoming purchase requests.</p>
            </CardContent>
          </Card>
        ) : (
          requests.map((req) => (
            <Card key={req.id} className="transition-all duration-300 hover:shadow-md">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-medium text-lg">{req.user?.fullname || "Unknown User"}</h2>
                  <p className="text-sm text-gray-500">Policy: {req.policyType || "N/A"}</p>
                  {req.policyId && (
                    <p className="text-sm text-gray-600">Policy ID: {req.policyId}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    Submitted on: {req.submittedOn ? new Date(req.submittedOn).toLocaleDateString() : "N/A"}
                  </p>
                  <div className="mt-1">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-semibold transition-colors duration-300 ${
                        req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        req.status === 'approved' ? 'bg-green-100 text-green-700' :
                        req.status === 'canceled' || req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {req.status?.charAt(0).toUpperCase() + req.status?.slice(1) || "Unknown"}
                    </span>
                  </div>
                </div>
                <Link href={`/purchaseRequests/${req.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Real-time notifications */}
      <PurchaseRequestNotifications />
    </div>
  );
}

export default withAuth(IncomingRequestsPage);