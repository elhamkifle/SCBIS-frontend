"use client";
import { useState } from "react";
import Sidebar from "../../components/staticComponents/sidebar";
import Header from "../../components/staticComponents/header";
import { Footer } from "../../components/staticComponents/footer";
import { useClaimDetailsStore } from "@/store/claimSubmission/claim-details";
import { useDriverDetailsStore } from "@/store/claimSubmission/driver-details";
import { useAccidentDetailsStore } from "@/store/claimSubmission/accident-details";
import { useLiabilityInformationStore } from "@/store/claimSubmission/liability-information";
import { useWitnessInformationStore } from "@/store/claimSubmission/witness-information";
import { useDamageDetailsStore } from "@/store/claimSubmission/damage-details";
import { StageCard } from "@/components/ClaimDetails/StageCard";
import { UnderReviewCard } from "@/components/ClaimDetails/UnderReviewCard";
import { StageSelector } from "@/components/ClaimDetails/StageSelector";


interface Claim {
    id: string;
    stage:
    | "review"
    | "admin-approved"
    | "waiting-approval"
    | "in-person"
    | "under-review"
    | "winner-announced";
    adminImageUrl?: string;
    policeReportUrl?: string;
    proformaUrls?: string[];
    winnerProformaUrl?: string;
}

export default function ClaimDetailsPage() {
    const claim = useClaimDetailsStore();
    const { formData: driver } = useDriverDetailsStore();
    const accidentDetails = useAccidentDetailsStore();
    const liability = useLiabilityInformationStore();
    const witness = useWitnessInformationStore();
    const damage = useDamageDetailsStore();
    const [policeReport, setPoliceReport] = useState<File | null>(null);

    
    const handlePoliceReportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPoliceReport(e.target.files[0]);
            claim.nextStage();
        }
    };

    const handleStageChange = (newStage: Claim["stage"]) => {
        claim.setClaim({ stage: newStage });
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Sidebar for Large Screens */}
            <div className="hidden lg:flex">
                <Sidebar />
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <div className="sticky top-0 w-full z-50">
                    <Header />
                </div>
                {/* Sidebar as a Card (Only for Small & Medium Screens) */}
                <div className="lg:hidden flex justify-center mt-6">
                    <Sidebar />
                </div>
                {/* Main Claim Content */}
                <main className="flex-1 flex flex-col items-center justify-center py-8 px-2">
                    <div className="w-full max-w-3xl">
                        {(() => {
                            switch (claim.stage) {
                                case "review":
                                    return (
                                        <UnderReviewCard
                                            title="Claim Review"
                                            status="Pending Admin Approval"
                                            statusColor="#DBBF1F"
                                            description="Claim is under review by admin."
                                            note="Your claim will be processed as soon as possible."
                                            onNext={claim.nextStage}
                                            buttonLabel="Approve Claim (Demo)"
                                            claimData={{
                                                driver,
                                                accidentDetails,
                                                liability,
                                                witness,
                                                damage
                                            }}
                                        />
                                    );
                                case "admin-approved":
                                    return (
                                        <StageCard title="Request and Submit Police Report">
                                            <div className="space-y-6">
                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Instructions:</h3>
                                                    <ol className="list-decimal list-inside space-y-2 text-blue-700">
                                                        <li>Download the request letter below</li>
                                                        <li>Take this letter to your local police station</li>
                                                        <li>Request an official police report for your accident</li>
                                                        <li>Once you receive the police report, upload it here</li>
                                                    </ol>
                                                </div>

                                                <div className="border rounded-lg p-4">
                                                    <h3 className="text-lg font-semibold mb-3">Download Request Letter</h3>
                                                    <div className="flex items-center justify-center bg-gray-50 p-4 rounded-lg mb-4">
                                                        <a href="/placeholder-police-request.png" download className="block">
                                                            <img
                                                                src="/placeholder-police-request.png"
                                                                alt="Police Report Request Letter"
                                                                className="w-64 h-64 object-contain"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%236b7280'%3ERequest Letter%3C/text%3E%3C/svg%3E";
                                                                }}
                                                            />
                                                        </a>
                                                    </div>
                                                    <a
                                                        href="/placeholder-police-request.png"
                                                        download
                                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors inline-block text-center"
                                                    >
                                                        Download Request Letter
                                                    </a>
                                                </div>

                                                <div className="border rounded-lg p-4">
                                                    <h3 className="text-lg font-semibold mb-3">Upload Police Report</h3>
                                                    <div className="space-y-4">
                                                        <p className="text-gray-600 text-sm">Please upload the official police report you received from the police station.</p>
                                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                                            <input
                                                                type="file"
                                                                onChange={handlePoliceReportUpload}
                                                                className="hidden"
                                                                id="police-report-upload"
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                            />
                                                            <label
                                                                htmlFor="police-report-upload"
                                                                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                            >
                                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                                                </svg>
                                                                Choose File
                                                            </label>
                                                            <p className="mt-2 text-xs text-gray-500">PDF, JPG, or PNG up to 10MB</p>
                                                        </div>
                                                        {policeReport && (
                                                            <div className="mt-4">
                                                                <p className="text-sm text-gray-600 mb-2">Selected file: {policeReport.name}</p>
                                                                <button
                                                                    onClick={() => claim.nextStage()}
                                                                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                                                >
                                                                    Submit Police Report
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </StageCard>
                                    );
                                case "waiting-approval":
                                    return (
                                        <UnderReviewCard
                                            title="Waiting for Approval"
                                            status="Police Report Under Review"
                                            statusColor="#DBBF1F"
                                            description="Your police report is under review. Please wait for further instructions."
                                            note="You will be notified once your report is approved."
                                            onNext={claim.nextStage}
                                            buttonLabel="Simulate Approval (Demo)"
                                        />
                                    );
                                case "in-person":
                                    return (
                                        <StageCard title="Submit Proforma In Person">
                                            <p className="mb-4">
                                                Please come to the office and submit a proforma from your preferred garage and/or spare parts company.
                                            </p>
                                            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded w-full" onClick={claim.nextStage}>
                                                I have submitted (Demo)
                                            </button>
                                        </StageCard>
                                    );
                                case "under-review":
                                    return (
                                        <UnderReviewCard
                                            title="Proforma Under Review"
                                            status="Proforma Under Review"
                                            statusColor="#DBBF1F"
                                            description="Your proforma is being reviewed. Please wait for the results."
                                            note="You will be notified once a decision is made."
                                            onNext={claim.nextStage}
                                            buttonLabel="Announce Winner (Demo)"
                                        />
                                    );
                                case "winner-announced":
                                    return (
                                        <StageCard title="Winner Announced">
                                            <p className="mb-4">The proforma that won the deal is:</p>
                                            <a href={claim.winnerProformaUrl} download>
                                                <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded w-full">Download Winning Proforma</button>
                                            </a>
                                        </StageCard>
                                    );
                                default:
                                    return <StageCard title="Unknown Stage"><p>Unknown claim stage.</p></StageCard>;
                            }
                        })()}
                    </div>
                </main>
                {/* Footer */}
                <Footer />
            </div>
            {/* Stage Selector for Testing */}
            <StageSelector currentStage={claim.stage} onStageChange={handleStageChange} />
        </div>
    );
} 