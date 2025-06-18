'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function RenewalDetailsPage() {
    const { id } = useParams();
    const router = useRouter();

    const [policy, setPolicy] = useState<any>(null);
    const [selectedLabel, setSelectedLabel] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const durationOptions: { label: string; value: number }[] = [
        { label: '3 Days', value: 3 },
        { label: '1 Week', value: 7 },
        { label: '15 Days', value: 15 },
        { label: '1 Month', value: 30 },
        { label: '3 Months', value: 90 },
        { label: '6 Months', value: 180 },
        { label: '1 Year (Recommended)', value: 365 },
    ];

    const getAuthTokenFromCookie = (): string | null => {
        const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : null;
    };

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const token = getAuthTokenFromCookie();
                const res = await axios.get(
                    `https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/policy-details/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setPolicy(res.data);
            } catch (err) {
                console.error('Error fetching policy:', err);
                setError('Failed to load policy.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPolicy();
    }, [id]);

    const handleSubmit = async () => {
        const durationObj = durationOptions.find((opt) => opt.label === selectedLabel);
        if (!durationObj) {
            setError('Please select a duration.');
            return;
        }

        const renewalDate = new Date().toISOString();
        const updatedPolicy = {
            duration: durationObj.value,
            isRenewed: true,
            renewalDate,
        }; console.log(updatedPolicy)

        try {
            setSubmitting(true);
            const token = getAuthTokenFromCookie();

            // Step 1: Update policy details (e.g., isRenewed, renewalDate, duration)
            await axios.post(
                `https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/renew-policy/${id}`,
                updatedPolicy,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

              const statusResponse = await axios.put(
                `https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/update-policy-status/${id}`,
                {
                  status: { value: 'pending' },
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

            const updated = statusResponse.data;
            console.log(updated)

            if (updated?.status?.value === 'pending') {
                router.push('/dashboard');
            } else {
                setError('Status update failed. Please try again.');
            }
        } catch (err) {
            console.error('Error during policy renewal:', err);
            setError('Policy update failed. Please try again.');
        } finally {
            setSubmitting(false);
        }


    };

    return (
        <div className="p-6 max-w-3xl mx-auto min-h-screen flex flex-col">
            {/* Top Navigation */}
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => router.back()}
                    className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-semibold text-gray-800">Renew Policy</h1>
                <div></div>
            </div>

            {/* Error */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <svg
                        className="animate-spin h-6 w-6 text-blue-600 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                    <span className="text-gray-600">Loading policy data...</span>
                </div>
            ) : (
                <>
                    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm mb-6">
                        <div className="space-y-2 text-sm text-gray-700">
                            <p>
                                <span className="font-medium">Title:</span> {policy.title}
                            </p>
                            <p>
                                <span className="font-medium">Policy ID:</span> {policy.policyId}
                            </p>
                            <p>
                                <span className="font-medium">Coverage Type:</span> {policy.policyType}
                            </p>
                            <p>
                                <span className="font-medium">Coverage Area:</span> {policy.coverageArea}
                            </p>
                            <p>
                                <span className="font-medium">Current Duration:</span> {policy.duration} days
                            </p>
                            <p>
                                <span className="font-medium">Status:</span>{' '}
                                <span
                                    className={`font-semibold ${policy.status?.value?.toLowerCase() === 'expired'
                                        ? 'text-red-600'
                                        : 'text-yellow-600'
                                        }`}
                                >
                                    {policy.status?.value}
                                </span>
                            </p>
                        </div>
                    </div>

                    <label className="block mb-2 font-medium text-gray-800">Select new duration:</label>
                    <select
                        value={selectedLabel}
                        onChange={(e) => setSelectedLabel(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full mb-4 focus:outline-none focus:ring focus:ring-blue-200"
                    >
                        <option value="" disabled>
                            Select duration
                        </option>
                        {durationOptions.map((opt) => (
                            <option key={opt.value} value={opt.label}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                        >
                            ← Back to Dashboard
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className={`px-6 py-2 rounded text-white transition ${submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {submitting ? 'Submitting...' : 'Submit Renewal'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
