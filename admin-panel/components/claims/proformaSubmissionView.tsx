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
import { ArrowLeft, RefreshCw, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { claimsApi, type Claim } from "@/app/services/api";

interface ProformaSubmissionViewProps {
  claimId: string;
}

export default function ProformaSubmissionView({ claimId }: ProformaSubmissionViewProps) {
  const router = useRouter();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "proformaSubmissionPending":
        return "bg-indigo-100 text-indigo-700";
      case "proformaUnderReview":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleConfirmation = async () => {
    if (!claim) return;

    setUpdating(true);
    try {
      await claimsApi.confirmProformaSubmission(claimId, note || undefined);
      
      // Update local state
      setClaim({ ...claim, status: "proformaUnderReview", proformaSubmitted: true });
      
      toast.success("Proforma submission confirmed successfully! Claim is now under review for approval.");
      setIsDialogOpen(false);
      setNote("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to confirm proforma submission";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const openDialog = () => {
    setNote("");
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setNote("");
  };

  const handleRetry = () => {
    fetchClaim();
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
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
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-48" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Proforma Submission</h1>
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
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Proforma Submission</h1>
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
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
          <h1 className="text-2xl font-bold">Proforma Submission</h1>
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

      <div className="space-y-6">
        {/* Claim Information */}
        <Card>
          <CardContent className="space-y-4 p-4">
            <h2 className="text-lg font-semibold">Claim Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Claimant" value={claim.claimantName || claim.driverFullName || "N/A"} />
              <Detail label="Policy Number" value={claim.policyNumber} />
              <Detail label="Accident Date" value={formatDate(claim.accidentDate || claim.dateOfAccident)} />
              <Detail label="Claim Submitted" value={formatDate(claim.dateSubmitted)} />
            </div>
          </CardContent>
        </Card>

        {/* Proforma Status */}
        <Card className={claim.status === 'proformaSubmissionPending' ? "border-blue-200 bg-blue-50" : ""}>
          <CardContent className="space-y-4 p-4">
            <h2 className="text-lg font-semibold">Proforma Status</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                {claim.status === 'proformaSubmissionPending' ? (
                  <>
                    <p className="text-sm text-gray-700">Waiting for user to submit physical proforma documents</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Customer should bring proforma documents to the office for verification
                    </p>
                  </>
                ) : claim.status === 'proformaUnderReview' ? (
                  <>
                    <p className="text-sm text-green-700 font-medium">✅ Proforma documents received and confirmed</p>
                    <p className="text-xs text-green-600 mt-1">
                      Documents are now under review for final approval
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-700">Status: {claim.status}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        {claim.status === 'proformaSubmissionPending' && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="space-y-4 p-4">
              <h2 className="text-lg font-semibold">Instructions for Admin</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li>Wait for customer to submit proforma documents in person at the office</li>
                <li>Verify that the physical documents match the claim details</li>
                <li>Check that all required repair estimates are included</li>
                <li>Only confirm after receiving and verifying all required documents</li>
                <li>Once confirmed, the claim will move to final approval stage</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Button */}
        {claim.status === 'proformaSubmissionPending' && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-end">
                <Button 
                  onClick={openDialog}
                  disabled={updating}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  {updating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Confirm Proforma Submission
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Information */}
        {claim.status === 'proformaUnderReview' && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <p className="text-green-800 font-medium">✅ Proforma Submission Confirmed</p>
              <p className="text-green-700 text-sm mt-1">
                The proforma documents have been received and verified. The claim is now under review for final approval.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Proforma Submission</DialogTitle>
            <DialogDescription>
              Please confirm that you have received and verified the physical proforma documents from the customer.
              This will move the claim to the final approval stage.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Add a note about the received documents (optional)..."
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
              onClick={handleConfirmation}
              disabled={updating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {updating ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Confirm Submission
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