'use client';

import { useRouter } from 'next/navigation';
import { useDamageDetailsStore } from '@/store/claimSubmission/damage-details';
import { useState } from 'react';

export default function DamageDetails() {
  const router = useRouter();
  const {
    vehicleDamageDesc,
    thirdPartyDamageDesc,
    injuriesAny,
    injuredPersons,
    error,
    setvehicleDamageDesc,
    setthirdPartyDamageDesc,
    setinjuriesAny,
    setInjuredPersons,
    setError,
    clearAllData
  } = useDamageDetailsStore();

  const [vehicleFiles, setVehicleFiles] = useState<File[]>([]);
  const [thirdPartyFiles, setThirdPartyFiles] = useState<File[]>([]);

  const handleNext = () => {
    if (!vehicleFiles.length && !vehicleDamageDesc.trim()) {
      return setError('❌ Please upload a photo or provide a description of the damage to your vehicle.');
    }

    if (!thirdPartyFiles.length && !thirdPartyDamageDesc.trim()) {
      return setError('❌ Please upload a photo or provide a description of the third-party damage.');
    }

    if (injuriesAny && (!injuredPersons.name.trim() || !injuredPersons.address.trim())) {
      return setError('❌ Please provide name and address of the injured person.');
    }

    setError('');
    router.push('/claim-submission/declaration');
  };

  const handlePrevious = () => {
    router.push('/claim-submission/witness-information');
  };

  const renderDropArea = (
    files: File[], 
    setFiles: React.Dispatch<React.SetStateAction<File[]>>, 
    inputId: string
  ) => (
    <div
      className="md:w-1/2 w-full flex flex-col items-center justify-center bg-blue-100 p-6 py-14 rounded-lg"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) setFiles([file]); // Only one file allowed
      }}
    >
      <p className='text-xl font-bold mb-2'>Drop Files Here</p>
      <p className='text-md font-bold mb-4'>Or</p>
      <input 
        type="file" 
        id={inputId} 
        accept=".pdf,.jpg,.png" 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setFiles([file]); // Only one file allowed
        }} 
        className="hidden" 
      />
      <label htmlFor={inputId} className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600">
        Browse Files
      </label>
      {files.map((file, index) => (
        <div key={index} className="mt-2 text-green-500 text-sm">
          ✅ File ready for upload: {file.name}
          <button 
            onClick={() => setFiles([])} 
            className="ml-2 text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="w-full flex justify-between items-center mt-2 mb-10">
        <h2 className="md:text-xl sm:text-lg font-bold">Claim Submission</h2>
        <div className="flex gap-2">
          <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">
            Save as draft
          </button>
        </div>
      </div>

      <div>
        <label className="font-semibold block mb-2">Details of damage to your vehicle (Photos Or Brief description)</label>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
          {renderDropArea(vehicleFiles, setVehicleFiles, 'vehicleUpload')}
          <div className="w-full lg:w-1/2">
            <label className="font-semibold block mb-2">Details of damage to your vehicle</label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2"
              value={vehicleDamageDesc}
              onChange={(e) => setvehicleDamageDesc(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="font-semibold block mb-2">Details of damage to Third Party's property & Vehicle(s)</label>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
          {renderDropArea(thirdPartyFiles, setThirdPartyFiles, 'thirdPartyUpload')}
          <div className="w-full lg:w-1/2">
            <label className="font-semibold block mb-2">Details of damage to Third Party's property & Vehicle</label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2"
              value={thirdPartyDamageDesc}
              onChange={(e) => setthirdPartyDamageDesc(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Were there any injuries resulting from the accident?</label>
        <div className="flex gap-4 mb-2">
          <label className="flex items-center">
            <input 
              type="radio" 
              name="injuriesAny" 
              onChange={() => setinjuriesAny(true)} 
              checked={injuriesAny} 
              className="mr-2" 
            /> 
            Yes
          </label>
          <label className="flex items-center">
            <input 
              type="radio" 
              name="injuriesAny" 
              onChange={() => setinjuriesAny(false)} 
              checked={!injuriesAny} 
              className="mr-2" 
            /> 
            No
          </label>
        </div>
        {injuriesAny && (
          <>
            <label className='font-semibold'>If so, please state</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="relative w-full">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Name of the Person</label>
                <input
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={injuredPersons.name}
                  onChange={(e) => setInjuredPersons({ name: e.target.value })}
                />
              </div>
              <div className="relative w-full">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Address of the Person</label>
                <input
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={injuredPersons.address}
                  onChange={(e) => setInjuredPersons({ address: e.target.value })}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {error && <div className="text-red-500 font-medium">{error}</div>}

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