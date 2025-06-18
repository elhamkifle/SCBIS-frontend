'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Policy {
  _id: string;
  policyId: string;
  policyType: string;
  coverageArea: string;
  createdAt: string;
  duration: number;
  title: string;
  status: { value: string };
  expiryDate?: string;
  [key: string]: any;
}

export default function PolicyRenewalSelectionPage() {
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getAuthTokenFromCookie = (): string | null => {
    const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const token = getAuthTokenFromCookie();
        const response = await axios.get(
          'https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/policy/user-policies',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const allPolicies = response.data as Policy[];
        const now = new Date();
        const soon = new Date();
        soon.setDate(now.getDate() + 7);

        const eligible = allPolicies
          .map((policy) => {
            const statusValue = policy.status?.value?.toLowerCase();
            if (statusValue === 'expired') return policy;

            const createdAt = new Date(policy.createdAt);
            const expiry = new Date(createdAt);
            expiry.setDate(expiry.getDate() + (policy.duration || 0));

            const isExpiringSoon = expiry >= now && expiry <= soon;
            if (isExpiringSoon) {
              return { ...policy, expiryDate: expiry.toISOString() };
            }

            return null;
          })
          .filter(Boolean) as Policy[];

        setFilteredPolicies(eligible);
      } catch (err) {
        console.error('Failed to fetch policies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  const handleNext = () => {
    if (!selectedPolicyId) {
      setError('Please select a policy to continue.');
      return;
    }
    router.push(`/renew-policy/policy-renewal/${selectedPolicyId}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Renew Your Policy</h1>

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
          <span className="text-gray-600 text-sm">Loading policies...</span>
        </div>
      ) : filteredPolicies.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600">No policies available for renewal at this time.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {filteredPolicies.map((policy) => {
              const isSelected = selectedPolicyId === policy._id;
              return (
                <div
                  key={policy._id}
                  onClick={() => {
                    setSelectedPolicyId(policy._id);
                    setError('');
                  }}
                  className={`p-5 rounded-xl shadow-sm border transition-all cursor-pointer hover:shadow-md ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-800">{policy.title}</h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        policy.status?.value?.toLowerCase() === 'expired'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {policy.status?.value}
                    </span>
                  </div>

                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-medium text-gray-600">Policy ID:</span>{' '}
                      {policy.policyId}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Coverage Type:</span>{' '}
                      {policy.policyType}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Coverage Area:</span>{' '}
                      {policy.coverageArea}
                    </p>
                    {policy.expiryDate && (
                      <p>
                        <span className="font-medium text-gray-600">Expires:</span>{' '}
                        {new Date(policy.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

          <div className="mt-6 text-right">
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            >
              Continue
            </button>
          </div>
        </>
      )}
    </div>
  );
}
