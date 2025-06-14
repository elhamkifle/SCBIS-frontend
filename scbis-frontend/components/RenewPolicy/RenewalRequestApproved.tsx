'use client';

import { CheckCircle, Car, Calculator } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/staticComponents/sidebar';
import Header from '@/components/staticComponents/header';
import { Footer } from '@/components/staticComponents/footer';

export default function RenewalRequestApproved() {
    const router = useRouter();
    // Placeholder data, replace with real data as needed
    const vehicleType = 'Toyota Corolla 2021';
    const plateNumber = 'Code 2 - A12345';
    const insuranceType = 'Comprehensive Cover';
    const policyDuration = '1 year';
    const premiumAmount = 'ETB 25,000';

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
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <CheckCircle className="text-green-500" size={40} />
                            <div>
                                <h2 className="text-xl font-bold text-green-600">Policy Renewal Request is Approved</h2>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-8">
                            <p className="text-blue-600 font-semibold font-syne">
                                Status: <span className="text-green-500">Approved - Pending Payment</span>
                            </p>
                        </div>
                        {/* Vehicle & Policy Details */}
                        <div className="pb-4 mb-4 px-16">
                            <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold font-syne">
                                <Car size={20} />
                                <h3 className='text-lg'>Vehicle & Policy Details:</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-md">
                                <p><strong>Vehicle Type:</strong> {vehicleType}</p>
                                <p><strong>Plate Number:</strong> {plateNumber}</p>
                                <p><strong>Insurance Type:</strong> {insuranceType}</p>
                                <p><strong>Policy Duration:</strong> {policyDuration}</p>
                            </div>
                        </div>
                        {/* Premium Calculation */}
                        <div className="pb-4 mb-4 px-16">
                            <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold font-syne">
                                <Calculator size={20} />
                                <h3 className='text-lg'>Premium Calculation:</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-md">
                                <p><strong>Premium Amount:</strong> {premiumAmount}</p>
                                <p><strong>Duration:</strong> {policyDuration}</p>
                            </div>
                        </div>
                        {/* Back to Dashboard Button */}
                        <div className="flex justify-center mt-8">
                            <button
                                className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 font-semibold"
                                onClick={() => router.push('/dashboard')}
                            >
                                Back to Dashboard
                            </button>
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