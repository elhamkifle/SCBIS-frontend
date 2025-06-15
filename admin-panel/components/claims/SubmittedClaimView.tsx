"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { claimsApi, type Claim } from "@/app/services/api";
import Image from "next/image";

interface SubmittedClaimViewProps {
  claimId: string;
}

export default function SubmittedClaimView({ claimId }: SubmittedClaimViewProps) {
  const router = useRouter();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [note, setNote] = useState("");

  // Fetch claim details
  const fetchClaim = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await claimsApi.getClaimById(claimId);
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
    if (claimId) {
      fetchClaim();
    }
  }, [claimId]);

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "Not specified";
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  const formatLocation = (location: string | object) => {
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location !== null) {
      const loc = location as Record<string, unknown>;
      if (typeof loc.name === 'string') return loc.name;
      if (typeof loc.city === 'string') return loc.city;
      if (typeof loc.address === 'string') return loc.address;
      return "Location specified";
    }
    return "Not specified";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
      case "Submitted":
        return "bg-blue-100 text-blue-700";
      case "adminApproved":
        return "bg-green-100 text-green-800";
      case "rejected":
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleApprove = async () => {
    if (!claim) return;

    setUpdating(true);
    try {
      await claimsApi.approveSubmittedClaim(claimId, note || undefined);
      
      // Update local state
      setClaim({ ...claim, status: "adminApproved" });
      
      toast.success("Claim approved successfully! User will be notified to submit police report.");
      setIsDialogOpen(false);
      setNote("");
      setDialogAction(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to approve claim";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!claim || !note.trim()) return;

    setUpdating(true);
    try {
      await claimsApi.rejectSubmittedClaim(claimId, note);
      
      // Update local state
      setClaim({ ...claim, status: "rejected", rejectionReason: note });
      
      toast.success("Claim rejected successfully.");
      setIsDialogOpen(false);
      setNote("");
      setDialogAction(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reject claim";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const openDialog = (action: 'approve' | 'reject') => {
    setDialogAction(action);
    setNote("");
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogAction(null);
    setNote("");
  };

  const handleRetry = () => {
    fetchClaim();
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="flex justify-end gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Submitted Claim</h1>
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
                  <p className="text-red-800 font-medium">Failed to load claim</p>
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

  if (!claim) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Submitted Claim</h1>
        </div>
        
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Claim not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
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
          <h1 className="text-2xl font-bold">Claim #{claim.claimId || claim.id}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge className={getStatusColor(claim.status)}>
            {claim.status}
          </Badge>
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
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Claimant" value={claim.claimantName || claim.driverFullName || "N/A"} />
              <Detail label="Policy Number" value={claim.policyNumber} />
              <Detail label="Submitted" value={formatDate(claim.dateSubmitted)} />
              <Detail label="Vehicle Info" value={claim.vehicleInfo || "N/A"} />
            </div>
          </div>

          {/* Accident Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Accident Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Accident Date" value={formatDate(claim.accidentDate || claim.dateOfAccident)} />
              <Detail label="Time" value={claim.timeOfAccident || "N/A"} />
              <Detail label="Location" value={formatLocation(claim.location)} />
              <Detail label="Driver Name" value={claim.driverName || claim.driverFullName || "N/A"} />
            </div>
          </div>

          {/* Additional Details */}
          {claim.description && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{claim.description}</p>
            </div>
          )}

          {/* Damage Evidence */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Damage Evidence</h2>
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

          {/* Vehicle Damage Files */}
          {claim.vehicleDamageFiles && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Vehicle Damage Files</h2>
              <div className="bg-gray-50 p-3 rounded">
                <a 
                  href={claim.vehicleDamageFiles} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View Vehicle Damage Files
                </a>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {(claim.status === 'submitted' || claim.status === 'Submitted') && (
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button 
                variant="destructive"
                onClick={() => openDialog('reject')}
                disabled={updating}
              >
                {updating && dialogAction === 'reject' ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Reject
              </Button>
              <Button 
                onClick={() => openDialog('approve')}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700"
              >
                {updating && dialogAction === 'approve' ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Approve
              </Button>
            </div>
          )}

          {/* Status Information */}
          {claim.status === 'adminApproved' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">✅ Claim Approved</p>
              <p className="text-green-700 text-sm mt-1">
                User has been notified to submit police report documents.
              </p>
            </div>
          )}

          {claim.status === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">❌ Claim Rejected</p>
              {claim.rejectionReason && (
                <p className="text-red-700 text-sm mt-1">
                  Reason: {claim.rejectionReason}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'approve' ? 'Approve Claim' : 'Reject Claim'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'approve' 
                ? 'Approving this claim will notify the user to submit police report documents.'
                : 'Please provide a reason for rejecting this claim.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder={
                dialogAction === 'approve' 
                  ? 'Add a note (optional)...' 
                  : 'Enter rejection reason...'
              }
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
              onClick={dialogAction === 'approve' ? handleApprove : handleReject}
              disabled={updating || (dialogAction === 'reject' && !note.trim())}
              className={
                dialogAction === 'approve'
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {updating ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {dialogAction === 'approve' ? 'Approve Claim' : 'Reject Claim'}
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