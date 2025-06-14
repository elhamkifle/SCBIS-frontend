"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface SubmittedClaimViewProps {
  claimId: string;
}

export default function SubmittedClaimView({ claimId }: SubmittedClaimViewProps) {
  // Dummy data - in real app this would come from API using claimId
  const claim = {
    id: claimId,
    status: "submitted",
    driverFullName: "Elham Mulugeta",
    policyId: "POL-123456",
    dateSubmitted: "2025-06-13T20:21:45.680Z",
    dateOfAccident: "2025-06-12T00:00:00.000Z",
    timeOfAccident: "22:46",
    location: {
      city: "Addis Ababa",
      subCity: "Sibila",
      kebele: "08"
    },
    vehicleDamageFiles: "./placeholder.png",
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Claim #{claim.id}</h1>
        <Badge className="bg-blue-100 text-blue-700">
          {claim.status}
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-gray-500">Claimant</p>
              <p>{claim.driverFullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Policy</p>
              <p>{claim.policyId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Submitted</p>
              <p>{formatDate(claim.dateSubmitted)}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Accident Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p>{formatDate(claim.dateOfAccident)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p>{claim.timeOfAccident}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Location</p>
              <p>{claim.location.city}, {claim.location.subCity}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Damage Evidence</h2>
          <div className="mt-2">
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="destructive">Reject</Button>
          //TODO: On reject, ask for reason, set status to rejected and statusReason to reason. 
          <Button>Approve</Button> 
          //TODO: When approved, set claim status to adminApproved, 
          //TODO: the admin has to upload a policeReportRequestLetter to cloudinary and set the policeReportRequestLetter to the URL so the user can download it.
        </div>
      </div>
      <Button> Back to Dashboard </Button>
    </div>
  );
}