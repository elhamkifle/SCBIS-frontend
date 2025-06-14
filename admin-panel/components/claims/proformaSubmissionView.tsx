"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProformaSubmissionViewProps {
  claimId: string;
}

export default function ProformaSubmissionView({ claimId }: ProformaSubmissionViewProps) {
  // Dummy data
  const claim = {
    id: claimId,
    status: "proformaSubmissionPending",
    driverFullName: "Elham Mulugeta",
    policyId: "POL-123456",
    dateSubmitted: "2025-06-13T20:21:45.680Z",
    dateOfAccident: "2025-06-12T00:00:00.000Z",
    proformaStatus: "Pending physical submission"
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleConfirmation = () => {
    console.log(`Confirming proforma submission for claim ${claimId}`);
    // API call would go here to update status
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Proforma Submission</h1>
        <Badge className="bg-indigo-100 text-indigo-700">
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
              <p className="text-sm text-gray-500">Accident Date</p>
              <p>{formatDate(claim.dateOfAccident)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Claim Submitted</p>
              <p>{formatDate(claim.dateSubmitted)}</p>
            </div>
          </div>
        </div>

        {/* Proforma Status */}
        <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
          <h2 className="text-lg font-semibold">Proforma Status</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-700">{claim.proformaStatus}</p>
              <p className="text-xs text-gray-500 mt-1">
                Waiting for user to submit physical proforma documents
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4 p-4 border rounded-lg bg-yellow-50">
          <h2 className="text-lg font-semibold">Instructions</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
            <li>Customer should submit proforma in person at our office</li>
            <li>Verify the physical documents match the claim details</li>
            <li>Only confirm after receiving all required documents</li>
          </ul>
        </div>

        {/* Confirmation Button */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleConfirmation}
            className="bg-green-600 hover:bg-green-700"
          >
            Confirm Proforma Submission
          </Button>
        </div>

        //TODO: Upon proforma submission click, set status to proformaUnderReview
      </div>
    </div>
  );
}