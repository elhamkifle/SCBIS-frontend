'use client';

import { useRouter } from 'next/navigation';
import { useLiabilityInformationStore } from '@/store/claimSubmission/liability-information';

export default function LiabilityInformation() {
  const router = useRouter();
  const {
    responsibleParty,
    otherInsuredStatus,
    insuranceCompanyName,
    policeInvolved,
    officerName,
    policeStation,
    setResponsibleParty,
    setOtherInsuredStatus,
    setInsuranceCompanyName,
    setPoliceInvolved,
    setOfficerName,
    setPoliceStation,
    clearAllData
  } = useLiabilityInformationStore();

  const handlePrevious = () => router.push('/claim-submission/accident-details');
    
  const handleNext = () => {
    router.push('/claim-submission/witness-information');
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

      {/* Progress Bar */}
      <div className="flex flex-wrap sm:justify-start md:justify-start items-center gap-4 mt-6 mb-4">
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full">1</div>
          <span className="ml-2 font-medium text-black text-xs sm:text-base">Driver's Details</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center text-white bg-green-500 rounded-full">2</div>
          <span className="ml-2 text-black text-xs sm:text-base">Accident Details</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-[#1F4878] text-white rounded-full">3</div>
          <span className="ml-2 text-black text-sm sm:text-base">Liability & Insurance Information</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">4</div>
          <span className="ml-2 text-black text-sm sm:text-base">Witness Information</span>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Determine liability and other insurance details</h2>

      {/* Responsible Party */}
      <div className="mt-4">
        <h3 className="font-semibold">Who in your opinion is responsible for the accident?</h3>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['Myself', 'The other person'].map((option) => (
            <label key={option} className="flex items-center">
              <input 
                type="radio" 
                name="responsibleParty" 
                value={option} 
                onChange={() => setResponsibleParty(option)} 
                checked={responsibleParty === option} 
                className="mr-2" 
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Other Vehicle Insured Status */}
      <div className="mt-4">
        <h3 className="font-semibold">Is the other vehicle involved in this accident insured with another company?</h3>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['I dont know', 'Yes , they are'].map((option) => (
            <label key={option} className="flex items-center">
              <input 
                type="radio" 
                name="otherInsuredStatus" 
                value={option} 
                onChange={() => setOtherInsuredStatus(option)} 
                checked={otherInsuredStatus === option} 
                className="mr-2" 
              />
              {option}
            </label>
          ))}
        </div>
        {otherInsuredStatus === 'Yes , they are' && (
          <div>
            <h4 className="font-semibold">If so please state</h4>
            <div className="relative w-full mt-4">
              <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Name of the Insurance Company</label>
              <input
                type="text"
                value={insuranceCompanyName}
                onChange={(e) => setInsuranceCompanyName(e.target.value)}
                className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
              />
            </div>
          </div>
        )}
      </div>

      {/* Police Involvement */}
      <div className="mt-4">
        <h3 className="font-semibold">Were particulars taken by police?</h3>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['Yes', 'No'].map((option) => (
            <label key={option} className="flex items-center">
              <input 
                type="radio" 
                name="policeInvolved" 
                value={option} 
                onChange={() => setPoliceInvolved(option)} 
                checked={policeInvolved === option} 
                className="mr-2" 
              />
              {option}
            </label>
          ))}
        </div>
        {policeInvolved === 'Yes' && (
          <div className="mt-2">
            <h4 className="font-semibold">If so please state</h4>
            <div className="flex flex-col md:flex-row gap-4 mt-2">
              <div className="relative w-full md:w-1/2">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Police Officer's Name</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="relative w-full md:w-1/2">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Police Station</label>
                <input
                  type="text"
                  value={policeStation}
                  onChange={(e) => setPoliceStation(e.target.value)}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        )}
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
          className="bg-blue-500 text-white p-10 py-2 rounded"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}