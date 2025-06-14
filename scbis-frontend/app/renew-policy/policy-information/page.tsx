'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Sidebar from "@/components/staticComponents/sidebar";
import Header from "@/components/staticComponents/header";
import { Footer } from "@/components/staticComponents/footer";
import CommercialVehicleCategory2 from "@/components/PolicyPurchase/VehicleDetails/commercialVehicleCategoray2";
import RenewalPolicySelectionPage from "@/components/RenewPolicy/RenewalPolicySelection";
import RenewalDetailsPage from "@/components/RenewPolicy/DurationAndUpload";

interface RenewalRequest {
    _id: string;
    policyId: string;
    status: string;
    duration: number;
    premiumAmount?: number;
    createdAt: string;
}

export default function PolicyInformation() {
    const router = useRouter();
    const [renewalRequest, setRenewalRequest] = useState<RenewalRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchRenewalRequest = async () => {
            try {
                const accessToken = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/)?.[1];
                const response = await axios.get(
                    'https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/latest-renewal',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setRenewalRequest(response.data);
            } catch (error) {
                console.error('Error fetching renewal request:', error);
                setError('Failed to fetch renewal request details');
            } finally {
                setLoading(false);
            }
        };

        fetchRenewalRequest();
    }, []);

    const handleAcceptPremium = async () => {
        if (!renewalRequest) return;

        try {
            const accessToken = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/)?.[1];
            await axios.post(
                `https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/accept-renewal/${renewalRequest._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            router.push('/payment-form');
        } catch (error) {
            console.error('Error accepting premium:', error);
            setError('Failed to accept premium amount');
        }
    };

    const handleRejectPremium = async () => {
        if (!renewalRequest) return;

        try {
            const accessToken = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/)?.[1];
            await axios.post(
                `https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/reject-renewal/${renewalRequest._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            router.push('/renew-policy');
        } catch (error) {
            console.error('Error rejecting premium:', error);
            setError('Failed to reject premium amount');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    if (!renewalRequest) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">No renewal request found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Renewal Request Status</h1>

            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Request Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Status</p>
                                <p className="font-medium">{renewalRequest.status}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Duration</p>
                                <p className="font-medium">{renewalRequest.duration} days</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Submitted On</p>
                                <p className="font-medium">
                                    {new Date(renewalRequest.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {renewalRequest.status === 'premiumDecided' && renewalRequest.premiumAmount && (
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4">Premium Amount</h3>
                            <p className="text-2xl font-bold text-blue-600 mb-4">
                                {renewalRequest.premiumAmount.toLocaleString()} ETB
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleAcceptPremium}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                                >
                                    Accept & Proceed to Payment
                                </button>
                                <button
                                    onClick={handleRejectPremium}
                                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    )}

                    {renewalRequest.status === 'pending' && (
                        <div className="text-center text-gray-600">
                            Your renewal request is being reviewed. Please wait for the premium amount to be decided.
                        </div>
                    )}

                    {renewalRequest.status === 'approved' && (
                        <div className="text-center text-green-600">
                            Your renewal request has been approved! Your policy has been renewed.
                        </div>
                    )}

                    {renewalRequest.status === 'rejected' && (
                        <div className="text-center text-red-600">
                            Your renewal request has been rejected. Please contact support for more information.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
