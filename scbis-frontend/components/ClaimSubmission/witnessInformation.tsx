'use client';

import { useRouter } from 'next/navigation';
import { useWitnessInformationStore } from '@/store/claimSubmission/witness-information';

export default function WitnessInformation() {
  const router = useRouter();
  const {
    aloneInVehicle,
    vehicleOccupants,
    independentWitnessPresent,
    independentWitnesses,
    whyNoWitness,
    setAloneInVehicle,
    addVehicleOccupant,
    updateVehicleOccupant,
    removeVehicleOccupant,
    setindependentWitnessPresent,
    addIndependentWitness,
    updateIndependentWitness,
    removeIndependentWitness,
    setwhyNoWitness,
    // clearAllData
  } = useWitnessInformationStore();

  const handlePrevious = () => router.push('/claim-submission/liability-information');
  const handleNext = () => router.push('/claim-submission/damage-details');

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      <div className="w-full flex justify-between items-center mt-2 mb-10">
        <h2 className="md:text-xl sm:text-lg font-bold">Claim Submission</h2>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-wrap sm:justify-start md:justify-start items-center gap-4 mt-6 mb-4">
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full">1</div>
          <span className="ml-2 font-medium text-black text-xs sm:text-base">Driver&rsquo;s Details</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center text-white bg-green-500 rounded-full">2</div>
          <span className="ml-2 text-black text-xs sm:text-base">Accident Details</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full">3</div>
          <span className="ml-2 text-black text-sm sm:text-base">Liability & Insurance Information</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-[#1F4878] text-white rounded-full">4</div>
          <span className="ml-2 text-black text-sm sm:text-base">Witness Information</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="font-semibold">Were you alone in your vehicle during the accident</p>
        <div className="flex gap-4">
          {['Yes I was', "No I wasn't alone"].map((option, idx) => {
            const radioId = `aloneInVehicle-${idx}`;
            return (
              <label key={option} htmlFor={radioId} className="flex items-center">
                <input
                  id={radioId}
                  type="radio"
                  name="aloneInVehicle"
                  value={option}
                  onChange={() => setAloneInVehicle(option)}
                  checked={aloneInVehicle === option}
                  className="mr-2"
                />
                {option}
              </label>
            );
          })}
        </div>

        {aloneInVehicle === "No I wasn't alone" && (
          <div className="mt-4">
            <p className="font-semibold">Give name and addresses of persons in your vehicle</p>
            {vehicleOccupants.map((occupant, index) => (
              <div
                key={index}
                className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4 mt-2 items-end"
              >
                <div className="relative w-full">
                  <label
                    htmlFor={`vehicleOccupant-name-${index}`}
                    className="absolute left-4 -top-2 text-black bg-white text-sm px-1"
                  >
                    Full Name
                  </label>
                  <input
                    id={`vehicleOccupant-name-${index}`}
                    type="text"
                    value={occupant.name}
                    onChange={(e) => updateVehicleOccupant(index, 'name', e.target.value)}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="relative w-full">
                  <label
                    htmlFor={`vehicleOccupant-contact-${index}`}
                    className="absolute left-4 -top-2 text-black bg-white text-sm px-1"
                  >
                    Address/Phone Number
                  </label>
                  <input
                    id={`vehicleOccupant-contact-${index}`}
                    type="text"
                    value={occupant.contact}
                    onChange={(e) => updateVehicleOccupant(index, 'contact', e.target.value)}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="flex gap-2">
                  {index === vehicleOccupants.length - 1 && (
                    <button
                      type="button"
                      className="bg-white text-blue-500 border p-2 rounded-full w-12 h-12 flex items-center justify-center"
                      onClick={addVehicleOccupant}
                    >
                      <span className="text-4xl">+</span>
                    </button>
                  )}
                  {index > 0 && (
                    <button
                      type="button"
                      className="bg-white text-red-500 border p-2 rounded-full w-12 h-12 flex items-center justify-center"
                      onClick={() => removeVehicleOccupant(index)}
                    >
                      <span className="text-4xl">-</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Independent Witnesses */}
      <div className="mt-6">
        <p className="font-semibold">Were there any independent witnesses?</p>
        <div className="flex flex-wrap gap-4">
          {['Yes', "Yes. I dont have their names", 'No, there were no witnesses'].map((option, idx) => {
            const radioId = `independentWitnessPresent-${idx}`;
            return (
              <label key={option} htmlFor={radioId} className="flex items-center">
                <input
                  id={radioId}
                  type="radio"
                  name="independentWitnessPresent"
                  value={option}
                  onChange={() => setindependentWitnessPresent(option)}
                  checked={independentWitnessPresent === option}
                  className="mr-2"
                />
                {option}
              </label>
            );
          })}
        </div>

        {independentWitnessPresent === 'Yes' && (
          <div className="mt-4">
            <p className="font-semibold">Give name and addresses of witnesses.</p>
            {independentWitnesses.map((witness, index) => (
              <div
                key={index}
                className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4 mt-2 items-end"
              >
                <div className="relative w-full">
                  <label
                    htmlFor={`independentWitness-name-${index}`}
                    className="absolute left-4 -top-2 text-black bg-white text-sm px-1"
                  >
                    Full Name
                  </label>
                  <input
                    id={`independentWitness-name-${index}`}
                    type="text"
                    value={witness.name}
                    onChange={(e) => updateIndependentWitness(index, 'name', e.target.value)}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="relative w-full">
                  <label
                    htmlFor={`independentWitness-contact-${index}`}
                    className="absolute left-4 -top-2 text-black bg-white text-sm px-1"
                  >
                    Address/Phone Number
                  </label>
                  <input
                    id={`independentWitness-contact-${index}`}
                    type="text"
                    value={witness.contact}
                    onChange={(e) => updateIndependentWitness(index, 'contact', e.target.value)}
                    className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="flex gap-2">
                  {index === independentWitnesses.length - 1 && (
                    <button
                      type="button"
                      className="bg-white text-blue-500 border p-2 rounded-full w-12 h-12 flex items-center justify-center"
                      onClick={addIndependentWitness}
                    >
                      <span className="text-4xl">+</span>
                    </button>
                  )}
                  {index > 0 && (
                    <button
                      type="button"
                      className="bg-white text-red-500 border p-2 rounded-full w-12 h-12 flex items-center justify-center"
                      onClick={() => removeIndependentWitness(index)}
                    >
                      <span className="text-4xl">-</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {independentWitnessPresent === 'Yes. I dont have their names' && (
          <div className="mt-4">
            <p className="font-semibold">If No, why?</p>
            <textarea
              id="whyNoWitness"
              placeholder="Reason"
              value={whyNoWitness}
              onChange={(e) => setwhyNoWitness(e.target.value)}
              className="md:w-1/2 w-full p-2 border rounded"
              rows={3}
            />
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