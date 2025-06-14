'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/staticComponents/sidebar";
import Header from "@/components/staticComponents/header";
import { Footer } from "@/components/staticComponents/footer";

interface Policy {
    _id: string;
    policyType: string;
    duration: number;
    status: {
        value: string;
    };
    createdAt: string;
    vehicleType: string;
    privateVehicle?: {
        generalDetails: {
            plateNumber: string;
            make: string;
            model: string;
            year: string;
        };
    };
    commercialVehicle?: {
        generalDetails: {
            plateNumber: string;
            make: string;
            model: string;
            year: string;
        };
    };
}

function getDaysLeft(issuedOn: string, duration: number) {
    const issuedDate = new Date(issuedOn);
    const expiryDate = new Date(issuedDate);
    expiryDate.setDate(issuedDate.getDate() + duration);
    const today = new Date();
    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function RenewPolicyPage() {
    const router = useRouter();
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    const getAuthTokenFromCookie = (): string | null => {
        const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : null;
    };

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const accessToken = getAuthTokenFromCookie();
                if (!accessToken) {
                    console.log('No auth token found');
                    router.push('/login');
                    return;
                }

                const response = await axios.get(
                    'https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/user-policies',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!response.data || !Array.isArray(response.data)) {
                    throw new Error('Invalid response format');
                }

                setPolicies(response.data);
            } catch (error: any) {
                console.error('Error details:', error);
                if (error.response?.status === 401) {
                    router.push('/login');
                } else {
                    setError(error.message || 'Failed to fetch policies');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPolicies();
    }, [router]);

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
                        <h1 className="text-2xl font-bold mb-6">Renew Your Policy</h1>

                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
                                {error}
                            </div>
                        ) : policies.length === 0 ? (
                            <div className="text-center text-gray-600 p-4">
                                No policies available for renewal
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 justify-items-center">
                                {policies.map((policy) => {
                                    const generalDetails = policy.privateVehicle?.generalDetails || policy.commercialVehicle?.generalDetails;
                                    const formattedDate = new Date(policy.createdAt).toLocaleDateString("en-KE", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    });

                                    const imageUrl = policy.vehicleType === "Private" ? "/Private.png" : "/Commercial.png";
                                    const daysLeft = getDaysLeft(policy.createdAt, policy.duration);
                                    const isAboutToExpire = daysLeft <= 7 && daysLeft >= 0;
                                    const isExpired = daysLeft < 0;

                                    return (
                                        <div key={policy._id} className="bg-white border rounded-xl shadow-lg shadow-blue-100 w-full max-w-[400px] p-8">
                                            <div className="flex justify-between items-center mb-3">
                                                <img src={imageUrl} alt={policy.vehicleType} className="w-6 h-6" />
                                                <span className={`text-xs font-semibold ${isExpired ? 'text-red-500' : isAboutToExpire ? 'text-yellow-500' : 'text-green-500'}`}>
                                                    {isExpired ? 'Expired' : isAboutToExpire ? `About to Expire` : 'Active'}
                                                </span>
                                            </div>
                                            <div className="text-base leading-7">
                                                <p><span className="text-gray-500">Title:</span> <span className="font-bold">{policy.policyType}</span></p>
                                                <p><span className="text-gray-500">Plate No.:</span> <span className="font-bold">{generalDetails?.plateNumber}</span></p>
                                                <p><span className="text-gray-500">Duration:</span> <span className="font-bold">{policy.duration} days</span></p>
                                                <p><span className="text-gray-500">Issued On:</span> <span className="font-bold">{formattedDate}</span></p>
                                                <p><span className="text-gray-500">Vehicle:</span> <span className="font-bold">{generalDetails?.year} {generalDetails?.make} {generalDetails?.model}</span></p>
                                                {isAboutToExpire && !isExpired && (
                                                    <p className="text-yellow-600 font-semibold mt-2">
                                                        This policy will expire in {daysLeft} day{daysLeft !== 1 ? 's' : ''}.
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => router.push(`/renew-policy/policy-selection?policyId=${policy._id}`)}
                                                className="mt-5 w-full text-base text-white bg-blue-600 rounded py-2 hover:bg-blue-700 font-semibold"
                                            >
                                                Renew Policy
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
} 