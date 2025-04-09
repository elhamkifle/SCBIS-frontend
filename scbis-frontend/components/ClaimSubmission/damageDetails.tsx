'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const validateFile = (file: File) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return '❌ Invalid file type. Please upload a valid file in PDF, JPG, or PNG format.';
  } else if (file.size > maxSize) {
    return '❌ File too large. The maximum file size allowed is 5MB.';
  }
  return '';
};

export default function DamageDetails () {
  const router = useRouter();

  const [vehicleFiles, setVehicleFiles] = useState<File[]>([]);
  const [thirdPartyFiles, setThirdPartyFiles] = useState<File[]>([]);

  const [vehicleDesc, setVehicleDesc] = useState('');
  const [thirdPartyDesc, setThirdPartyDesc] = useState('');

  const [injury, setInjury] = useState(false);
  const [injuredPerson, setInjuredPerson] = useState({ name: '', address: '' });

  const [error, setError] = useState('');

  const handleFileUpload = (
    file: File,
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    setError: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
    } else {
      setError('');
      setFiles([file]); // Only one file allowed
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    setError: React.Dispatch<React.SetStateAction<string>>
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file, setFiles, setError);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    setError: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file, setFiles, setError);
  };

  const handleDeleteFile = (setFiles: React.Dispatch<React.SetStateAction<File[]>>) => {
    setFiles([]);
    setError('');
  };

  const handleNext = () => {
    if (!vehicleFiles.length && !vehicleDesc.trim()) {
      return setError('❌ Please upload a photo or provide a description of the damage to your vehicle.');
    }

    if (!thirdPartyFiles.length && !thirdPartyDesc.trim()) {
      return setError('❌ Please upload a photo or provide a description of the third-party damage.');
    }

    if (injury && (!injuredPerson.name.trim() || !injuredPerson.address.trim())) {
      return setError('❌ Please provide name and address of the injured person.');
    }

    setError('');
    router.push('/claim-submission/declaration');
  };

  const handlePrevious = () => {
    router.push('/claim-submission/witness-information');
  };

  const renderDropArea = (files: File[], setFiles: any, inputId: string, handleFileChange: any, handleDrop: any, handleDeleteFile: any) => (
    <div
      className="md:w-1/2 w-full flex flex-col items-center justify-center bg-blue-100 p-6 py-14 rounded-lg"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, setFiles, setError)}
    >
      <p className='text-xl font-bold mb-2'>Drop Files Here</p>
      <p className='text-md font-bold mb-4'>Or</p>
      <input type="file" id={inputId} accept=".pdf,.jpg,.png" onChange={(e) => handleChange(e, setFiles, setError)} className="hidden" />
      <label htmlFor={inputId} className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600">Browse Files</label>
      {files.map((file, index) => (
        <div key={index} className="mt-2 text-green-500 text-sm">
          ✅ File ready for upload: {file.name}
          <button onClick={() => handleDeleteFile(setFiles)} className="ml-2 text-red-500 hover:text-red-700">Delete</button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
    <div className="w-full flex justify-between items-center mt-2 mb-10">
        <h2 className="md:text-xl sm:text-lg font-bold">Claim Submission </h2>
        <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">Save as draft</button>
      </div>
      <div>
        <label className="font-semibold block mb-2">Details of damage to your vehicle (Photos Or Brief description)</label>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
          {renderDropArea(vehicleFiles, setVehicleFiles, 'vehicleUpload', handleChange, handleDrop, handleDeleteFile)}
          <div className="w-full lg:w-1/2">
            <label className="font-semibold block mb-2">Details of damage to your vehicle</label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2"
              value={vehicleDesc}
              onChange={(e) => setVehicleDesc(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="font-semibold block mb-2">Details of damage to Third Party's property & Vehicle(s)</label>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
          {renderDropArea(thirdPartyFiles, setThirdPartyFiles, 'thirdPartyUpload', handleChange, handleDrop, handleDeleteFile)}
          <div className="w-full lg:w-1/2">
            <label className="font-semibold block mb-2">Details of damage to Third Party's property & Vehicle</label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2"
              value={thirdPartyDesc}
              onChange={(e) => setThirdPartyDesc(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Were there any injuries resulting from the accident?</label>
        <div className="flex gap-4 mb-2">
          <label>
            <input type="radio" name="injury" value="yes" onChange={() => setInjury(true)} checked={injury} /> Yes
          </label>
          <label>
            <input type="radio" name="injury" value="no" onChange={() => setInjury(false)} checked={!injury} /> No
          </label>
        </div>
        {injury && (
          <>
          <label className='font-semibold'> If so, please state </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="relative w-full">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Name of the Person</label>
                <input
                          className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={injuredPerson.name}
                          onChange={(e) => setInjuredPerson({ ...injuredPerson, name: e.target.value })} /> </div>

            <div className="relative w-full">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Address of the Person</label>
                          
                      <input
                          className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={injuredPerson.address}
                          onChange={(e) => setInjuredPerson({ ...injuredPerson, address: e.target.value })} /> </div>
                  </div></> 
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
};
