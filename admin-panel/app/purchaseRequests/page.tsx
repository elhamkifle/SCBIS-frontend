"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { purchaseRequestsApi, PurchaseRequest } from "../services/api";
import withAuth from "../utils/withAuth";

function IncomingRequestsPage() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchRequests();
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
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Incoming Purchase Requests</h1>
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
            <Card key={req.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-medium text-lg">{req.user?.name || "Unknown User"}</h2>
                  <p className="text-sm text-gray-500">Policy: {req.policyType || "N/A"}</p>
                  <p className="text-xs text-gray-400">
                    Submitted on: {req.submittedOn ? new Date(req.submittedOn).toLocaleDateString() : "N/A"}
                  </p>
                  <div className="mt-1">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        req.status === 'approved' ? 'bg-green-100 text-green-700' :
                        req.status === 'canceled' ? 'bg-red-100 text-red-700' :
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
    </div>
  );
}

export default withAuth(IncomingRequestsPage);