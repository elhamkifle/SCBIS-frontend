"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { claimsApi, type Claim } from "@/app/services/api";
import { ArrowLeft, RefreshCw } from "lucide-react";
import withAuth from "../../../utils/withAuth";

function ClaimDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState("");
  const [dialogAction, setDialogAction] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch claim details
  const fetchClaim = async () => {
    if (!id || typeof id !== 'string') {
      setError('Invalid claim ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await claimsApi.getClaimById(id);
      setClaim(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch claim details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaim();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-700";
      case "submitted":
      case "Submitted":
        return "bg-blue-100 text-blue-700";
      case "Under Review":
      case "policeReportUnderReview":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
      case "adminApproved":
        return "bg-green-100 text-green-800";
      case "Rejected":
      case "rejected":
        return "bg-red-100 text-red-700";
      case "winnerAnnounced":
        return "bg-orange-100 text-orange-700";
      case "proformaSubmissionPending":
        return "bg-indigo-100 text-indigo-700";
      case "proformaUnderReview":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Helper function to format dates safely
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "Not specified";
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  // Helper function to format location safely
  const formatLocation = (location: string | object) => {
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location !== null) {
      // Try to extract meaningful location info from object
      const loc = location as Record<string, unknown>;
      if (typeof loc.name === 'string') return loc.name;
      if (typeof loc.city === 'string') return loc.city;
      if (typeof loc.address === 'string') return loc.address;
      return "Location specified";
    }
    return "Not specified";
  };

  const handleStatusChange = async (newStatus: string, note: string) => {
    if (!claim || !id || typeof id !== 'string') return;

    try {
      setUpdating(true);
      
      await claimsApi.updateClaimStatus(id, newStatus, note);
      
      // Update local state
      const updatedHistory = [
        ...(claim.statusHistory || []),
        {
          status: newStatus,
          note,
          date: new Date().toISOString(),
        },
      ];
      setClaim({ ...claim, status: newStatus as Claim["status"], statusHistory: updatedHistory });
      
      toast.success(`Claim ${newStatus.toLowerCase()} successfully`);
      setIsDialogOpen(false);
      setNote("");
      setDialogAction(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update claim status";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleRetry = () => {
    fetchClaim();
  };

  const openStatusDialog = (action: string) => {
    setDialogAction(action);
    setNote("");
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogAction(null);
    setNote("");
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardContent className="space-y-6 p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-3">
                <Skeleton className="h-36 w-36" />
                <Skeleton className="h-36 w-36" />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Claim Details</h1>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-red-600">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-red-800 font-medium">Failed to load claim details</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
              <Button onClick={handleRetry} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No claim found
  if (!claim) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Claim Details</h1>
        </div>
        
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">Claim not found</p>
            <p className="text-gray-500 text-sm mt-1">
              The claim you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Claim Details</h1>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleRetry}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{claim.claimantName}</p>
              <p className="text-sm text-gray-500">
                Submitted on {formatDate(claim.dateSubmitted)}
              </p>
            </div>
            <Badge className={getStatusColor(claim.status)}>{claim.status}</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <Detail label="Policy Number" value={claim.policyNumber} />
            <Detail label="Vehicle Info" value={claim.vehicleInfo} />
            <Detail label="Accident Date" value={formatDate(claim.accidentDate)} />
            <Detail label="Location" value={formatLocation(claim.location)} />
            <Detail label="Driver Name" value={claim.driverName} />
            <Detail label="Declaration Signed" value={claim.declaration ? "Yes" : "No"} />
          </div>

          <div>
            <p className="font-medium text-sm mb-2">Damage Evidence</p>
            {claim.damageImages && claim.damageImages.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto">
                {claim.damageImages.map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt={`Damage Photo ${i + 1}`}
                    width={150}
                    height={150}
                    className="rounded-lg border shadow object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No damage images uploaded</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-4 flex-wrap">
              {["Approve", "Reject"].map((action) => (
                <Button
                  key={action}
                  variant={
                    action === "Approve"
                      ? "default"
                      : action === "Reject"
                      ? "destructive"
                      : "outline"
                  }
                  className={
                    action === "Approve"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : ""
                  }
                  onClick={() => openStatusDialog(action)}
                  disabled={updating}
                >
                  {updating && dialogAction === action ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {action}
                </Button>
              ))}
            </div>

            <div className="flex gap-4 flex-wrap">
              {["Under Review", "Needs More Info", "Forwarded"].map((action) => {
                let buttonClass = "";
                if (action === "Under Review") {
                  buttonClass = "bg-blue-50 hover:bg-blue-100 text-blue-700";
                } else if (action === "Needs More Info") {
                  buttonClass = "bg-amber-50 hover:bg-amber-100 text-amber-700";
                } else if (action === "Forwarded") {
                  buttonClass = "bg-purple-50 hover:bg-purple-100 text-purple-700";
                }

                return (
                  <Button
                    key={action}
                    variant="outline"
                    className={buttonClass}
                    onClick={() => openStatusDialog(action)}
                    disabled={updating}
                  >
                    {updating && dialogAction === action ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {action}
                  </Button>
                );
              })}
            </div>
          </div>

          {claim.statusHistory && claim.statusHistory.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Status History</h2>
              <ul className="space-y-3 text-sm">
                {claim.statusHistory.map((entry, i) => (
                  <li key={i} className="bg-gray-50 p-3 rounded-md border">
                    <div className="flex justify-between">
                      <span className="font-semibold">{entry.status}</span>
                      <span className="text-gray-500">
                        {new Date(entry.date).toLocaleString()}
                      </span>
                    </div>
                    {entry.note && <p className="text-gray-700 mt-1">Note: {entry.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Claim Status: {dialogAction}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Add a note to explain the reason for this status change:
            </p>
            <Textarea
              placeholder={`Enter note for ${dialogAction || 'status change'}`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={updating}>
              Cancel
            </Button>
            <Button
              onClick={() => handleStatusChange(dialogAction || "", note)}
              disabled={updating || !note.trim()}
              className={
                dialogAction === "Approve"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : dialogAction === "Reject"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : ""
              }
            >
              {updating ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirm {dialogAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="text-sm font-medium text-gray-900 bg-gray-100 rounded px-3 py-1">{value}</p>
    </div>
  );
}

export default withAuth(ClaimDetailsPage);