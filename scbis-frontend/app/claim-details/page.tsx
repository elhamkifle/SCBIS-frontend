"use client";
import { useState } from "react";
import Sidebar from "../../components/staticComponents/sidebar";
import Header from "../../components/staticComponents/header";
import { Footer } from "../../components/staticComponents/footer";
import { Car } from "lucide-react";

// Claim interface
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
    // ...other claim fields
}

// Mock claim data
const mockClaim: Claim = {
    id: "1",
    stage: "review",
    adminImageUrl: "/admin-image.png",
    winnerProformaUrl: "/winning-proforma.pdf",
};

export default function ClaimDetailsPage() {
    const [claim, setClaim] = useState<Claim>(mockClaim);
    const [policeReport, setPoliceReport] = useState<File | null>(null);

    // For demo: function to move to next stage
    const nextStage = () => {
        const order: Claim["stage"][] = [
            "review",
            "admin-approved",
            "waiting-approval",
            "in-person",
            "under-review",
            "winner-announced",
        ];
        const idx = order.indexOf(claim.stage);
        if (idx < order.length - 1) {
            setClaim({ ...claim, stage: order[idx + 1] });
        }
    };

    // For demo: handle police report upload
    const handlePoliceReportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPoliceReport(e.target.files[0]);
            // In real app, upload to server and update claim
            nextStage();
        }
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
                                            onNext={nextStage}
                                            buttonLabel="Approve Claim (Demo)"
                                        />
                                    );
                                case "admin-approved":
                                    return (
                                        <StageCard title="Admin Approval">
                                            <p className="mb-4">Your claim has been approved. Please download the image and upload your police report.</p>
                                            <a href={claim.adminImageUrl} download className="block my-4">
                                                <img src={claim.adminImageUrl} alt="Admin Provided" className="w-64 h-64 object-contain border rounded mx-auto" />
                                                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded w-full">Download Image</button>
                                            </a>
                                            <div className="my-4">
                                                <label className="block mb-2 font-semibold">Upload Police Report:</label>
                                                <input type="file" onChange={handlePoliceReportUpload} className="w-full" />
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
                                            onNext={nextStage}
                                            buttonLabel="Simulate Approval (Demo)"
                                        />
                                    );
                                case "in-person":
                                    return (
                                        <StageCard title="Submit Proforma In Person">
                                            <p className="mb-4">
                                                Please come to the office and submit a proforma from your preferred garage and/or spare parts company.
                                            </p>
                                            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded w-full" onClick={nextStage}>
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
                                            onNext={nextStage}
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
        </div>
    );
}

function StageCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 w-full">
            <h1 className="text-2xl font-bold text-blue-900 mb-6">{title}</h1>
            {children}
        </div>
    );
}

function UnderReviewCard({
    title,
    status,
    statusColor,
    description,
    note,
    onNext,
    buttonLabel,
}: {
    title: string;
    status: string;
    statusColor: string;
    description: string;
    note: string;
    onNext: () => void;
    buttonLabel: string;
}) {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border mb-8" style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.06)' }}>
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-4" style={{ color: statusColor }}>{title}</h2>
                <p className="text-blue-600 font-semibold mb-4">
                    Status: <span style={{ color: statusColor }}>{status}</span>
                </p>
                <p className="text-blue-600">{description}</p>
            </div>
            <div className="pb-4 mb:8 md:mb-24 px-2 md:px-16">
                <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold">
                    <Car size={20} />
                    <h3 className="text-lg">Claim & Policy Details:</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-md">
                    <p><strong>Claim ID:</strong> 1</p>
                    <p><strong>Vehicle Type:</strong> Toyota Corolla 2021</p>
                    <p><strong>Plate Number:</strong> Code 2 - A12345</p>
                    <p><strong>Insurance Type:</strong> Comprehensive Cover</p>
                    <p><strong>Policy Duration:</strong> 1 Year</p>
                </div>
            </div>
            <p className="text-md mt-8">
                <span className="font-bold text-blue-700">N.B:</span> {note}
            </p>
            {onNext && (
                <button className="mt-8 px-4 py-2 bg-blue-600 text-white rounded w-full" onClick={onNext}>
                    {buttonLabel}
                </button>
            )}
        </div>
    );
} 