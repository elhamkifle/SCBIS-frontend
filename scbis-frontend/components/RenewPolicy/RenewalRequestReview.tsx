'use client';

import { Car } from 'lucide-react';
import Sidebar from '@/components/staticComponents/sidebar';
import Header from '@/components/staticComponents/header';
import { Footer } from '@/components/staticComponents/footer';

export default function RenewalRequestReview() {
    // Placeholder data, replace with real data as needed
    const vehicleType = 'Toyota Corolla 2021';
    const plateNumber = 'Code 2 - A12345';
    const insuranceType = 'Comprehensive Cover';
    const policyDuration = '1 year';

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
                    <h2 className="text-2xl lg:ml-28 mb-4 font-bold">Policy Renewal</h2>
                    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border mb-8" style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-bold text-[#DBBF1F] mb-4">Policy Renewal Request is Under Review</h2>
                            <p className="text-blue-600 font-semibold mb-4">
                                Status: <span className="text-[#DBBF1F]">Pending Admin Approval</span>
                            </p>
                            <p className="text-blue-600">
                                Estimated Approval Time: <span className="text-black">Typically within 24 hours (work day)</span>
                            </p>
                        </div>
                        {/* Vehicle & Policy Details */}
                        <div className="pb-4 mb:8 md:mb-24 px-16">
                            <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold">
                                <Car size={20} />
                                <h3 className='text-lg'>Submitted Vehicle & Policy Details:</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-md">
                                <p><strong>Vehicle Type:</strong> {vehicleType}</p>
                                <p><strong>Plate Number:</strong> {plateNumber}</p>
                                <p><strong>Selected Insurance:</strong> {insuranceType}</p>
                                <p><strong>Policy Duration:</strong> {policyDuration}</p>
                            </div>
                        </div>
                        {/* Notice */}
                        <p className="text-md mt-8">
                            <span className="font-bold text-blue-700">N.B:</span> Your policy will become active on the day of payment after approval.
                        </p>
                    </div>
                </main>
                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}
