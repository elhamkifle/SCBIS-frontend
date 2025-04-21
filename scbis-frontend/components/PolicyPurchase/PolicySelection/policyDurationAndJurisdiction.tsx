"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { policyHook } from "@/context/PolicyContextProvider";

const policyDurations = [
  {duration:"3 Days",numvalue:"3"},
  {duration:"1 Week",numvalue:"7"},
  {duration:"15 Days",numvalue:"15"},
  {duration:"1 Month",numvalue:"30"},
  {duration:"3 Months",numvalue:"90"},
  {duration:"6 Months",numvalue:"180"},
  {duration:"1 Year (Recommended)",numvalue:"365"},
];

const coverageAreas = [
  {
    category: "Domestic Coverage",
    options: ["Ethiopia Only (Valid within Ethiopia’s borders.)"],
  },
  {
    category: "Border Crossing",
    options: [
      "Ethiopia & Moyale (Kenya Border)",
      "Ethiopia & Djibouti",
      "Ethiopia & Metema (Sudan Border)",
      "Ethiopia & Humera (Eritrea Border)",
    ],
  },
];

export default function PolicyDuration() {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null); // Allow string or null
  const [selectedCoverage, setSelectedCoverage] = useState<string | null>(null); // Allow string or null
  const {dispatch} = policyHook()
  const router = useRouter();

  const handlePrevious = () => {
    router.push('/policy-purchase/purchase/policySelection');
  };

  const handleNext = async () => {
    if (!selectedDuration || !selectedCoverage) {
      alert("Please select a policy duration and coverage area.");
      
      return;
    }

    dispatch({type:'collect_policy_info',payload:{duration:selectedDuration,coverageArea:selectedCoverage}})


    router.push('/policy-purchase/purchase/vehicleInformation');
    

    
  };

  return (
    <div className="flex flex-col items-center px-4 mb-6">
      <div className="w-full flex justify-between items-center mt-2">
        <h2 className="md:text-xl sm:text-lg font-bold">Policy Purchase</h2>
        <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">
          Save as draft
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-wrap sm:justify-start md:justify-start items-center gap-4 mt-6 mb-4">
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full">1</div>
          <span className="ml-2 font-medium text-black text-xs sm:text-base">Policy Selection </span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center text-white bg-[#1F4878] rounded-full">2</div>
          <span className="ml-2 text-black text-xs sm:text-base">Duration & Jurisdiction </span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">3</div>
          <span className="ml-2 text-black text-sm sm:text-base">Vehicle Information</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-gray-300 text-white rounded-full">4</div>
          <span className="ml-2 text-black text-sm sm:text-base">Driver Information</span>
        </div>
      </div>

      <div className="w-full max-w-5xl flex justify-between items-center my-5">
        <h2 className="text-xl font-bold">
          Select Your Policy Duration & Coverage Area
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 w-full max-w-5xl">
        {/* Policy Duration */}
        <div
          className="bg-white p-6 rounded-xl shadow-md"
          style={{
            boxShadow:
              "0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3 className="font-semibold text-lg">
            Policy Duration (Choose One)
          </h3>
          <div className="mt-3 space-y-2">
            {policyDurations.map((policyDuration) => (
              <label
                key={policyDuration.duration}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="policyDuration"
                  value={policyDuration.numvalue}
                  checked={selectedDuration === policyDuration.numvalue}
                  onChange={() => setSelectedDuration(policyDuration.numvalue)}
                  className="form-radio text-blue-600"
                />
                <span>{policyDuration.duration}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Coverage Area */}
        <div
          className="bg-white p-6 rounded-xl shadow-md"
          style={{
            boxShadow:
              "0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3 className="font-semibold text-lg">Coverage Area</h3>
          {coverageAreas.map((section) => (
            <div key={section.category} className="mt-3">
              <h4 className="text-blue-600 font-medium">{section.category}</h4>
              <div className="mt-2 space-y-2">
                {section.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="coverageArea"
                      value={option}
                      checked={selectedCoverage === option}
                      onChange={() => setSelectedCoverage(option)}
                      className="form-radio text-blue-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
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