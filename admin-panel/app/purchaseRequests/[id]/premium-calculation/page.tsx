"use client";

import { useState, useEffect, use } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/ui/use-toast";
import { purchaseRequestsApi } from "../../../services/api";
import withAuth from "../../../utils/withAuth";

interface PremiumCalculationData {
  policyId: string;
  vehicleValue: number;
  depreciatedValue: number;
  vehicleAge: number;
  coverageType: string;
  baseRate: number;
  basePremium: number;
  finalMultiplier: number;
  finalPremium: number;
  duration: number;
  breakdown: {
    carValue: number;
    carAge: number;
    riskFactor: number;
    depreciationAmount: number;
    coverageType: string;
    basePremium: number;
    finalPremium: number;
  };
  appliedMultipliers: {
    commercial: number;
    underage: string | number;
    experience: number;
    accidents: number;
    claims: number;
  };
}

function PremiumCalculationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calculationData, setCalculationData] = useState<PremiumCalculationData | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch premium calculation data
  useEffect(() => {
    const fetchPremiumCalculation = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Calculating premium for request:', id);
        
        const response = await purchaseRequestsApi.calculatePremium(id);
        console.log('✅ Premium calculation response:', response);
        
        if (response.success && response.data) {
          setCalculationData(response.data);
        } else {
          throw new Error('Failed to calculate premium');
        }
      } catch (err) {
        console.error("❌ Failed to calculate premium:", err);
        setError(err instanceof Error ? err.message : "Failed to calculate premium");
        toast({
          title: "Error",
          description: "Failed to calculate premium. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPremiumCalculation();
    }
  }, [id]);

  const handleConfirm = async () => {
    if (!calculationData) return;

    setIsApproving(true);
    try {
      console.log('🔄 Approving request with premium data...');
      
      const approvalData = {
        calculatedPremium: calculationData.finalPremium,
        premiumBreakdown: calculationData.breakdown,
        policyDuration: calculationData.duration,
        effectiveDate: effectiveDate,
        notes: approvalNotes || undefined,
      };

      console.log('📋 Approval data:', approvalData);

      const response = await purchaseRequestsApi.approveWithPremium(id, approvalData);
      console.log('✅ Approval response:', response);

      if (response.success) {
        toast({
          title: "✅ Request Approved Successfully",
          description: `Policy ${response.data.policy.policyNumber} has been created with premium of ${response.data.policy.premium.toLocaleString()} Birr.`,
        });

        setIsConfirming(false);
        setIsSuccess(true);
      } else {
        throw new Error(response.message || 'Failed to approve request');
      }
    } catch (err) {
      console.error("❌ Failed to approve request:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to approve the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Card>
          <CardContent className="space-y-4 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Car Premium Calculation</h1>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold">Error Calculating Premium</p>
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

  if (!calculationData) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Car Premium Calculation</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">No calculation data available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Car Premium Calculation</h1>
      
      {/* Vehicle Information */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">Vehicle Information</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="carValue">Vehicle Value (Birr)</Label>
              <Input 
                id="carValue" 
                type="text" 
                value={calculationData.vehicleValue.toLocaleString()} 
                readOnly 
                className="bg-gray-50"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="depreciatedValue">Depreciated Value (Birr)</Label>
              <Input 
                id="depreciatedValue" 
                type="text" 
                value={calculationData.depreciatedValue.toLocaleString()} 
                readOnly 
                className="bg-gray-50"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="vehicleAge">Vehicle Age (Years)</Label>
              <Input 
                id="vehicleAge" 
                type="text" 
                value={calculationData.vehicleAge} 
                readOnly 
                className="bg-gray-50"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="coverage">Coverage Type</Label>
              <Input 
                id="coverage" 
                type="text" 
                value={calculationData.coverageType} 
                readOnly 
                className="bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Calculation Details */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-lg font-semibold text-green-700 mb-4">Premium Calculation</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="baseRate">Base Rate (%)</Label>
              <Input 
                id="baseRate" 
                type="text" 
                value={calculationData.baseRate} 
                readOnly 
                className="bg-gray-50"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="basePremium">Base Premium (Birr)</Label>
              <Input 
                id="basePremium" 
                type="text" 
                value={calculationData.basePremium.toLocaleString()} 
                readOnly 
                className="bg-gray-50"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="riskMultiplier">Risk Multiplier</Label>
              <Input 
                id="riskMultiplier" 
                type="text" 
                value={calculationData.finalMultiplier.toFixed(2)} 
                readOnly 
                className="bg-gray-50"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="duration">Policy Duration (Days)</Label>
              <Input 
                id="duration" 
                type="text" 
                value={calculationData.duration} 
                readOnly 
                className="bg-gray-50"
              />
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="text-gray-800 text-xl font-bold">
              <strong>Final Calculated Premium: {calculationData.finalPremium.toLocaleString()} Birr</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applied Risk Factors */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-lg font-semibold text-yellow-700 mb-4">Applied Risk Factors</h2>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Commercial Vehicle:</strong> {calculationData.appliedMultipliers.commercial !== 1 ? `${calculationData.appliedMultipliers.commercial}x` : 'Not Applied'}
            </div>
            <div>
              <strong>Underage Driver:</strong> {typeof calculationData.appliedMultipliers.underage === 'string' ? calculationData.appliedMultipliers.underage : `${calculationData.appliedMultipliers.underage}x`}
            </div>
            <div>
              <strong>Limited Experience:</strong> {calculationData.appliedMultipliers.experience !== 1 ? `${calculationData.appliedMultipliers.experience}x` : 'Not Applied'}
            </div>
            <div>
              <strong>Accident History:</strong> {calculationData.appliedMultipliers.accidents !== 1 ? `${calculationData.appliedMultipliers.accidents}x` : 'Not Applied'}
            </div>
            <div>
              <strong>Claims History:</strong> {calculationData.appliedMultipliers.claims !== 1 ? `${calculationData.appliedMultipliers.claims}x` : 'Not Applied'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Section */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-lg font-semibold text-purple-700 mb-4">Approval Details</h2>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="effectiveDate">Policy Effective Date</Label>
              <Input 
                id="effectiveDate" 
                type="date" 
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Approval Notes (Optional)</Label>
              <Textarea 
                id="notes" 
                placeholder="Enter any additional notes for this approval..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        className="mt-4" 
        onClick={() => setIsConfirming(true)}
        size="lg"
      >
        Approve and Confirm Policy
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirming} onOpenChange={setIsConfirming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Policy Approval</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this insurance request with a premium of <strong>{calculationData.finalPremium.toLocaleString()} Birr</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2 text-sm">
              <p><strong>Vehicle Value:</strong> {calculationData.vehicleValue.toLocaleString()} Birr</p>
              <p><strong>Coverage Type:</strong> {calculationData.coverageType}</p>
              <p><strong>Policy Duration:</strong> {calculationData.duration} days</p>
              <p><strong>Effective Date:</strong> {new Date(effectiveDate).toLocaleDateString()}</p>
              {approvalNotes && <p><strong>Notes:</strong> {approvalNotes}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsConfirming(false)}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={isApproving}
            >
              {isApproving ? "Approving..." : "Confirm Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccess} onOpenChange={setIsSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Policy Approved Successfully!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                The insurance request has been successfully approved.
              </p>
              <p className="text-sm text-gray-500">
                Premium: <strong>{calculationData.finalPremium.toLocaleString()} Birr</strong>
              </p>
            </div>
            <Button 
              className="w-full" 
              onClick={() => {
                setIsSuccess(false);
                // Navigate back to request details or list
                window.history.back();
              }}
            >
              Back to Requests
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAuth(PremiumCalculationPage);