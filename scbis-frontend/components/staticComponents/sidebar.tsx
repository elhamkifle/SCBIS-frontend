"use client";

import { useState } from "react";
import { User, LogOut, Settings, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/authStore/useUserStore";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const user = useUserStore((state) => state.user);
    const profileName = user?.fullname.split(' ') || []; 

    const router = useRouter();
    const logout = useUserStore((state) => state.logout);
    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            logout();
            router.push('/');
        }
    };


    return (
        <>
            <div className={`relative flex-col bg-gradient-to-r from-[#0F1E41] via-[#1B3E6B] to-[#245489] text-white h-full transition-all duration-300
            ${isCollapsed ? "w-16" : "w-64"} hidden lg:flex`}>

                {/* User Info Section */}
                <div className="flex flex-col items-center py-6 transition-opacity duration-300">
                    <User size={40} className="mb-2" />
                    {!isCollapsed && <span className="font-syne font-semibold text-center">{`${profileName[0]} ${profileName[1][0]}.`}</span>}
                </div>

                {/* Centered Navigation Sections */}
                <div className="flex-1 flex flex-col justify-start py-24 space-y-8 px-4 text-md font-semibold text-white">
                    {!isCollapsed && (
                        <>
                            <div className="text-center">Personal Information</div>
                            <div className="text-center">Vehicle Details</div>
                            <div className="text-center">Policy Selection</div>
                            <div className="text-center">Approval & Premium</div>
                            <div className="text-center">Payment & Issuance</div>
                        </>
                    )}
                </div>

                {/* Bottom Buttons */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                    {
                        !isCollapsed && (
                            <>
                                <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"><HelpCircle size={20} /></button>
                                <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"><Settings size={20} /></button>
                                {/* <button className="p-2 bg-gray-700 rounded-full hover:bg-red-500"><LogOut size={20} /></button> */}
                                <button
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

            {/* Card for Small & Medium Screens (Appears Above Other Content) */}
            <div className="lg:hidden w-[90%] max-w-lg bg-gradient-to-b from-[#102043] via-[#1B3E6C] to-[#235388] text-white rounded-xl shadow-xl p-6 text-center space-y-4 mx-auto mt-6">
                {/* User Info Section
                <div className="flex flex-col items-center mb-4">
                    <User size={50} className="mb-2" />
                    <span className="text-lg font-semibold">UserName</span>
                </div> */}

                {/* Navigation Sections */}
                <div className="space-y-2 text-gray-200 font-semibold">
                    <div>Personal Information</div>
                    <div>Vehicle Details</div>
                    <div>Policy Selection</div>
                    <div>Approval & Premium</div>
                    <div>Payment & Issuance</div>
                </div>

                {/* Bottom Buttons
                <div className="flex justify-center gap-4 mt-4">
                    <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"><HelpCircle size={24} /></button>
                    <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"><Settings size={24} /></button>
                    <button className="p-2 bg-gray-700 rounded-full hover:bg-red-500"><LogOut size={24} /></button>
                </div> */}
            </div>
        </>
    );
}
