"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface PoliceReportReviewProps {
  claimId: string;
}

export default function PoliceReportReview({ claimId }: PoliceReportReviewProps) {
  // Dummy data - would come from API in real app
  const claim = {
    id: claimId,
    status: "policeReportUnderReview",
    driverFullName: "Elham Mulugeta",
    policyId: "POL-123456",
    dateSubmitted: "2025-06-13T20:21:45.680Z",
    dateOfAccident: "2025-06-12T00:00:00.000Z",
    policeReport: {
      fileUrl: "https://example.com/police-report.pdf",
      reportNumber: "PR-2025-0678",
      officerName: "Officer Tewodros",
      station: "Sibila Police Station",
      dateFiled: "2025-06-13T00:00:00.000Z"
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleApprove = () => {
    console.log(`Approving police report for claim ${claimId}`);
    // API call would go here
  };

  const handleReject = () => {
    console.log(`Rejecting police report for claim ${claimId}`);
    // API call would go here
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Police Report Review</h1>
        <Badge className="bg-yellow-100 text-yellow-800">
          {claim.status}
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Claim Information */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold">Claim Information</h2>
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

        {/* Police Report Information */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold">Police Report Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Report Number</p>
              <p>{claim.policeReport.reportNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Officer Name</p>
              <p>{claim.policeReport.officerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Police Station</p>
              <p>{claim.policeReport.station}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date Filed</p>
              <p>{formatDate(claim.policeReport.dateFiled)}</p>
            </div>
          </div>

          {/* Report Document Viewer */}
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Report Document</p>
            <div className="border rounded-lg p-4 flex items-center justify-center h-64 bg-gray-50">
              {claim.policeReport.fileUrl.endsWith('.pdf') ? (
                <iframe 
                  src={claim.policeReport.fileUrl}
                  className="w-full h-full"
                  title="Police Report"
                />
              ) : (
                <Image
                  src={claim.policeReport.fileUrl}
                  alt="Police Report"
                  width={600}
                  height={400}
                  className="object-contain"
                />
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button 
            variant="destructive"
            onClick={handleReject}
          >
            Reject Report  
          </Button>
          //TODO: On reject, ask for reason, set status to rejected and statusReason to reason.
          <Button 
            onClick={handleApprove}
          >
            Approve Report
          </Button>
          //TODO: Upon approval, set the policy status to proformaSubmissionPending
        </div>
      </div>
    </div>
  );
}