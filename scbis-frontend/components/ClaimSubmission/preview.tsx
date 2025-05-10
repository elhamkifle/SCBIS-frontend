'use client';

import axios from 'axios';

import { useRouter } from 'next/navigation';
import { Edit, Check } from 'lucide-react';
import { useState } from 'react';
import { useVehicleSelectionStore } from '@/store/claimSubmission/vehicle-selection-store';
import { useClaimPolicyStore } from '@/store/claimSubmission/claim-policy-selection';
import { useDriverDetailsStore } from '@/store/claimSubmission/driver-details';
import { useAccidentDetailsStore } from '@/store/claimSubmission/accident-details';
import { useLiabilityInformationStore } from '@/store/claimSubmission/liability-information';
import { useWitnessInformationStore } from '@/store/claimSubmission/witness-information';
import { useDeclarationStore } from '@/store/claimSubmission/declaration';
import { useDamageDetailsStore } from '@/store/claimSubmission/damage-details';

export default function ClaimPreview() {
  const router = useRouter();

  // Get all data from stores and their update functions
  const { selectedVehicle, selectVehicle, vehicles } = useVehicleSelectionStore();
  const { selectedPolicy, policies, selectPolicy } = useClaimPolicyStore();
  const {
    isDriverSameAsInsured,
    formData: driver,
    setDriverSame,
    updateFormData: updateDriverData
  } = useDriverDetailsStore();
  const {
    positionOnRoad,
    roadSurface,
    trafficCondition,
    additionalDescription,
    timeOfDay,
    hornSounded,
    headlightsOn,
    wereYouInVehicle,
    dateOfAccident,
    timeOfAccident,
    speed,
    location,
    visibilityObstructions,
    intersectionType,
    otherVehicles,
    sketchFiles,
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
    addVehicle,
    removeVehicle,
    updateVehicle
  } = useAccidentDetailsStore();
  const {
    responsibleParty,
    otherInsuredStatus,
    OtherInsuranceCompanyName,
    policeInvolved,
    policeOfficerName,
    policeStation,
    setResponsibleParty,
    setOtherInsuredStatus,
    setOtherInsuranceCompanyName,
    setPoliceInvolved,
    setpoliceOfficerName,
    setPoliceStation
  } = useLiabilityInformationStore();
  const {
    aloneInVehicle,
    vehicleOccupants,
    independentWitnessPresent,
    independentWitnesses,
    whyNoWitness,
    setAloneInVehicle,
    addVehicleOccupant,
    removeVehicleOccupant,
    updateVehicleOccupant,
    setindependentWitnessPresent,
    addIndependentWitness,
    removeIndependentWitness,
    updateIndependentWitness,
    setwhyNoWitness
  } = useWitnessInformationStore();
  const {
    driverFullName,
    insuredFullName,
    signatureDate,
    agreedToDeclaration,
    setdriverFullName,
    setinsuredFullName,
    setsignatureDate,
    setagreedToDeclaration
  } = useDeclarationStore();

  const {
    vehicleDamageDesc,
    thirdPartyDamageDesc,
    injuriesAny,
    injuredPersons,
    vehicleDamageFiles,
    thirdPartyDamageFiles,
    error,
    setvehicleDamageDesc,
    setthirdPartyDamageDesc,
    setinjuriesAny,
    setInjuredPersons,
    setError,
    clearAllData
  } = useDamageDetailsStore();

  const [isEditing, setIsEditing] = useState({
    policy: false,
    vehicle: false,
    driver: false,
    accident: false,
    liability: false,
    witness: false,
    damage: false
  });

  const toggleEdit = (section: keyof typeof isEditing) => {
    setIsEditing(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = async () => {
    const claimData = {
      policyId: "67fd5e03c2f1bd131f38a8ab",
      isDriverSameAsInsured,
      driver: {
        ...driver
      },
      accidentDetails: {
        positionOnRoad,
        roadSurface,
        trafficCondition,
        additionalDescription,
        timeOfDay,
        hornSounded: typeof hornSounded === 'string'
          ? hornSounded.toLowerCase() === 'yes'
          : hornSounded === true,
        headlightsOn: typeof headlightsOn === 'string'
          ? headlightsOn.toLowerCase() === 'yes'
          : headlightsOn === true,
        wereYouInVehicle: typeof wereYouInVehicle === 'string'
          ? wereYouInVehicle.toLowerCase() === 'yes'
          : wereYouInVehicle === true,
        visibilityObstructions,
        intersectionType,
        otherVehicles,
        dateOfAccident,
        timeOfAccident,
        speed,
        location,
      },
      liability: {
        responsibleParty,
        otherInsuredStatus,
        OtherInsuranceCompanyName,
        policeInvolved: typeof policeInvolved === 'string'
          ? policeInvolved.toLowerCase() === 'yes'
          : policeInvolved === true,
        policeOfficerName,
        policeStation
      },
      witness: {
        aloneInVehicle: typeof aloneInVehicle === 'string'
          ? aloneInVehicle.toLowerCase() === 'yes'
          : aloneInVehicle === true,
        vehicleOccupants,
        independentWitnessPresent: typeof independentWitnessPresent === 'string' && independentWitnessPresent.toLowerCase().includes('yes'),
        independentWitnesses,
        whyNoWitness
      },
      declaration: {
        driverFullName,
        insuredFullName,
        signatureDate,
        agreedToDeclaration
      },
      damage: {
        sketchFiles,
        vehicleDamageFiles,
        vehicleDamageDesc,
        thirdPartyDamageFiles,
        thirdPartyDamageDesc,
        injuriesAny,
        injuredPersons: [injuredPersons],
      }
    }

    console.log(claimData);

    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2ZkNTRlY2QzZGM1MzIxYTkwOWIyNDYiLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTc0Njg5NDgzMSwiZXhwIjoxNzQ2ODk4NDMxfQ.oAQyZ5boJnsWWvFZm3aSehnD9JFaamufPIaoVmLU0CA"; // Provided accessToken

    try {
      // // Sending the claim data using Axios
      // const response = await axios.post("https://scbis-git-dev-hailes-projects-a12464a1.vercel.app/claims", claimData, {
      //   headers: {
      //     'Authorization': `Bearer ${accessToken}`,
      //     'Content-Type': 'application/json',
      //   }
      // });

      // console.log(response);
  
      // const storesToClear = [
      //   'accident-details-storage',
      //   'claim-policy-selection-storage',
      //   'damage-details-storage',
      //   'declaration-storage',
      //   'claim-disclaimer-storage',
      //   'driver-details-storage',
      //   'liability-information-storage',
      //   'vehicle-selection-storage',
      //   'witness-information-storage'
      // ];
  
      // storesToClear.forEach(storeName => {
      //   localStorage.removeItem(storeName);
      // });
  
      // useAccidentDetailsStore.getState().clearAllData();
      // useClaimPolicyStore.getState().clearAllData();
      // useDriverDetailsStore.getState().clearAllData();
      // useLiabilityInformationStore.getState().clearAllData();
      // useVehicleSelectionStore.getState().clearAllData();
      // useWitnessInformationStore.getState().clearAllData();
      // useDeclarationStore.getState().clearAllData();
  
      alert("Claim submitted successfully!")
  
    } catch (error:any) {
      if (error.response) {
        console.log('Error response:', error.response.data); // Response from the server
      } else if (error.request) {
        console.log('Error request:', error.request); // Request was sent, but no response was received
      } else {
        console.log('Error message:', error.message); // Any other error
      }
    }


  };

  const handlePrevious = () => {
    router.push('/claim-submission/declaration');
  };

  const YesNoDisplay = ({ value }: { value: string | boolean | null }) => {
    if (value === null || value === undefined) {
      return (
        <span className="px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          Not Provided
        </span>
      );
    }

    const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
    const isYes = displayValue === 'Yes' || displayValue === 'yes';
    return (
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${isYes ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
        {isYes ? 'Yes' : 'No'}
      </span>
    );
  };

  const handleDriverDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateDriverData({ [name]: value });
  };

  const handleAccidentVehicleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateVehicle(index, { [name]: value });
  };

  // Fix for select elements by ensuring values are never null
  const safeDriverGrade = driver.grade || '';
  const safeExpirationDate = driver.expirationDate || '';


  return (
    <div className="max-w-5xl mx-auto p-6 bg-white">
      <div className="w-full flex justify-between items-center mt-2 mb-10">
        <h2 className="md:text-xl sm:text-lg font-bold">Claim Submission Preview</h2>
        <div className="flex gap-2">
          <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">
            Save as draft
          </button>
        </div>
      </div>

      {/* Policy Selection Section */}
      <div className="border-b pb-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-blue-600">Selected Policy: <span className='text-black'> {selectedPolicy} </span></h2>
        </div>
      </div>

      {/* Vehicle Selection Section */}
      <div className="border-b pb-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-blue-600">Selected Vehicle: <span className='text-black'> {selectedVehicle} </span></h2>
        </div>
      </div>

      {/* Driver Details Section */}
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-blue-600">Driver Details</h2>
          <button onClick={() => toggleEdit('driver')} className="text-blue-500 hover:text-blue-700">
            {isEditing.driver ? <Check size={20} /> : <Edit size={20} />}
          </button>
        </div>

        {isEditing.driver ? (
          <div className="mt-4 p-4 border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="driverSame"
                    checked={isDriverSameAsInsured === true}
                    onChange={() => setDriverSame(true)}
                    className="mr-2"
                  />
                  Same as insured
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="driverSame"
                    checked={isDriverSameAsInsured === false}
                    onChange={() => setDriverSame(false)}
                    className="mr-2"
                  />
                  Different driver
                </label>
              </div>

              {!isDriverSameAsInsured && (
                <>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={driver.firstName}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={driver.lastName}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <input
                      type="text"
                      name="age"
                      value={driver.age}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={driver.city}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Subcity</label>
                    <input
                      type="text"
                      name="subCity"
                      value={driver.subCity}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Kebele</label>
                    <input
                      type="text"
                      name="kebele"
                      value={driver.kebele}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={driver.phoneNumber}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">License No</label>
                    <input
                      type="text"
                      name="licenseNo"
                      value={driver.licenseNo}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Grade</label>
                    <select
                      name="grade"
                      value={driver.grade}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Expiration Date</label>
                    <input
                      type="date"
                      name="expirationDate"
                      value={driver.expirationDate}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-4">
            <div>
              <strong>Same as insured customer:</strong>
              <YesNoDisplay value={isDriverSameAsInsured} />
            </div>

            {!isDriverSameAsInsured && (
              <>
                <div><strong>First Name:</strong> {driver.firstName}</div>
                <div><strong>Last Name:</strong> {driver.lastName}</div>
                <div><strong>Age:</strong> {driver.age}</div>
                <div><strong>City:</strong> {driver.city}</div>
                <div><strong>Subcity:</strong> {driver.subCity}</div>
                <div><strong>Kebele:</strong> {driver.kebele}</div>
                <div><strong>Phone Number:</strong> {driver.phoneNumber}</div>
                <div><strong>License No:</strong> {driver.licenseNo}</div>
                <div><strong>Grade:</strong> {driver.grade}</div>
                <div><strong>Expiration Date:</strong> {driver.expirationDate}</div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Accident Details Section */}
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-blue-600">4. Accident Details</h2>
          <button onClick={() => toggleEdit('accident')} className="text-blue-500 hover:text-blue-700">
            {isEditing.accident ? <Check size={20} /> : <Edit size={20} />}
          </button>
        </div>

        {isEditing.accident ? (
          <div className="mt-4 p-4 border rounded-lg space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Date of Accident</h3>
                <input
                  type="date"
                  value={dateOfAccident}
                  onChange={(e) => setdateOfAccident(e.target.value)}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">Time of Accident</h3>
                <input
                  type="time"
                  value={timeOfAccident}
                  onChange={(e) => settimeOfAccident(e.target.value)}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">Speed</h3>
                <input
                  type="number"
                  value={speed}
                  onChange={(e) => setspeed(Number(e.target.value))}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold mb-2">City</h3>
                <input
                  type="text"
                  value={location.city || ''}
                  onChange={(e) => setlocation({ ...location, city: e.target.value })}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">Sub-City</h3>
                <input
                  type="text"
                  value={location.subCity || ''}
                  onChange={(e) => setlocation({ ...location, subCity: e.target.value })}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">Kebele</h3>
                <input
                  type="text"
                  value={location.kebele || ''}
                  onChange={(e) => setlocation({ ...location, kebele: e.target.value })}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">Sefer</h3>
                <input
                  type="text"
                  value={location.sefer || ''}
                  onChange={(e) => setlocation({ ...location, sefer: e.target.value })}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>


            <div>
              <h3 className="font-semibold mb-2">Position of Vehicle on Road</h3>
              <div className="flex flex-wrap gap-4">
                {['Left Side of Lane', 'Center of Lane', 'Right of Lane', 'Accident Was Not on a Road'].map((pos) => (
                  <label key={pos} className="flex items-center">
                    <input
                      type="radio"
                      name="position"
                      value={pos}
                      checked={positionOnRoad === pos}
                      onChange={() => setpositionOnRoad(pos)}
                      className="mr-2"
                    />
                    {pos}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Type of road surface</h3>
              <div className="flex flex-wrap gap-4">
                {['Asphalt', 'Cobble Stone', 'Concrete', 'Other'].map((surface) => (
                  <label key={surface} className="flex items-center">
                    <input
                      type="radio"
                      name="roadSurface"
                      value={surface}
                      checked={roadSurface === surface}
                      onChange={() => setRoadSurface(surface)}
                      className="mr-2"
                    />
                    {surface}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Traffic Condition</h3>
              <div className="flex flex-wrap gap-4">
                {['Not Crowded', 'Light Traffic', 'Moderate Traffic', 'Heavy Traffic'].map((traffic) => (
                  <label key={traffic} className="flex items-center">
                    <input
                      type="radio"
                      name="trafficCondition"
                      value={traffic}
                      checked={trafficCondition === traffic}
                      onChange={() => setTrafficCondition(traffic)}
                      className="mr-2"
                    />
                    {traffic}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Were you in the vehicle?</h3>
              <div className="flex flex-wrap gap-4">
                {['Yes', 'No'].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="wereYouInVehicle"
                      value={option}
                      checked={wereYouInVehicle === option}
                      onChange={() => setwereYouInVehicle(option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Time of Day</h3>
              <div className="flex flex-wrap gap-4">
                {['Day Time', 'Night Time'].map((time) => (
                  <label key={time} className="flex items-center">
                    <input
                      type="radio"
                      name="timeOfDay"
                      value={time}
                      checked={timeOfDay === time}
                      onChange={() => setTimeOfDay(time)}
                      className="mr-2"
                    />
                    {time}
                  </label>
                ))}
              </div>
            </div>

            {timeOfDay === 'Night Time' && (
              <div>
                <h3 className="font-semibold mb-2">Headlights On</h3>
                <div className="flex flex-wrap gap-4">
                  {['Yes', 'No'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="headlightsOn"
                        value={option}
                        checked={headlightsOn === option}
                        onChange={() => setHeadlightsOn(option)}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Was horn sounded? </h3>
              <div className="flex flex-wrap gap-4">
                {['No', 'Yes'].map((hornSounded) => (
                  <label key={hornSounded} className="flex items-center">
                    <input
                      type="radio"
                      name="hornSounded"
                      value={hornSounded}
                      checked={hornSounded === hornSounded}
                      onChange={() => sethornSounded(hornSounded)}
                      className="mr-2"
                    />
                    {hornSounded}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Visibility Obstructions</h3>
              <div className="flex flex-wrap gap-4">
                {['No', 'Light Rain', 'Heavy Rain', 'Fog'].map((obstruction) => (
                  <label key={obstruction} className="flex items-center">
                    <input
                      type="radio"
                      name="visibilityObstructions"
                      value={obstruction}
                      checked={visibilityObstructions === obstruction}
                      onChange={() => setVisibilityObstructions(obstruction)}
                      className="mr-2"
                    />
                    {obstruction}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Accident Location</h3>
              <div className="flex flex-wrap gap-4">
                {['Intersection', 'A Round About', 'Neither'].map((location) => (
                  <label key={location} className="flex items-center">
                    <input
                      type="radio"
                      name="intersectionType"
                      value={location}
                      checked={intersectionType === location}
                      onChange={() => setintersectionType(location)}
                      className="mr-2"
                    />
                    {location}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <textarea
                value={additionalDescription}
                onChange={(e) => setadditionalDescription(e.target.value)}
                className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={4}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Other Vehicles Involved</h3>
              {otherVehicles.map((vehicle, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded">
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Driver Name</label>
                    <input
                      type="text"
                      name="driverName"
                      value={vehicle.driverName}
                      onChange={(e) => handleAccidentVehicleChange(index, e)}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input
                      type="text"
                      name="driverAddress"
                      value={vehicle.driverAddress}
                      onChange={(e) => handleAccidentVehicleChange(index, e)}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="text"
                      name="driverPhone"
                      value={vehicle.driverPhone}
                      onChange={(e) => handleAccidentVehicleChange(index, e)}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addVehicle()}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add Another Vehicle
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-4">
            <div><strong>Date of Accident:</strong> {dateOfAccident}</div>
            <div><strong>Time of Accident:</strong> {timeOfAccident}</div>
            <div><strong>Speed:</strong> {speed}</div>

            <div><strong>City:</strong> {location.city}</div>
            <div><strong>SubCity:</strong> {location.subCity}</div>
            <div><strong>Kebele:</strong> {location.kebele}</div>
            <div><strong>Sefer:</strong> {location.sefer}</div>

            <div><strong>Position on Road:</strong> {positionOnRoad}</div>
            <div><strong>Road Surface:</strong> {roadSurface}</div>
            <div><strong>Traffic Condition:</strong> {trafficCondition}</div>
            <div><strong>Time of Day:</strong> {timeOfDay}</div>
            <div><strong>In vehicle:</strong> <YesNoDisplay value={wereYouInVehicle} /></div>
            {timeOfDay === 'Night Time' && (
              <div><strong>Headlights On:</strong> <YesNoDisplay value={headlightsOn} /></div>
            )}
            <div><strong>Horn Sounded:</strong> {hornSounded}</div>
            <div><strong>Visibility Obstructions:</strong> {visibilityObstructions}</div>
            <div><strong>Accident Location:</strong> {intersectionType}</div>
            <div className="col-span-2">
              <strong>Description:</strong>
              <p className="whitespace-pre-line">{additionalDescription}</p>
            </div>

            {otherVehicles.length > 0 && (
              <div className="col-span-2">
                <strong>Other Vehicles Involved:</strong>
                {otherVehicles.map((vehicle, index) => (
                  <div key={index} className="mt-2 p-2 border rounded">
                    <p><strong>Driver:</strong> {vehicle.driverName}</p>
                    <p><strong>Address:</strong> {vehicle.driverAddress}</p>
                    <p><strong>Phone:</strong> {vehicle.driverPhone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Liability Information Section */}
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-blue-600">5. Liability Information</h2>
          <button onClick={() => toggleEdit('liability')} className="text-blue-500 hover:text-blue-700">
            {isEditing.liability ? <Check size={20} /> : <Edit size={20} />}
          </button>
        </div>

        {isEditing.liability ? (
          <div className="mt-4 p-4 border rounded-lg space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Responsible Party</h3>
              <div className="flex flex-wrap gap-4">
                {['Myself', 'The other person'].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="responsibleParty"
                      value={option}
                      checked={responsibleParty === option}
                      onChange={() => setResponsibleParty(option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Other Vehicle Insured</h3>
              <div className="flex flex-wrap gap-4">
                {['I dont know', 'Yes , they are'].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="otherInsuredStatus"
                      value={option}
                      checked={otherInsuredStatus === option}
                      onChange={() => setOtherInsuredStatus(option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
              {otherInsuredStatus === 'Yes , they are' && (
                <div className="mt-4">
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Insurance Company Name</label>
                    <input
                      type="text"
                      value={OtherInsuranceCompanyName}
                      onChange={(e) => setOtherInsuranceCompanyName(e.target.value)}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Police Involved</h3>
              <div className="flex flex-wrap gap-4">
                {['Yes', 'No'].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="policeInvolved"
                      value={option}
                      checked={policeInvolved === option}
                      onChange={() => setPoliceInvolved(option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
              {policeInvolved === 'Yes' && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Officer Name</label>
                    <input
                      type="text"
                      value={policeOfficerName}
                      onChange={(e) => setpoliceOfficerName(e.target.value)}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Police Station</label>
                    <input
                      type="text"
                      value={policeStation}
                      onChange={(e) => setPoliceStation(e.target.value)}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-4">
            <div><strong>Responsible Party:</strong> {responsibleParty}</div>
            <div>
              <strong>Other Vehicle Insured:</strong> {otherInsuredStatus}
              {otherInsuredStatus === 'Yes , they are' && (
                <p><strong>Insurance Company:</strong> {OtherInsuranceCompanyName}</p>
              )}
            </div>
            <div>
              <strong>Police Involved:</strong> {policeInvolved}
              {policeInvolved === 'Yes' && (
                <>
                  <p><strong>Officer Name:</strong> {policeOfficerName}</p>
                  <p><strong>Police Station:</strong> {policeStation}</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Damage Information Section */}
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-blue-600">6. Damage Information</h2>
          <button onClick={() => toggleEdit('damage')} className="text-blue-500 hover:text-blue-700">
            {isEditing.damage ? <Check size={20} /> : <Edit size={20} />}
          </button>
        </div>

        {isEditing.damage ? (
          <div className="mt-4 p-4 border rounded-lg space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Vehicle Damage Description</h3>
              <textarea
                value={vehicleDamageDesc}
                onChange={(e) => setvehicleDamageDesc(e.target.value)}
                className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={4}
                placeholder="Describe the damage to your vehicle..."
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Third Party Property Damage</h3>
              <textarea
                value={thirdPartyDamageDesc}
                onChange={(e) => setthirdPartyDamageDesc(e.target.value)}
                className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={4}
                placeholder="Describe any damage to other property..."
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Were there any injuries?</h3>
              <div className="flex flex-wrap gap-4">
                {['Yes', 'No'].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="injuriesAny"
                      value={option}
                      checked={(injuriesAny && option === 'Yes') || (!injuriesAny && option === 'No')}
                      onChange={() => setinjuriesAny(option === 'Yes')}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
              {injuriesAny && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Injured Person's Name</label>
                    <input
                      type="text"
                      value={injuredPersons.name}
                      onChange={(e) => setInjuredPersons({ name: e.target.value })}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Injured Person's Address</label>
                    <input
                      type="text"
                      value={injuredPersons.address}
                      onChange={(e) => setInjuredPersons({ address: e.target.value })}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 mt-4 px-4">
            <div>
              <strong>Vehicle Damage Description:</strong>
              <p className="mt-1 whitespace-pre-wrap">{vehicleDamageDesc || 'Not provided'}</p>
            </div>
            <div>
              <strong>Third Party Property Damage:</strong>
              <p className="mt-1 whitespace-pre-wrap">{thirdPartyDamageDesc || 'Not provided'}</p>
            </div>
            <div>
              <strong>Injuries:</strong> {injuriesAny ? 'Yes' : 'No'}
              {injuriesAny && (
                <>
                  <p className="mt-1"><strong>Injured Person:</strong> {injuredPersons.name}</p>
                  <p><strong>Address:</strong> {injuredPersons.address}</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Witness Information Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-blue-600">6. Witness Information</h2>
          <button onClick={() => toggleEdit('witness')} className="text-blue-500 hover:text-blue-700">
            {isEditing.witness ? <Check size={20} /> : <Edit size={20} />}
          </button>
        </div>

        {isEditing.witness ? (
          <div className="mt-4 p-4 border rounded-lg space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Alone in Vehicle</h3>
              <div className="flex flex-wrap gap-4">
                {['Yes I was', 'No I wasn\'t alone'].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="aloneInVehicle"
                      value={option}
                      checked={aloneInVehicle === option}
                      onChange={() => setAloneInVehicle(option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {aloneInVehicle === 'No I wasn\'t alone' && (
              <div>
                <h3 className="font-semibold mb-2">Vehicle Occupants</h3>
                {vehicleOccupants.map((occupant, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded">
                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        value={occupant.name}
                        onChange={(e) => updateVehicleOccupant(index, 'name', e.target.value)}
                        className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">Address/Phone</label>
                      <input
                        type="text"
                        value={occupant.contact}
                        onChange={(e) => updateVehicleOccupant(index, 'contact', e.target.value)}
                        className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addVehicleOccupant()}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Occupant
                </button>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Independent Witnesses</h3>
              <div className="flex flex-wrap gap-4">
                {['Yes', 'Yes. I dont have their names', 'No, there were no witnesses'].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name="independentWitnessPresent"
                      value={option}
                      checked={independentWitnessPresent === option}
                      onChange={() => setindependentWitnessPresent(option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {independentWitnessPresent === 'Yes' && (
              <div>
                <h3 className="font-semibold mb-2">Witness Details</h3>
                {independentWitnesses.map((witness, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded">
                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        value={witness.name}
                        onChange={(e) => updateIndependentWitness(index, 'name', e.target.value)}
                        className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium mb-1">Address/Phone</label>
                      <input
                        type="text"
                        value={witness.contact}
                        onChange={(e) => updateIndependentWitness(index, 'contact', e.target.value)}
                        className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addIndependentWitness()}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Witness
                </button>
              </div>
            )}

            {independentWitnessPresent === 'Yes. I dont have their names' && (
              <div>
                <h3 className="font-semibold mb-2">Reason</h3>
                <textarea
                  value={whyNoWitness}
                  onChange={(e) => setwhyNoWitness(e.target.value)}
                  className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={3}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-4">
            <div>
              <strong>Alone in Vehicle:</strong> {aloneInVehicle}
            </div>

            {aloneInVehicle === 'No I wasn\'t alone' && vehicleOccupants.length > 0 && (
              <div className="col-span-2">
                <strong>Vehicle Occupants:</strong>
                {vehicleOccupants.map((occupant, index) => (
                  <div key={index} className="mt-2 p-2 border rounded">
                    <p><strong>Name:</strong> {occupant.name}</p>
                    <p><strong>Contact:</strong> {occupant.contact}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="col-span-2">
              <strong>Independent Witnesses:</strong> {independentWitnessPresent}

              {independentWitnessPresent === 'Yes' && independentWitnesses.length > 0 && (
                <div className="mt-2">
                  {independentWitnesses.map((witness, index) => (
                    <div key={index} className="mt-2 p-2 border rounded">
                      <p><strong>Name:</strong> {witness.name}</p>
                      <p><strong>Contact:</strong> {witness.contact}</p>
                    </div>
                  ))}
                </div>
              )}

              {independentWitnessPresent === 'Yes. I dont have their names' && (
                <div className="mt-2">
                  <strong>Reason:</strong>
                  <p className="whitespace-pre-line">{whyNoWitness}</p>
                </div>
              )}
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
          className="bg-green-500 text-white p-10 py-2 rounded"
          onClick={handleSubmit}
        >
          Submit Claim
        </button>
      </div>
    </div>
  );
}