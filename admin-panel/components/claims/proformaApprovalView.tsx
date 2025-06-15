"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface ProformaApprovalViewProps {
  claimId: string;
}

export default function ProformaApprovalView({ claimId }: ProformaApprovalViewProps) {
  const router = useRouter();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [note, setNote] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    coverageAmount: "",
    garage: "",
    sparePartsFrom: "",
    sparePartsFromLocation: {
      city: "",
      subCity: "",
      kebele: ""
    },
    fixType: ""
  });

  // Fetch claim details
  const fetchClaim = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await claimsApi.getClaimById(claimId);
      setClaim(response);
      
      // Pre-populate form with existing data if available
      if (response.coverageAmount) setFormData(prev => ({ ...prev, coverageAmount: response.coverageAmount?.toString() || "" }));
      if (response.garage) setFormData(prev => ({ ...prev, garage: response.garage || "" }));
      if (response.sparePartsFrom) setFormData(prev => ({ ...prev, sparePartsFrom: response.sparePartsFrom || "" }));
      if (response.fixType) setFormData(prev => ({ ...prev, fixType: response.fixType || "" }));
      if (response.sparePartsFromLocation) {
        setFormData(prev => ({ 
          ...prev, 
          sparePartsFromLocation: {
            city: response.sparePartsFromLocation?.city || "",
            subCity: response.sparePartsFromLocation?.subCity || "",
            kebele: response.sparePartsFromLocation?.kebele || ""
          }
        }));
      }
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
      case "proformaUnderReview":
        return "bg-pink-100 text-pink-700";
      case "winnerAnnounced":
        return "bg-green-100 text-green-800";
      case "rejected":
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      sparePartsFromLocation: {
        ...prev.sparePartsFromLocation,
        [name]: value
      }
    }));
  };

  const handleApprove = async () => {
    if (!claim) return;

    // Validate required fields
    if (!formData.coverageAmount || !formData.garage || !formData.fixType) {
      toast.error("Please fill all required fields");
      return;
    }

    setUpdating(true);
    try {
      const approvalData = {
        coverageAmount: parseFloat(formData.coverageAmount),
        garage: formData.garage,
        sparePartsFrom: formData.sparePartsFrom || undefined,
        sparePartsFromLocation: formData.sparePartsFromLocation.city || formData.sparePartsFromLocation.subCity || formData.sparePartsFromLocation.kebele 
          ? formData.sparePartsFromLocation 
          : undefined,
        fixType: formData.fixType,
        note: note || undefined,
      };

      await claimsApi.approveProforma(claimId, approvalData);
      
      // Update local state
      setClaim({ 
        ...claim, 
        status: "winnerAnnounced",
        ...approvalData,
        coverageAmount: approvalData.coverageAmount
      });
      
      toast.success("Proforma approved successfully! Claim has been finalized.");
      setIsDialogOpen(false);
      setNote("");
      setDialogAction(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to approve proforma";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!claim || !note.trim()) return;

    setUpdating(true);
    try {
      await claimsApi.rejectProforma(claimId, note);
      
      // Update local state
      setClaim({ ...claim, status: "rejected", rejectionReason: note });
      
      toast.success("Proforma rejected successfully.");
      setIsDialogOpen(false);
      setNote("");
      setDialogAction(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reject proforma";
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
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
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
          <h1 className="text-2xl font-bold">Proforma Approval</h1>
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
          <h1 className="text-2xl font-bold">Proforma Approval</h1>
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
          <h1 className="text-2xl font-bold">Proforma Approval</h1>
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
              <Detail label="Vehicle" value={claim.vehicleInfo || "N/A"} />
              <Detail label="Claim Amount" value={claim.claimAmount ? `${claim.claimAmount.toLocaleString()} ETB` : "N/A"} />
            </div>
          </CardContent>
        </Card>

        {/* Approval Form */}
        {claim.status === 'proformaUnderReview' && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="space-y-4 p-4">
              <h2 className="text-lg font-semibold">Approval Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coverage Amount */}
                <div className="space-y-2">
                  <Label htmlFor="coverageAmount">Coverage Amount (ETB)*</Label>
                  <Input
                    id="coverageAmount"
                    name="coverageAmount"
                    type="number"
                    value={formData.coverageAmount}
                    onChange={handleChange}
                    placeholder="Enter coverage amount"
                    required
                  />
                </div>

                {/* Garage */}
                <div className="space-y-2">
                  <Label htmlFor="garage">Garage*</Label>
                  <Input
                    id="garage"
                    name="garage"
                    value={formData.garage}
                    onChange={handleChange}
                    placeholder="Enter garage name"
                    required
                  />
                </div>

                {/* Spare Parts From */}
                <div className="space-y-2">
                  <Label htmlFor="sparePartsFrom">Spare Parts From</Label>
                  <Input
                    id="sparePartsFrom"
                    name="sparePartsFrom"
                    value={formData.sparePartsFrom}
                    onChange={handleChange}
                    placeholder="Enter spare parts source"
                  />
                </div>

                {/* Fix Type */}
                <div className="space-y-2">
                  <Label htmlFor="fixType">Fix Type*</Label>
                  <Select
                    onValueChange={(value) => setFormData({...formData, fixType: value})}
                    value={formData.fixType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fix type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_repair">Full Repair</SelectItem>
                      <SelectItem value="partial_repair">Partial Repair</SelectItem>
                      <SelectItem value="replacement">Replacement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Spare Parts Location */}
              <div className="mt-4 space-y-4 p-4 border rounded bg-white">
                <h3 className="font-medium">Spare Parts Location (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.sparePartsFromLocation.city}
                      onChange={handleLocationChange}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subCity">Sub City</Label>
                    <Input
                      id="subCity"
                      name="subCity"
                      value={formData.sparePartsFromLocation.subCity}
                      onChange={handleLocationChange}
                      placeholder="Sub City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kebele">Kebele</Label>
                    <Input
                      id="kebele"
                      name="kebele"
                      value={formData.sparePartsFromLocation.kebele}
                      onChange={handleLocationChange}
                      placeholder="Kebele"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {claim.status === 'proformaUnderReview' && (
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
                  Reject Proforma
                </Button>
                <Button
                  onClick={() => openDialog('approve')}
                  disabled={updating || !formData.coverageAmount || !formData.garage || !formData.fixType}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {updating && dialogAction === 'approve' ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Approve Proforma
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Information */}
        {claim.status === 'winnerAnnounced' && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <p className="text-green-800 font-medium">✅ Proforma Approved - Claim Finalized</p>
              <p className="text-green-700 text-sm mt-1">
                The claim has been successfully processed and approved. Coverage amount: {claim.coverageAmount?.toLocaleString()} ETB
              </p>
              {claim.garage && (
                <p className="text-green-700 text-sm">Approved garage: {claim.garage}</p>
              )}
            </CardContent>
          </Card>
        )}

        {claim.status === 'rejected' && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-800 font-medium">❌ Proforma Rejected</p>
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
              {dialogAction === 'approve' ? 'Approve Proforma' : 'Reject Proforma'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'approve' 
                ? 'This will finalize the claim with the specified coverage details and mark it as completed.'
                : 'Please provide a reason for rejecting this proforma.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {dialogAction === 'approve' && (
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p><strong>Coverage Amount:</strong> {formData.coverageAmount} ETB</p>
                <p><strong>Garage:</strong> {formData.garage}</p>
                <p><strong>Fix Type:</strong> {formData.fixType}</p>
                {formData.sparePartsFrom && <p><strong>Spare Parts From:</strong> {formData.sparePartsFrom}</p>}
              </div>
            )}
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
              {dialogAction === 'approve' ? 'Approve Proforma' : 'Reject Proforma'}
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