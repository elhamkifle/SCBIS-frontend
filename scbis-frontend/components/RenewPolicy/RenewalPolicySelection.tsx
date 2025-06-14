'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRenewalPoliciesStore } from '@/store/renewalStore/useRenewalPolicyStore';
import { useRouter } from 'next/navigation';

export default function RenewalPolicySelectionPage() {
  const router = useRouter();
  const { policies, setPolicies } = useRenewalPoliciesStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axios.get('/api/policies'); // replace with your actual endpoint
        const filtered = res.data.filter(
          (policy: any) => policy.status === 'Active' || policy.status === 'Expired'
        );
        setPolicies(filtered);
      } catch (error) {
        console.error('Failed to fetch policies', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [setPolicies]);

  const handleSelect = (policyId: string) => {
    router.push(`/policy-renewal/${policyId}/duration`);
  };

  if (loading) return <p>Loading...</p>;

  if (policies.length === 0) return <p>No renewable policies found.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Renew Your Policy</h1>
      {policies.map((policy) => (
        <div
          key={policy._id}
          className="p-4 border rounded-md shadow-sm hover:bg-gray-50 cursor-pointer"
          onClick={() => handleSelect(policy._id)}
        >
          <p><strong>Policy ID:</strong> {policy.policyId}</p>
          <p><strong>Status:</strong> {policy.status}</p>
          <p><strong>Type:</strong> {policy.policyType}</p>
          <p><strong>Issued on:</strong> {new Date(policy.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
