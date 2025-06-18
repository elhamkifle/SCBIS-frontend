'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useClaimPolicyStore } from '@/store/claimSubmission/claim-policy-selection';
import { useUserStore } from '@/store/authStore/useUserStore';

type InsuredInfo = {
  fullName: string;
  email: string;
  // phone: string;
  country?: string;
};

export default function ClaimDisclaimer() {
  const user = useUserStore((state) => state.user);
  const [insuredInfo, setInsuredInfo] = useState<InsuredInfo | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      const insured: InsuredInfo = {
        fullName: user.fullname,
        email: user.email ?? '',
        country: user.country ?? '',
      };

      setInsuredInfo(insured);
    };

    if (user?._id) {
      loadData();
    }
  }, [user?._id]);


  if (!insuredInfo) {
    return <p className="text-center text-gray-500 mt-10">Loading insured information...</p>;
  }

  const { selectedPolicy, policies } = useClaimPolicyStore.getState();
  const selectedPolicyObj = policies.find(p => p._id === selectedPolicy);


  const handlePrevious = () => router.push('/claim-submission/claim-policy-selection');
  const handleNext = () => {
    if (!agreed) {
      setError('You must agree to the disclaimer to proceed.');
      return;
    }
    router.push('/claim-submission/driver-details');
  };

  return (
    <div className="max-w-6xl p-4 mx-auto md:px-12 bg-white">
      <div className="w-full flex justify-between items-center mt-2 mb-10">
        <h2 className="md:text-xl sm:text-lg font-bold">Claim Submission </h2>
        <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">Save as draft</button>
      </div>
      <p className="mt-2">
        Dear Policy Holder:
        Our aim is not only to pay your claims but also to protect and assist you. It is necessary therefore that great care be taken in supplying the information set out below and the statement given need be strictly accurate.
      </p>
      <p className="mt-2 pb-6">
        Please do not make any offer or promise of payment or admit liability in any way, as by so doing you may prejudice your position and make settlement difficult.
      </p>

      <div className={`bg-white px-8 py-4 rounded-2xl shadow-lg flex flex-col justify-around`} style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h3 className="text-lg font-semibold text-blue-600">Personal Information of the Insured</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 border-b border-b-[#3E99E7] py-6">
          <p><strong>Full Name:</strong> {insuredInfo.fullName}</p>
          <p><strong>Email:</strong> {insuredInfo.email}</p>
          <p><strong>City:</strong> {insuredInfo.country}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center">
        <input
          type="checkbox"
          id="agree"
          checked={agreed}
          onChange={() => {
            setAgreed(!agreed);
            setError(''); // Clear error when user checks the box
          }}
          className="mr-2"
        />
        <label htmlFor="agree" className="text-gray-700">I Agree and Continue</label>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Navigation Buttons */}
      <div className="w-full max-w-5xl flex justify-between items-center mt-8">
        <button
          type="button"
          className="bg-[#3AA4FF] text-white p-7 py-2 rounded"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white p-10 py-2 rounded"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}