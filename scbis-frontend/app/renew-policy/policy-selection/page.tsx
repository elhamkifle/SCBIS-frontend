'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
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
    privateVehicle?: {
        generalDetails: {
            plateNumber: string;
        };
    };
    commercialVehicle?: {
        generalDetails: {
            plateNumber: string;
        };
    };
}

export default function RenewPolicySelection() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const policyId = searchParams.get('policyId');

    const [policy, setPolicy] = useState<Policy | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDuration, setSelectedDuration] = useState<number>(30);
    const [driverLicense, setDriverLicense] = useState<File | null>(null);
    const [error, setError] = useState<string>('');

    const getAuthTokenFromCookie = (): string | null => {
        const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : null;
    };

    useEffect(() => {
        const fetchPolicy = async () => {
            if (!policyId) {
                router.push('/renew-policy');
                return;
            }

            try {
                const accessToken = getAuthTokenFromCookie();
                if (!accessToken) {
                    router.push('/login');
                    return;
                }

                console.log('Fetching policy details for ID:', policyId);
                const response = await axios.get(
                    `https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/policy-details/${policyId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                console.log('Policy details response:', response.data);
                setPolicy(response.data);
            } catch (error: any) {
                console.error('Error fetching policy:', error);
                if (error.response?.status === 401) {
                    router.push('/login');
                } else {
                    setError('Failed to fetch policy details');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPolicy();
    }, [policyId, router]);

    const handleDurationChange = (duration: number) => {
        setSelectedDuration(duration);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setDriverLicense(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!policy || !driverLicense) return;

        // Commented out actual API call for testing
        // try {
        //     const accessToken = getAuthTokenFromCookie();
        //     if (!accessToken) {
        //         router.push('/login');
        //         return;
        //     }
        //     const formData = new FormData();
        //     formData.append('policyId', policy.id);
        //     formData.append('duration', selectedDuration.toString());
        //     formData.append('driverLicense', driverLicense);
        //     console.log('Submitting renewal request for policy:', policy.id);
        //     const response = await axios.post(
        //         'https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/renew',
        //         formData,
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${accessToken}`,
        //                 'Content-Type': 'multipart/form-data',
        //             },
        //         }
        //     );
        //     console.log('Renewal response:', response.data);
        //     router.push('/renew-policy/policy-information');
        // } catch (error: any) {
        //     console.error('Error submitting renewal:', error);
        //     if (error.response?.status === 401) {
        //         router.push('/login');
        //     } else {
        //         setError('Failed to submit renewal request');
        //     }
        // }
        router.push('/renew-policy/renewal-request-review');
    };

    // Get plate number with fallback and log policy for debugging
    let plateNumber = 'N/A';
    if (policy) {
        plateNumber = policy.privateVehicle?.generalDetails?.plateNumber ||
            policy.commercialVehicle?.generalDetails?.plateNumber ||
            'N/A';
        console.log('Policy object for debugging:', policy);
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
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
                                {error}
                            </div>
                        ) : !policy ? (
                            <div className="text-center text-gray-600 p-4">
                                Policy not found
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                                {/* Blue title */}
                                <h1 className="text-2xl font-bold mb-6 text-blue-600">Renew Policy</h1>

                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold mb-2">Policy Details</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-600">Policy Type</p>
                                            <p className="font-medium">{policy.policyType}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Plate Number</p>
                                            <p className="font-medium">{plateNumber}</p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Policy Duration
                                        </label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {[30, 90, 180, 365].map((duration) => (
                                                <button
                                                    key={duration}
                                                    type="button"
                                                    onClick={() => handleDurationChange(duration)}
                                                    className={`p-4 rounded-lg border transition-colors duration-150 ${selectedDuration === duration
                                                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                                                        }`}
                                                >
                                                    {duration} days
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload Driver's License
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!driverLicense}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        Submit Renewal Request
                                    </button>
                                </form>
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
