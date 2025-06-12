'use client';

import { useRouter } from 'next/navigation';
import { useDamageDetailsStore } from '@/store/claimSubmission/damage-details';
import { useState } from 'react';
import axios from 'axios';

export default function DamageDetails() {
  const router = useRouter();
  const {
    vehicleDamageFiles,
    thirdPartyDamageFiles,
    vehicleDamageFiles,
    thirdPartyDamageFiles,
    vehicleDamageDesc,
    thirdPartyDamageDesc,
    injuriesAny,
    injuredPersons,
    error,
    setvehicleDamageDesc,
    setthirdPartyDamageDesc,
    setinjuriesAny,
    setInjuredPersons,
    addVehicleDamageFile,
    addThirdPartyDamageFile,
    setError,
  } = useDamageDetailsStore();

  const [vehicleFile, setVehicleFile] = useState<File | null>(null);
  const [thirdPartyFile, setThirdPartyFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('upload_preset', 'docuploads');

    try {
      const result = await axios.post(`https://api.cloudinary.com/v1_1/dmzvqehan/upload`, formdata);
      if (result.status === 200) {
        return result.data.secure_url;
      }
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw err; // Rethrow to handle in the calling function
    }
    return null;
  };

  const handleNext = async () => {
    if (!vehicleDamageDesc && !thirdPartyDamageDesc && !injuriesAny) {
      setError('Please fill at least one damage detail');
      return;
    }

    if (!vehicleFile && !vehicleDamageDesc.trim()) {
      return setError('❌ Please upload a photo or provide a description of the damage to your vehicle.');
    }

    if (!thirdPartyFile && !thirdPartyDamageDesc.trim()) {
      return setError('❌ Please upload a photo or provide a description of the third-party damage.');
    }

    if (injuriesAny && (!injuredPersons.name.trim() || !injuredPersons.address.trim())) {
      return setError('❌ Please provide name and address of the injured person.');
    }

    setError('');
    setLoading(true);

    // Upload vehicle files
    for (const file of vehicleFiles) {
      const url = await uploadToCloudinary(file);
      if (url) {
        addVehicleDamageFile(url);
        console.log(url)
        console.log("VehicleDamageFiles: " +vehicleDamageFiles)
      }
    }

    // Upload third-party files
    for (const file of thirdPartyFiles) {
      const url = await uploadToCloudinary(file);
      if (url) {
        addThirdPartyDamageFile(url);
        console.log(thirdPartyDamageFiles)
      }
    }

      router.push('/claim-submission/declaration');
    } catch (err) {
      setError('Failed to upload files. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    router.push('/claim-submission/witness-information');
  };

  const renderDropArea = (
    file: File | null,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    inputId: string,
    label: string
  ) => (
    <div
      className="md:w-1/2 w-full flex flex-col items-center justify-center bg-blue-100 p-6 py-14 rounded-lg"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
      }}
    >
      <p className='text-xl font-bold mb-2'>{label}</p>
      <p className='text-md font-bold mb-4'>Or</p>
      <input
        type="file"
        id={inputId}
        accept=".pdf,.jpg,.png"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) setFile(selectedFile);
        }}
        className="hidden"
      />
      <label htmlFor={inputId} className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600">
        Browse Files
      </label>
      {file && (
        <div className="mt-2 text-green-500 text-sm">
          ✅ File ready for upload: {file.name}
          <button
            onClick={() => setFile(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      )}
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
        <label className="font-semibold block mb-2">Details of damage to your vehicle (A Photo Or A Brief description)</label>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
          {renderDropArea(vehicleFile, setVehicleFile, 'vehicleUpload', 'Drop Vehicle Damage File Here')}
          <div className="w-full lg:w-1/2">
            <label className="font-semibold block mb-2">Details of damage to your vehicle</label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2"
              value={vehicleDamageDesc}
              onChange={(e) => setvehicleDamageDesc(e.target.value)}
              placeholder="Enter description or it will be auto-filled with image URL"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="font-semibold block mb-2">Details of damage to Third Party&rsquo;s property & Vehicle </label>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
          {renderDropArea(thirdPartyFile, setThirdPartyFile, 'thirdPartyUpload', 'Drop Third Party Damage File Here')}
          <div className="w-full lg:w-1/2">
            <label className="font-semibold block mb-2">Details of damage to Third Party&rsquo;s property & Vehicle</label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2"
              value={thirdPartyDamageDesc}
              onChange={(e) => setthirdPartyDamageDesc(e.target.value)}
              placeholder="Enter description or it will be auto-filled with image URL"
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
                <label htmlFor='injuredPersonName' className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Name of the Person</label>
                <input
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={injuredPersons.name} id='injuredPersonName'
                  onChange={(e) => setInjuredPersons({ ...injuredPersons, name: e.target.value })}
                />
              </div>
              <div className="relative w-full">
                <label htmlFor='injuredPersonAddress' className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Address of the Person</label>
                <input
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={injuredPersons.address} id='injuredPersonAddress'
                  onChange={(e) => setInjuredPersons({ ...injuredPersons, address: e.target.value })}
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
          disabled={loading}
          className="bg-[#3AA4FF] text-white p-7 py-2 rounded"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 text-white p-10 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleNext}
        >
          {loading ? 'Uploading...' : 'Next'}
        </button>
      </div>
    </div>
  );
}