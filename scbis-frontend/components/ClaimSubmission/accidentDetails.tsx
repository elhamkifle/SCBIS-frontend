'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AccidentDetails() {

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');

  const [otherVehicles, setOtherVehicles] = useState<{ driverName: string; driverAddress: string; driverPhone: string; }[]>([{ driverName: '', driverAddress: '', driverPhone: '' }]);
  const [position, setPosition] = useState<string>('');
  const [roadSurface, setRoadSurface] = useState<string>('');
  const [trafficCondition, setTrafficCondition] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [timeOfDay, setTimeOfDay] = useState<string>('');
  const [headlightsOn, setHeadlightsOn] = useState<string>('');
  const [visibilityObstructions, setVisibilityObstructions] = useState<string>('');
  const [accidentLocation, setAccidentLocation] = useState<string>('');

  const addVehicleFields = () => {
    setOtherVehicles([...otherVehicles, { driverName: '', driverAddress: '', driverPhone: '' }]);
  };

  const removeVehicleFields = (index: number) => {
    const updatedVehicles = otherVehicles.filter((_, i) => i !== index);
    setOtherVehicles(updatedVehicles);
  };

  const handleVehicleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedVehicles = [...otherVehicles];
    updatedVehicles[index] = { ...updatedVehicles[index], [name]: value };
    setOtherVehicles(updatedVehicles);
  };

  const validateFile = (file: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
        return '❌ Invalid file type. Please upload a valid National ID or Passport in PDF, JPG, or PNG format.';
    } else if (file.size > maxSize) {
        return '❌ File too large. The maximum file size allowed is 5MB.';
    }
    return '';
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        const validationError = validateFile(selectedFile);
        if (validationError) {
            setError(validationError);
        } else {
            setError('');
            setFiles((prev) => [...prev, selectedFile].slice(0, 1)); // Allow only one file
        }
    }
};

const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
        const validationError = validateFile(droppedFile);
        if (validationError) {
            setError(validationError);
        } else {
            setError('');
            setFiles((prev) => [...prev, droppedFile].slice(0, 1)); // Allow only one file
        }
    }
};

  const router = useRouter();

  const handlePrevious = () => router.push('/claim-submission/driver-details');
    
  const handleNext = () => {
      if (files.length < 1) {
          setError('❌ Please upload an ID before proceeding.');
      } else {
          setError('');
          router.push('/claim-submission/liability-information');
      }
  };

  const handleDeleteFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError('');
};

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
            <div className="w-full flex justify-between items-center mt-2 mb-10">
        <h2 className="md:text-xl sm:text-lg font-bold">Claim Submission </h2>
        <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">Save as draft</button>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-wrap sm:justify-start md:justify-start items-center gap-4 mt-6 mb-4">
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full">1</div>
          <span className="ml-2 font-medium text-black text-xs sm:text-base">Driver's Details </span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center text-white bg-[#1F4878] rounded-full">2</div>
          <span className="ml-2 text-black text-xs sm:text-base">Accident Details </span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">3</div>
          <span className="ml-2 text-black text-sm sm:text-base">Liability & Insurance Information</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">4</div>
          <span className="ml-2 text-black text-sm sm:text-base">Witness Information</span>
        </div>
      </div>
      
      {/* Position of Vehicle on Road */}
      <div className="mt-8">
        <h3 className="font-semibold">Position of Vehicle on Road (Relative to Road Edge)</h3>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['Left Side of Lane', 'Center of Lane', 'Right of Lane', 'Accident Was Not on a Road'].map((pos) => (
            <label key={pos} className="flex items-center">
              <input type="radio" name="position" value={pos} onChange={() => setPosition(pos)} checked={position === pos} className="mr-2" />
              {pos}
            </label>
          ))}
        </div>
      </div>
      
      {/* Other Vehicle Details */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Give names and addresses of Owner and Driver of other vehicle(s) involved</h3>
        {otherVehicles.map((vehicle, index) => (
          <div key={index} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative w-full">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Driver’s Name</label>
                <input type="text" name="driverName" value={vehicle.driverName} onChange={(e) => handleVehicleChange(index, e)} className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              </div>
              <div className="relative w-full">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Home/Work Address</label>
                <input type="text" name="driverAddress" value={vehicle.driverAddress} onChange={(e) => handleVehicleChange(index, e)} className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              </div>
              <div className="relative w-full">
                <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Phone Number</label>
                <input type="text" name="driverPhone" value={vehicle.driverPhone} onChange={(e) => handleVehicleChange(index, e)} className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />
              </div>
              <div className="flex items-end gap-2">
                {index === otherVehicles.length - 1 && (
                  <button type="button" className="bg-white text-blue-500 border p-2 rounded-full w-12 h-12 flex items-center justify-center" onClick={addVehicleFields}>
                    <span className="text-4xl">+</span>
                  </button>
                )}
                {index > 0 && (
                  <button type="button" className="bg-white text-red-500 border p-2 rounded-full w-12 h-12 flex items-center justify-center" onClick={() => removeVehicleFields(index)}>
                    <span className="text-4xl">-</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Description of the accident */}
      <div className="mt-6">
        <h3 className="font-semibold text-blue-600">Description of the accident including conditions of road, and visibility</h3>
      </div>

       {/* Type of road surface */}
       <div className="mt-4">
        <h3 className="font-semibold">What type of road surface was it?</h3>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['Asphalt', 'Cobble Stone', 'Concrete', 'Other'].map((surface) => (
            <label key={surface} className="flex items-center">
              <input type="radio" name="roadSurface" value={surface} onChange={() => setRoadSurface(surface)} checked={roadSurface === surface} className="mr-2" />
              {surface}
            </label>
          ))}
        </div>
      </div>
      
      {/* Traffic Condition */}
      <div className="mt-4">
        <h3 className="font-semibold">Was the road crowded?</h3>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['Not Crowded', 'Light Traffic', 'Moderate Traffic', 'Heavy Traffic'].map((traffic) => (
            <label key={traffic} className="flex items-center">
              <input type="radio" name="trafficCondition" value={traffic} onChange={() => setTrafficCondition(traffic)} checked={trafficCondition === traffic} className="mr-2" />
              {traffic}
            </label>
          ))}
        </div>
      </div>

      {/* Time of Day */}
      <div className="mt-4">
        <h3 className="font-semibold">What was the time of day?</h3>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['Day Time', 'Night Time'].map((time) => (
            <label key={time} className="flex items-center">
              <input type="radio" name="timeOfDay" value={time} onChange={() => setTimeOfDay(time)} checked={timeOfDay === time} className="mr-2" />
              {time}
            </label>
          ))}
        </div>
      </div>

      {/* Headlights On - Conditional Display */}
      {timeOfDay === 'Night Time' && (
        <div className="mt-4">
          <h3 className="font-semibold">If so, please state, Were your vehicle's headlights on?</h3>
          <div className="flex flex-wrap lg:flex-nowrap gap-4">
            {['Yes', 'No'].map((option) => (
              <label key={option} className="flex items-center">
                <input type="radio" name="headlightsOn" value={option} onChange={() => setHeadlightsOn(option)} checked={headlightsOn === option} className="mr-2" />
                {option}
              </label>
            ))}
          </div>
        </div>
      )}

       {/* Visibility Obstructions */}
       <div className="mt-4">
        <h3 className="font-semibold">Were there any obstructions to visibility?</h3>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['No', 'Light Rain', 'Heavy Rain', 'Fog'].map((obstruction) => (
            <label key={obstruction} className="flex items-center">
              <input type="radio" name="visibilityObstructions" value={obstruction} onChange={() => setVisibilityObstructions(obstruction)} checked={visibilityObstructions === obstruction} className="mr-2" />
              {obstruction}
            </label>
          ))}
        </div>
      </div>

      {/* Accident Location */}
      <div className="mt-4">
        <h3 className="font-semibold">Did the accident occur at</h3>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['An Intersection', 'A Round About', 'Neither'].map((location) => (
            <label key={location} className="flex items-center">
              <input type="radio" name="accidentLocation" value={location} onChange={() => setAccidentLocation(location)} checked={accidentLocation === location} className="mr-2" />
              {location}
            </label>
          ))}
        </div>
      </div>

      {/* Description of the accident */}
      <div className="mt-6">
        <h3 className="font-semibold">Please provide any additional detailed description of how the accident occurred</h3>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="md:w-1/2 w-full p-2 border rounded mt-2" rows={3} placeholder="Enter details here..."></textarea>
      </div>

      <div className='mt-6'> 
      <h3 className="text-lg font-semibold mb-4">Upload the Sketch of accident ( a photo or a simple sketch) </h3>  

      <div className=" md:w-1/2 flex flex-col items-center justify-center bg-blue-100 p-6 py-14 rounded-lg"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}>
            <p className='text-xl font-bold mb-2'>Drop Files Here</p>
            <p className='text-md font-bold mb-4'>Or</p>
           <input type="file" id="file-upload" accept=".pdf,.jpg,.png" onChange={handleFileChange} className="hidden" />
            <label htmlFor="file-upload" className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600">Browse Files</label>
              {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
              {files.map((file, index) => (
                <div key={index} className="mt-2 text-green-500 text-sm">
                    ✅ File ready for upload: {file.name}
                 <button onClick={() => handleDeleteFile(index)} className="ml-2 text-red-500 hover:text-red-700">Delete</button>
              </div>
            ))}
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
          className="bg-blue-500 text-white p-10 py-2 rounded"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
