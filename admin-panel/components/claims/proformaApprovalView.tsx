"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProformaApprovalViewProps {
  claimId: string;
}

export default function ProformaApprovalView({ claimId }: ProformaApprovalViewProps) {
  // Dummy data
  const claim = {
    id: claimId,
    status: "proformaUnderReview",
    driverFullName: "Elham Mulugeta",
    policyId: "POL-123456",
    vehicle: "Toyota Corolla 2018",
    proformaAmount: 125000,
  };

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

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!formData.coverageAmount || !formData.garage || !formData.fixType) {
        throw new Error("Please fill all required fields");
      }

      console.log("Approving with data:", {
        claimId,
        ...formData
      });

      // API call would go here
      // await approveProforma(claimId, formData);

      alert("Proforma approved successfully!");
    } catch (error) {
      console.error("Approval failed:", error);
      alert(error instanceof Error ? error.message : "Approval failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this proforma?")) return;
    
    setIsSubmitting(true);
    try {
      console.log("Rejecting proforma for claim:", claimId);
      // API call would go here
      // await rejectProforma(claimId);
      alert("Proforma rejected successfully!");
    } catch (error) {
      console.error("Rejection failed:", error);
      alert("Rejection failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Proforma Approval</h1>
        <Badge className="bg-pink-100 text-pink-700">
          {claim.status}
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Claim Information */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold">Claim Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Claimant</p>
              <p>{claim.driverFullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Policy Number</p>
              <p>{claim.policyId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vehicle</p>
              <p>{claim.vehicle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Proforma Amount</p>
              <p>{claim.proformaAmount.toLocaleString()} ETB</p>
            </div>
          </div>
        </div>

        {/* Approval Form */}
        <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
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
            <h3 className="font-medium">Spare Parts Location</h3>
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
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Reject Proforma"}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isSubmitting || !formData.coverageAmount || !formData.garage || !formData.fixType}
          >
            {isSubmitting ? "Processing..." : "Approve Proforma"}
          </Button>

          //TODO: Once approve proforma is clicked update the claim status to winnerAnnounced. Update the rest of the codebase as well. 
        </div>
      </div>
    </div>
  );
}