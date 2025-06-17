"use client";

type ClaimStage = "submitted" | "adminApproved" | "policeReportUnderReview" | "proformaUnderReview" | "closed" | "winnerAnnounced"| "proformaSubmissionPending" | "rejected";

interface StageSelectorProps {
    currentStage: ClaimStage;
    onStageChange: (stage: ClaimStage) => void;
}

export function StageSelector({ currentStage, onStageChange }: StageSelectorProps) {
    const stages: ClaimStage[] = [
        "submitted", "adminApproved", "policeReportUnderReview", "proformaUnderReview", "closed", "winnerAnnounced", "proformaSubmissionPending", "rejected"
    ];

    return (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50">
            <h3 className="text-sm font-semibold mb-2">Test Stages</h3>
            <div className="flex flex-col gap-2">
                {stages.map((stage) => (
                    <button
                        key={stage}
                        onClick={() => onStageChange(stage)}
                        className={`px-3 py-1 text-sm rounded ${currentStage === stage
                                ? "bg-blue-600 text-black"
                                : "bg-gray-600 hover:bg-blue-200"
                            }`}
                    >
                        {stage.replace(/-/g, " ")}
                    </button>
                ))}
            </div>
        </div>
    );
} 