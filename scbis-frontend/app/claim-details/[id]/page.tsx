"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Sidebar from "@/components/staticComponents/sidebar";
import Header from "@/components/staticComponents/header";
import { Footer } from "@/components/staticComponents/footer";
import { useClaimDetailsStore } from "@/store/claimSubmission/claim-details";
import { useClaimsStore } from "@/store/dashboard/claims";
import { StageCard } from "@/components/ClaimDetails/StageCard";
import { UnderReviewCard } from "@/components/ClaimDetails/UnderReviewCard";
import { useRouter } from "next/navigation";

type ClaimStage = "submitted" | "proformaSubmissionPending" | "adminApproved" | "policeReportUnderReview" | "proformaUnderReview" | "closed" | "winnerAnnounced";

export default function ClaimDetailsPage() {
    const params = useParams();
    const claimId = params?.id as string;
    const router = useRouter();

    const [backendClaim, setBackendClaim] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Get claims from local storage via Zustand
    const { claims } = useClaimsStore();
    const localClaim = claims.find(claim => claim._id === claimId);

    const claim = useClaimDetailsStore();
    const [policeReport, setPoliceReport] = useState<File | null>(null);

    useEffect(() => {
        const fetchClaimDetails = async () => {
            try {
                setLoading(true);

                // If we have the claim in local storage, use that
                if (localClaim) {
                    setBackendClaim(localClaim);
                    setLoading(false);
                    return;
                }

                // Otherwise fetch from backend
                const accessToken = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/)?.[1];

                const response = await axios.get(
                    `https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/claims/${claimId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                setBackendClaim(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching claim details:', err);
                setError('Failed to load claim details');
                setLoading(false);
            }
        };

        if (claimId) {
            fetchClaimDetails();
            console.log(backendClaim)
        }
    }, [claimId, localClaim]);

    const handlePoliceReportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPoliceReport(e.target.files[0]);
        }
    };

    const uploadPoliceReport = async () => {
        if (!policeReport) return;
        
        try {
            setUploading(true);
            
            // Upload to Cloudinary
            const formdata = new FormData();
            formdata.append('file', policeReport);
            formdata.append('upload_preset', 'docuploads');
            
            const uploadResult = await axios.post(
                `https://api.cloudinary.com/v1_1/dmzvqehan/upload`,
                formdata
            );
            
            if (uploadResult.statusText === "OK") {
                console.log(uploadResult.data.secure_url);
                const policeReportUrl = uploadResult.data.secure_url;
                
                // Update the claim with the police report URL
                const accessToken = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/)?.[1];
                
                const updateResponse = await axios.patch(
                    `https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/claims/${claimId}`,
                    {
                        policeReport: policeReportUrl,
                        status: "policeReportUnderReview"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                
                if (updateResponse.status === 200) {
                    // Update local state and move to next stage
                    setBackendClaim(updateResponse.data);
                    claim.nextStage();
                }
            }
        } catch (err) {
            console.error('Error uploading police report:', err);
            setError('Failed to upload police report');
        } finally {
            setUploading(false);
        }
    };

    const handleStageChange = (newStage: ClaimStage) => {
        claim.setClaim({ stage: newStage });
    };

    // Determine stage based on claim status and other properties
    const determineStage = (): ClaimStage => {
        if (!backendClaim) return "submitted";
        console.log(backendClaim.status)

        switch (backendClaim.status) {
            case "submitted":
                return "submitted";
            case "proformaSubmissionPending":
                return "proformaSubmissionPending";
            case "adminApproved":
                return "adminApproved";
            case "policeReportUnderReview":
                return "policeReportUnderReview";
            case "proformaUnderReview":
                return "proformaUnderReview";
            case "closed":
                return "closed";
            case "winnerAnnounced":
                return "winnerAnnounced";
            default:
                return "submitted"; // Default case
        }
    };

    const currentStage: ClaimStage = claim.stage || determineStage();

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="m-auto text-center">
                    <p>Loading claim details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="m-auto text-center text-red-500">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!backendClaim) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="m-auto text-center">
                    <p>Claim not found</p>
                </div>
            </div>
        );
    }

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
                            switch (backendClaim.status) {
                                case "submitted":
                                    return (
                                        <UnderReviewCard
                                            title="Claim Review"
                                            status="Pending Admin Approval"
                                            statusColor="#DBBF1F"
                                            description="Claim is under review by admin."
                                            note="Your claim will be processed as soon as possible."
                                            buttonLabel="Approve Claim (Demo)"
                                        />
                                    );
                                case "adminApproved":
                                    return (
                                        <StageCard title="Request and Submit Police Report">
                                            <div className="space-y-6">
                                                {backendClaim.policeReportRequestLetter && (
                                                    <div className="border rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold mb-3">Download Request Letter</h3>
                                                        <div className="flex items-center justify-center bg-gray-50 p-4 rounded-lg mb-4">
                                                            <a href={backendClaim.policeReportRequestLetter} download className="block">
                                                                <img
                                                                    src={backendClaim.policeReportRequestLetter}
                                                                    alt="Police Report Request Letter"
                                                                    className="w-64 h-64 object-contain"
                                                                />
                                                            </a>
                                                        </div>
                                                        <a
                                                            href={backendClaim.policeReportRequestLetter}
                                                            download="Police_Report_Request_Letter.pdf"
                                                            rel="noopener noreferrer"
                                                            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors inline-block text-center"
                                                        >
                                                            Download Request Letter
                                                        </a>

                                                    </div>
                                                )}

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
                                                                    onClick={uploadPoliceReport}
                                                                    disabled={uploading}
                                                                    className={`w-full px-4 py-2 text-white rounded transition-colors ${
                                                                        uploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                                                                    }`}
                                                                >
                                                                    {uploading ? 'Uploading...' : 'Submit Police Report'}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {backendClaim.policeReport ? (
                                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                        <h3 className="text-lg font-semibold text-green-800 mb-2">Police Report Submitted</h3>
                                                        <p className="text-green-700">Your police report has been received.</p>
                                                        <button
                                                            onClick={() => claim.nextStage()}
                                                            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                                        >
                                                            Continue
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </StageCard>
                                    );
                                case "policeReportUnderReview":
                                    return (
                                        <UnderReviewCard
                                            title="Waiting for Approval"
                                            status="Police Report Under Review"
                                            statusColor="#DBBF1F"
                                            description="Your police report is under review. Please wait for further instructions."
                                            note="You will be notified once your report is approved."
                                            buttonLabel="Back to Dashboard"
                                        />
                                    );
                                case "proformaSubmissionPending":
                                    return (
                                        <StageCard title="Submit Proforma In Person">
                                            <p className="mb-4">
                                                Please come to the office and submit a proforma from your preferred garage and/or spare parts company.
                                            </p>
                                            <p className="mb-4"> If you have already submitted please wait for upto 24 hours for your Proforma to be verified.</p>
                                            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded w-full" onClick={() => router.push("/dashboard")}>
                                                Back To Dashboard
                                            </button>
                                        </StageCard>
                                    );
                                case "proformaUnderReview":
                                    return (
                                        <UnderReviewCard
                                            title="Proforma Under Review"
                                            status="Proforma Under Review"
                                            statusColor="#DBBF1F"
                                            description="Your proforma is being reviewed. Please wait for the results."
                                            note="You will be notified once a decision is made."
                                            buttonLabel="Back to Dashboard"
                                        />
                                    );
                                case "winnerAnnounced":
                                    return (
                                        <StageCard title="Your Claim has been accepted and finalized!">
                                            <p className="mb-4">The garage picked for you is: {backendClaim.garage}</p>
                                            <p className="mb-4">Pick your spare parts from: {backendClaim.sparePartsFrom}</p>
                                            <p className="mb-2">Location: </p>
                                            <p className="ml-8"> City: {backendClaim.sparePartsFromLocation?.city}</p>
                                            <p className="ml-8"> City: {backendClaim.sparePartsFromLocation?.subCity}</p>
                                            <p className="ml-8"> Kebele: {backendClaim.sparePartsFromLocation?.kebele}</p>

                                            <a href="/dashboard">
                                                <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded w-full">Back to Dashboard</button>
                                            </a>
                                        </StageCard>
                                    );
                                default:
                                    const exhaustiveCheck = currentStage;
                                    return <StageCard title="Unknown Stage"><p>Unknown claim stage: {currentStage}</p></StageCard>;
                            }
                        })()}
                    </div>
                </main>
                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}