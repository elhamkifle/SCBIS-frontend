'use client';

import React from 'react';

interface Policy {
    id: string;
    type: string;
    duration: number;
    createdAt: string;
    plateNumber?: string;
}

interface RenewPolicyListProps {
    policies: Policy[];
}

function getDaysLeft(issuedOn: string, duration: number) {
    const issuedDate = new Date(issuedOn);
    const expiryDate = new Date(issuedDate);
    expiryDate.setDate(issuedDate.getDate() + duration);
    const today = new Date();
    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
}

export default function RenewPolicyList({ policies }: RenewPolicyListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => {
                const daysLeft = getDaysLeft(policy.createdAt, policy.duration);
                return (
                    <div key={policy.id} className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">{policy.type}</h2>
                        <p>Duration: {policy.duration} days</p>
                        <p>Issued On: {new Date(policy.createdAt).toLocaleDateString()}</p>
                        <p>Plate Number: {policy.plateNumber || 'N/A'}</p>
                        {daysLeft < 0 ? (
                            <p className="text-red-600 font-bold">Expired</p>
                        ) : daysLeft <= 7 ? (
                            <p className="text-yellow-600 font-semibold">
                                This policy will expire in {daysLeft} day{daysLeft !== 1 ? 's' : ''}.
                            </p>
                        ) : null}
                        <button
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Renew Policy
                        </button>
                    </div>
                );
            })}
        </div>
    );
} 