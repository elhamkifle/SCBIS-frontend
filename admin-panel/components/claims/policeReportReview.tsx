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
import { ArrowLeft, RefreshCw, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { claimsApi, type Claim } from "@/app/services/api";

interface PoliceReportReviewProps {
  claimId: string;
}

export default function PoliceReportReview({ claimId }: PoliceReportReviewProps) {
  const router = useRouter();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [note, setNote] = useState("");
  const [imageLoading, setImageLoading] = useState(true);

  // Fetch claim details
  const fetchClaim = async () => {
    try {
      setLoading(true);
      setError(null);
      setImageLoading(true); // Reset image loading state
      
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

  // Debug police report URL when claim data changes
  useEffect(() => {
    if (claim?.policeReport) {
      
    } else {
      
    }
  }, [claim?.policeReport, imageLoading]);

  // Debug image rendering
  useEffect(() => {
    if (claim?.policeReport) {
      
    }
  }, [claim?.policeReport, imageLoading]);

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
      case "policeReportUnderReview":
        return "bg-yellow-100 text-yellow-800";
      case "proformaSubmissionPending":
        return "bg-indigo-100 text-indigo-700";
      case "rejected":
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleApprove = async () => {
    if (!claim) return;

    setUpdating(true);
    try {
      await claimsApi.approvePoliceReport(claimId, note || undefined);
      
      // Update local state
      setClaim({ ...claim, status: "proformaSubmissionPending" });
      
      toast.success("Police report approved successfully! User will be notified to submit proforma documents.");
      setIsDialogOpen(false);
      setNote("");
      setDialogAction(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to approve police report";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!claim || !note.trim()) return;

    setUpdating(true);
    try {
      await claimsApi.rejectPoliceReport(claimId, note);
      
      // Update local state
      setClaim({ ...claim, status: "rejected", rejectionReason: note });
      
      toast.success("Police report rejected successfully.");
      setIsDialogOpen(false);
      setNote("");
      setDialogAction(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reject police report";
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
            <Skeleton className="h-64 w-full" />
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
          <h1 className="text-2xl font-bold">Police Report Review</h1>
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
          <h1 className="text-2xl font-bold">Police Report Review</h1>
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
          <h1 className="text-2xl font-bold">Police Report Review</h1>
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
            <h2 className="text-lg font-semibold">Claim Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Claimant" value={claim.claimantName || claim.driverFullName || "N/A"} />
              <Detail label="Policy Number" value={claim.policyNumber} />
              <Detail label="Accident Date" value={formatDate(claim.accidentDate || claim.dateOfAccident)} />
              <Detail label="Claim Submitted" value={formatDate(claim.dateSubmitted)} />
            </div>
          </CardContent>
        </Card>

        {/* Police Report Information */}
        <Card>
          <CardContent className="space-y-4 p-4">
            <h2 className="text-lg font-semibold">Police Report Details</h2>
            
            {claim.policeReport ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {claim.policeOfficerName && (
                    <Detail label="Officer Name" value={claim.policeOfficerName} />
                  )}
                  {claim.policeStation && (
                    <Detail label="Police Station" value={claim.policeStation} />
                  )}
                  <Detail label="Police Involved" value={claim.policeInvolved ? "Yes" : "No"} />
                </div>

                {/* Report Document Viewer */}
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Police Report Document</p>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    {/* Display the actual image */}
                    <div className="space-y-3">
                      {imageLoading && (
                        <Skeleton className="w-full h-64 rounded-lg" />
                      )}
                      
                      <img
                        src={claim.policeReport}
                        alt="Police Report Document"
                        className={`w-full max-w-2xl mx-auto rounded-lg border shadow-sm ${imageLoading ? 'hidden' : 'block'}`}
                        style={{ maxHeight: '500px', objectFit: 'contain' }}
                        onLoad={() => {
                          setImageLoading(false);
                        }}
                        onError={() => {
                          setImageLoading(false);
                        }}
                      />
                      
                      {/* Keep the view button for opening in new tab */}
                      <div className="flex justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(claim.policeReport, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                          Open in New Tab
                      </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No police report document uploaded yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {claim.status === 'policeReportUnderReview' && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-end gap-4">
                <Button 
                  variant="destructive"
                  onClick={() => openDialog('reject')}
                  disabled={updating}
                >
                  {updating && dialogAction === 'reject' ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Reject Report
                </Button>
                <Button 
                  onClick={() => openDialog('approve')}
                  disabled={updating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {updating && dialogAction === 'approve' ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Approve Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Information */}
        {claim.status === 'proformaSubmissionPending' && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <p className="text-green-800 font-medium">✅ Police Report Approved</p>
              <p className="text-green-700 text-sm mt-1">
                User has been notified to submit proforma documents for repair estimates.
              </p>
            </CardContent>
          </Card>
        )}

        {claim.status === 'rejected' && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-800 font-medium">❌ Police Report Rejected</p>
              {claim.rejectionReason && (
                <p className="text-red-700 text-sm mt-1">
                  Reason: {claim.rejectionReason}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'approve' ? 'Approve Police Report' : 'Reject Police Report'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'approve' 
                ? 'Approving this police report will notify the user to submit proforma documents for repair estimates.'
                : 'Please provide a reason for rejecting this police report.'
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
              {dialogAction === 'approve' ? 'Approve Report' : 'Reject Report'}
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