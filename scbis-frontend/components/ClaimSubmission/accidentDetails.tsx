'use client';

import { useState } from 'react';

export default function AccidentDetails() {
  const [otherVehicles, setOtherVehicles] = useState([{ driverName: '', driverAddress: '', driverPhone: '' }]);

  const addVehicleFields = () => {
    setOtherVehicles([...otherVehicles, { driverName: '', driverAddress: '', driverPhone: '' }]);
  };

  const removeVehicleFields = (index: number) => {
    const updatedVehicles = otherVehicles.filter((_, i) => i !== index);
    setOtherVehicles(updatedVehicles);
  };

  const handleVehicleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedVehicles = [...otherVehicles];
    updatedVehicles[index] = { ...updatedVehicles[index], [e.target.name]: e.target.value };
    setOtherVehicles(updatedVehicles);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      {/* Progress Bar, Title, and Save as Draft Button */}
      <div className="w-full flex justify-between items-center mt-2 mb-10">
        <h2 className="md:text-xl sm:text-lg font-bold">Claim Submission </h2>
        <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">Save as draft</button>
      </div>

      <div className="flex flex-wrap sm:justify-start md:justify-start items-center gap-4 mt-6 mb-4">
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full">1</div>
          <span className="ml-2 text-black text-xs sm:text-base">Driver's Details </span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-[#1F4878] text-white rounded-full">2</div>
          <span className="ml-2 font-medium text-black text-xs sm:text-base">Accident Details </span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center text-white bg-gray-300 rounded-full">3</div>
          <span className="ml-2 text-black text-xs sm:text-base">Liability & Insurance Information</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">4</div>
          <span className="ml-2 text-black text-sm sm:text-base">Witness Information</span>
        </div>
      </div>

      <div className="mt-6 p-4">
        {/* Other Vehicle Details */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Give names and addresses of Owner and Driver of other vehicle(s) involved</h3>
          {otherVehicles.map((vehicle, index) => (
            <div key={index} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative w-full">
                  <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Driver’s Name</label>
                  <input
                    type="text"
                    name="driverName"
                    value={vehicle.driverName}
                    onChange={(e) => handleVehicleChange(index, e)}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="relative w-full">
                  <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Home/Work Address</label>
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
                  <label className="absolute left-4 -top-2 text-black text-sm bg-white px-1">Phone Number</label>
                  <input
                    type="text"
                    name="driverPhone"
                    value={vehicle.driverPhone}
                    onChange={(e) => handleVehicleChange(index, e)}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                {/* + and - Buttons */}
                <div className="flex items-end gap-2">
                  {index === otherVehicles.length - 1 && (
                    <button
                      type="button"
                      className="bg-white text-blue-500 border p-2 rounded-full w-12 h-12 flex items-center justify-center"
                      onClick={addVehicleFields}
                    >
                      <span className="text-4xl">+</span>
                    </button>
                  )}

                  {index > 0 && (
                    <button
                      type="button"
                      className="bg-white text-red-500 border p-2 rounded-full w-12 h-12 flex items-center justify-center"
                      onClick={() => removeVehicleFields(index)}
                    >
                      <span className="text-4xl">-</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Next Button */}
        <div className="mt-4 text-right">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}