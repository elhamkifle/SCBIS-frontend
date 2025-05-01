'use client';

import { useRouter } from 'next/navigation';
import { useDeclarationStore } from '@/store/claimSubmission/declaration';
import { useState } from 'react';

export default function Declaration() {
  const router = useRouter();
  const {
    driverName,
    insuredName,
    date,
    agreed,
    setDriverName,
    setInsuredName,
    setDate,
    setAgreed,
    clearAllData
  } = useDeclarationStore();

  const [error, setError] = useState('');

  const handlePrevious = () => router.push('/claim-submission/damage-details');
  
  const handleNext = () => {
    if (!driverName.trim()) {
      setError('Please enter driver\'s full name');
      return;
    }
    if (!insuredName.trim()) {
      setError('Please enter insured\'s full name');
      return;
    }
    if (!date) {
      setError('Please select a date');
      return;
    }
    if (!agreed) {
      setError('You must agree to continue');
      return;
    }
    
    setError('');
    router.push('/claim-submission/preview');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      <div className="w-full flex justify-between items-center mt-2 mb-10">
        <h2 className="md:text-xl sm:text-lg font-bold">Claim Submission</h2>
        <div className="flex gap-2">
          <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">
            Save as draft
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Declaration</h2>
        
        <div className="bg-white p-6">
          <p className="mb-6">
            I/We declare the foregoing particulars to be true and correct in every respect, 
            and undertake to render the Company every assistance in my/our power in dealing with the matter.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium  mb-1">Driver's Full Name</label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => {
                  setDriverName(e.target.value);
                  setError('');
                }}
                className="w-full p-2 border-b border-black focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-1">Insured's Full Name</label>
              <input
                type="text"
                value={insuredName}
                onChange={(e) => {
                  setInsuredName(e.target.value);
                  setError('');
                }}
                className="w-full p-2 border-b border-black focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setError('');
                }}
                className="w-full p-2 border-b border-black focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setError('');
              }}
              className="mr-2"
            />
            <label htmlFor="agree" className="text-gray-700">I Agree and Continue</label>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>

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
          className="bg-green-500 text-white p-10 py-2 rounded"
          onClick={handleNext}
        >
          Submit
        </button>
      </div>
    </div>
  );
}