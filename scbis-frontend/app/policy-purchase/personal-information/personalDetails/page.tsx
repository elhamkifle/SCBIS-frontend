'use client';

import Sidebar from "@/components/staticComponents/sidebar";
import Header from "@/components/staticComponents/header";
import { Footer } from "@/components/staticComponents/footer";
import PersonalDetailForm from "@/components/PolicyPurchase/CustomerInformation/personalDetails";
import { useAuth } from "@/utils/useAuth";

export default function HomePage() {
    const { isAuthenticated, isLoading } = useAuth(true);

    // Show a loading indicator while we're checking auth
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-[#0F1D3F] to-[#3E99E7]">
                <div className="bg-white p-8 rounded-lg shadow-xl">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                        <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    // If not authenticated after loading completes, return null 
    // (the useAuth hook will handle redirection)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar for Large Screens */}
            <div className="hidden lg:flex">
                <Sidebar />
            </div>

            {/* Main Page Content */}
            <div className="flex-1 flex flex-col">
                {/* Fixed Header */}
                <div className="sticky top-0 w-full z-50">
                    <Header />
                </div>

                {/* Sidebar as a Card (Only for Small & Medium Screens) */}
                <div className="lg:hidden flex justify-center mt-6">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <main className="flex-1 mt-6">
                    <div className="max-w-6xl mx-auto px-4">
                        <PersonalDetailForm />
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}
