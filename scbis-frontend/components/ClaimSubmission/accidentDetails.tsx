'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAccidentDetailsStore } from '@/store/claimSubmission/accident-details';
import axios from 'axios';

export default function AccidentDetails() {
  const router = useRouter();
  const {
    otherVehicles,
    positionOnRoad,
    roadSurface,
    trafficCondition,
    additionalDescription,
    timeOfDay,
    dateOfAccident,
    timeOfAccident,
    speed,
    location,
    hornSounded,
    headlightsOn,
    wereYouInVehicle,
    visibilityObstructions,
    intersectionType,
    sketchFiles,
    sketchFiles,
    error,
    addVehicle,
    removeVehicle,
    updateVehicle,
    setpositionOnRoad,
    setRoadSurface,
    setTrafficCondition,
    setadditionalDescription,
    setTimeOfDay,
    setdateOfAccident,
    settimeOfAccident,
    setspeed,
    setlocation,
    sethornSounded,
    setHeadlightsOn,
    setwereYouInVehicle,
    setVisibilityObstructions,
    setintersectionType,
    addSketchFile,
    setError,
    // clearAllData
  } = useAccidentDetailsStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    const setters = {
      dateOfAccident: setdateOfAccident,
      timeOfAccident: settimeOfAccident,
      speed: (val: string) => setspeed(Number(val)), // still takes string, converted to number
    } satisfies Record<string, (val: string) => void>;


    if (name in setters) {
      (setters as Record<string, (val: string) => void>)[name](value);
    }
  };

  // Handler for nested `location` fields
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setlocation({ ...location, [name]: value });
  };


  // Local state for file handling (not persisted in Zustand)
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');

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
        setFileError(validationError);
      } else {
        setFileError('');
        setFiles([selectedFile]); // Only allow one file
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validationError = validateFile(droppedFile);
      if (validationError) {
        setFileError(validationError);
      } else {
        setFileError('');
        setFiles([droppedFile]); // Only allow one file
      }
    }
  };

  const handleVehicleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateVehicle(index, { [name]: value });
  };

  const handlePrevious = () => router.push('/claim-submission/driver-details');

  const handleNext = async () => {
    if (files.length < 1) {
      setFileError('❌ Please upload an ID before proceeding.');
      return;
    }

    // Validate required fields
    if (!positionOnRoad || !roadSurface || !trafficCondition) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setError('');
      setFileError('');

      const uploadedUrls: string[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'docuploads'); // your Cloudinary preset

        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/dmzvqehan/upload',
          formData
        );
        let url = ""

        if (res.status === 200) {
          url = res.data.secure_url
          console.log(url) 
          const { addSketchFile } = useAccidentDetailsStore.getState();
          addSketchFile(url);
          console.log('Saved to Zustand:', useAccidentDetailsStore.getState().sketchFiles);
        } else {
          throw new Error('Upload failed');
        }
      }

      // Save uploaded URLs in Zustand
      const { addSketchFile } = useAccidentDetailsStore.getState();
      uploadedUrls.forEach((url) => addSketchFile(url));
      console.log(sketchFiles)

      router.push('/claim-submission/liability-information');
    } catch (error) {
      console.error('Upload error:', error);
      setFileError('❌ Upload failed. Please try again.');
    }
  }

  const handleDeleteFile = () => {
    setFiles([]);
    setFileError('');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      <div className="w-full flex justify-between items-center mt-2 mb-10">
        <h2 className="md:text-xl sm:text-lg font-bold">Claim Submission</h2>
        <div className="flex gap-2">
          {/* <button 
            className="bg-gray-500 sm:text-xs md:text-lg text-white px-4 py-2 rounded"
            onClick={clearAllData}
          >
            Clear Data
          </button> */}
          <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">
            Save as draft
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-wrap sm:justify-start md:justify-start items-center gap-4 mt-6 mb-4">
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full">1</div>
          <span className="ml-2 font-medium text-black text-xs sm:text-base">Driver&rsquo;s Details</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center text-white bg-[#1F4878] rounded-full">2</div>
          <span className="ml-2 text-black text-xs sm:text-base">Accident Details</span>
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


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative w-full">
          <label htmlFor='dateOfAccident' aria-label='dateOfAccident' className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Date of Accident *</label>
          <input
             id="dateOfAccident"
            type="date"
            name="dateOfAccident"
            value={dateOfAccident}
            onChange={handleChange}
            className="w-full p-2 border border-black rounded"
            required
          />
        </div>

        {/* Time of Accident */}
        <div className="relative w-full">
          <label htmlFor='timeOfAccident' aria-label='time' className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Time of Accident *</label>
          <input
            id='timeOfAccident'
            type="time"
            name="timeOfAccident"
            value={timeOfAccident}
            onChange={handleChange}
            className="w-full p-2 border border-black rounded"
            required
          />
        </div>

        {/* Speed */}
        <div className="relative w-full">
          <label htmlFor='speed' aria-label='speed' className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Speed (km/h) *</label>
          <input
            id='speed'
            type="number"
            name="speed"
            value={speed}
            onChange={handleChange}
            className="w-full p-2 border border-black rounded"
            required
          />
        </div>

      </div>
      <h3 className='mt-8'> Address </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {['city', 'subCity', 'kebele', 'sefer'].map((field) => (
          <div className="relative w-full" key={field}>
            <label aria-label={field} className="absolute left-4 -top-2 text-black text-sm bg-white px-1 capitalize">
              {field} *
            </label>
            <input
              type="text"
              name={field}
              value={location[field as keyof typeof location]}
              onChange={handleLocationChange}
              className="w-full p-2 border border-black rounded"
              required
            />
          </div>
        ))}
      </div>


      {/* Position of Vehicle on Road */}
      <div className="mt-8">
        <p className="font-semibold">Position of Vehicle on Road (Relative to Road Edge)</p>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['Left Side of Lane', 'Center of Lane', 'Right of Lane', 'Accident Was Not on a Road'].map((pos) => (
            <label htmlFor='positionOnRoad' key={pos} className="flex items-center">
              <input
                id='positionOnRoad'
                type="radio"
                name="positionOnRoad"
                value={pos}
                onChange={() => setpositionOnRoad(pos)}
                checked={positionOnRoad === pos}
                className="mr-2"
              />
              {pos}
            </label>
          ))}
        </div>
      </div>

      {/* Other Vehicle Details */}
      <div className="mt-6">
        <p className="text-lg font-semibold">Give names and addresses of Owner and Driver of other vehicle(s) involved</p>
        {otherVehicles.map((vehicle, index) => (
          <div key={index} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative w-full">
                <label htmlFor='driverName' aria-label='driverName' className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Driver&rsquo;s Name</label>
                <input
                  type="text"
                  id='driverName'
                  name="driverName"
                  value={vehicle.driverName}
                  onChange={(e) => handleVehicleChange(index, e)}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="relative w-full">
                <label aria-label='driverAddress' className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Home/Work Address</label>
                <input
                  type="text"
                  name="driverAddress"
                  value={vehicle.driverAddress}
                  onChange={(e) => handleVehicleChange(index, e)}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="relative w-full">
                <label aria-label='driverPhone' className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Phone Number</label>
                <input
                  type="text"
                  name="driverPhone"
                  value={vehicle.driverPhone}
                  onChange={(e) => handleVehicleChange(index, e)}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="flex items-end gap-2">
                {index === otherVehicles.length - 1 && (
                  <button
                    type="button"
                    className="bg-white text-blue-500 border p-2 rounded-full w-12 h-12 flex items-center justify-center"
                    onClick={addVehicle}
                  >
                    <span className="text-4xl">+</span>
                  </button>
                )}
                {index > 0 && (
                  <button
                    type="button"
                    className="bg-white text-red-500 border p-2 rounded-full w-12 h-12 flex items-center justify-center"
                    onClick={() => removeVehicle(index)}
                  >
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
        <p className="font-semibold text-blue-600">Description of the accident including conditions of road, and visibility</p>
      </div>

      {/* Type of road surface */}
      <div className="mt-4">
        <p className="font-semibold">What type of road surface was it?</p>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['Asphalt', 'Cobble Stone', 'Concrete', 'Other'].map((surface) => (
            <label aria-label='roadSurface' key={surface} className="flex items-center">
              <input
                type="radio"
                name="roadSurface"
                value={surface}
                onChange={() => setRoadSurface(surface)}
                checked={roadSurface === surface}
                className="mr-2"
              />
              {surface}
            </label>
          ))}
        </div>
      </div>

      {/* Traffic Condition */}
      <div className="mt-4">
        <p className="font-semibold">Was the road crowded?</p>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['Not Crowded', 'Light Traffic', 'Moderate Traffic', 'Heavy Traffic'].map((traffic) => (
            <label aria-label='trafficCondition' key={traffic} className="flex items-center">
              <input
                type="radio"
                name="trafficCondition"
                value={traffic}
                onChange={() => setTrafficCondition(traffic)}
                checked={trafficCondition === traffic}
                className="mr-2"
              />
              {traffic}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="font-semibold"> Were you in the vehicle?</p>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['Yes', 'No'].map((option) => (
            <label aria-label='wereYouInVehicle' key={option} className="flex items-center">
              <input
                type="radio"
                name="wereYouInVehicle"
                value={option}
                onChange={() => setwereYouInVehicle(option)}
                checked={wereYouInVehicle === option}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Time of Day */}
      <div className="mt-4">
        <p className="font-semibold">What was the time of day?</p>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['Day Time', 'Night Time'].map((time) => (
            <label aria-label='timeOfDay' key={time} className="flex items-center">
              <input
                type="radio"
                name="timeOfDay"
                value={time}
                onChange={() => setTimeOfDay(time)}
                checked={timeOfDay === time}
                className="mr-2"
              />
              {time}
            </label>
          ))}
        </div>
      </div>

      {/* Headlights On - Conditional Display */}
      {timeOfDay === 'Night Time' && (
        <div className="mt-4">
          <p className="font-semibold">If so, please state, Were your vehicle&rsquo;s headlights on?</p>
          <div className="flex flex-wrap lg:flex-nowrap gap-4">
            {['Yes', 'No'].map((option) => (
              <label aria-label='headlightsOn' key={option} className="flex items-center">
                <input
                  type="radio"
                  name="headlightsOn"
                  value={option}
                  onChange={() => setHeadlightsOn(option)}
                  checked={headlightsOn === option}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <p className="font-semibold">Was horn sounded?</p>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['Yes', 'No'].map((option) => (
            <label aria-label='hornSounded' key={option} className="flex items-center">
              <input
                type="radio"
                name="hornSounded"
                value={option}
                onChange={() => sethornSounded(option)}
                checked={hornSounded === option}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Visibility Obstructions */}
      <div className="mt-4">
        <p className="font-semibold">Were there any obstructions to visibility?</p>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['No', 'Light Rain', 'Heavy Rain', 'Fog'].map((obstruction) => (
            <label aria-label='visibilityObstructions' key={obstruction} className="flex items-center">
              <input
                type="radio"
                name="visibilityObstructions"
                value={obstruction}
                onChange={() => setVisibilityObstructions(obstruction)}
                checked={visibilityObstructions === obstruction}
                className="mr-2"
              />
              {obstruction}
            </label>
          ))}
        </div>
      </div>

      {/* Accident Location */}
      <div className="mt-4">
        <p className="font-semibold">Did the accident occur at</p>
        <div className="flex flex-wrap lg:flex-nowrap gap-4">
          {['Intersection', 'A Round About', 'Neither'].map((location) => (
            <label aria-label='intersectionType' key={location} className="flex items-center">
              <input
                type="radio"
                name="intersectionType"
                value={location}
                onChange={() => setintersectionType(location)}
                checked={intersectionType === location}
                className="mr-2"
              />
              {location}
            </label>
          ))}
        </div>
      </div>

      {/* Description of the accident */}
      <div className="mt-6">
        <p className="font-semibold">Please provide any additional detailed description of how the accident occurred</p>
        <textarea
          value={additionalDescription}
          onChange={(e) => setadditionalDescription(e.target.value)}
          className="md:w-1/2 w-full p-2 border rounded mt-2"
          rows={3}
          placeholder="Enter details here..."
        ></textarea>
      </div>

      <div className='mt-6'>
        <p className="text-lg font-semibold mb-4">Upload the Sketch of accident (a photo or a simple sketch)</p>

        <div
          className="md:w-1/2 flex flex-col items-center justify-center bg-blue-100 p-6 py-14 rounded-lg"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <p className='text-xl font-bold mb-2'>Drop Files Here</p>
          <p className='text-md font-bold mb-4'>Or</p>
          <input
            type="file"
            id="file-upload"
            accept=".pdf,.jpg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="file-upload" className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600">
            Browse Files
          </label>
          {fileError && <p className="mt-2 text-red-500 text-sm">{fileError}</p>}
          {files.map((file, index) => (
            <div key={index} className="mt-2 text-green-500 text-sm">
              ✅ File ready for upload: {file.name}
              <button
                onClick={handleDeleteFile}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 text-red-500">{error}</p>}

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
          aria-label="Next Step"
          className="bg-blue-500 text-white p-10 py-2 rounded"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}