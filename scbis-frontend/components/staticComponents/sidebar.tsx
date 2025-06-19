"use client";

import { useState, useEffect } from "react";
import { User, LogOut, Settings, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/authStore/useUserStore";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [completedStages, setCompletedStages] = useState<string[]>([]);
    const user = useUserStore((state) => state.user);
    const profileName = user?.fullname.split(' ') || [];
    const router = useRouter();
    const pathname = usePathname();
    const logout = useUserStore((state) => state.logout);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Define claim submission stages and their corresponding paths
    const claimStages = [
        { name: "Claim Initiation Agreement", path: "/claim-submission/initiation" },
        { name: "Incident Information", path: "/claim-submission/incident" },
        { name: "Damage Details", path: "/claim-submission/damage" },
        { name: "Declaration and Submission", path: "/claim-submission/declaration" }
    ];

    // Define policy purchase stages and their corresponding paths
    const purchaseStages = [
        { name: "Personal Information", path: "/policy-purchase/personal-information" },
        { name: "Vehicle Details", path: "/policy-purchase/vehicle-details" },
        { name: "Policy Selection", path: "/policy-purchase/policy-selection" },
        { name: "Approval & Premium", path: "/policy-purchase/approval" },
        { name: "Payment & Issuance", path: "/policy-purchase/payment" }
    ];

    // Determine which stages to use based on the current route
    const isClaimSubmission = pathname.startsWith('/claim-submission');
    const stages = isClaimSubmission ? claimStages : purchaseStages;

    // Get current stage based on pathname
    const getCurrentStage = () => {
        return stages.find(stage => pathname.startsWith(stage.path))?.name || "";
    };

    // Get text color based on stage status
    const getTextColor = (stageName: string) => {
        if (stageName === getCurrentStage()) {
            return "text-[#23C140]"; // Current stage
        } else if (completedStages.includes(stageName)) {
            return "text-[#3AF5FF]"; // Completed stage
        }
        return "text-white"; // Default color for incomplete stages
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        router.push('/login');
        setShowLogoutModal(false);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    // Safe function to get display name
    const getDisplayName = () => {
        if (!profileName || profileName.length === 0) return "User";
        if (profileName.length === 1) return profileName[0];
        return `${profileName[0]} ${profileName[1]?.[0] || ''}.`;
    };

    return (
        <>
            <div className={`relative flex-col bg-gradient-to-r from-[#0F1E41] via-[#1B3E6B] to-[#245489] text-white h-full transition-all duration-300
            ${isCollapsed ? "w-16" : "w-64"} hidden lg:flex`}>

                {/* User Info Section */}
                <div className="flex flex-col items-center py-6 transition-opacity duration-300">
                    <User size={40} className="mb-2" />
                    {!isCollapsed && <span className="font-syne font-semibold text-center">{getDisplayName()}</span>}
                </div>

                {/* Centered Navigation Sections */}
                <div className="flex-1 flex flex-col justify-start py-24 space-y-8 px-4 text-md font-semibold">
                    {!isCollapsed && (
                        <>
                            {stages.map((stage) => (
                                <div key={stage.name} className={`text-center ${getTextColor(stage.name)}`}>
                                    {stage.name}
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Bottom Buttons */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                    {
                        !isCollapsed && (
                            <>
                                <button aria-label="Help" className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"><HelpCircle size={20} /></button>
                                <button aria-label="Settings" className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"><Settings size={20} /></button>
                                <button
                                    aria-label="Logout"
                                    className="p-2 bg-gray-700 rounded-full hover:bg-red-500"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        )
                    }
                </div>

                {/* Collapse Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute right-[-14px] top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Card for Small & Medium Screens */}
            <div className="lg:hidden w-[90%] max-w-lg bg-gradient-to-b from-[#102043] via-[#1B3E6C] to-[#235388] text-white rounded-xl shadow-xl p-6 text-center space-y-4 mx-auto mt-6">
                {/* Navigation Sections */}
                <div className="space-y-2 font-semibold">
                    {stages.map((stage) => (
                        <div key={stage.name} className={getTextColor(stage.name)}>
                            {stage.name}
                        </div>
                    ))}
                </div>
            </div>

            <ConfirmModal
                isOpen={showLogoutModal}
                title="Logout Confirmation"
                message="Are you sure you want to log out?"
                confirmText="Logout"
                cancelText="Cancel"
                onConfirm={confirmLogout}
                onCancel={cancelLogout}
            />
        </>
    );
}
