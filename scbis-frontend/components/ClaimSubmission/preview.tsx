'use client';

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

export default function ClaimPreview() {
  const router = useRouter();
  
  // Get all data from stores and their update functions
  const { selectedVehicle, selectVehicle, vehicles } = useVehicleSelectionStore();
  const { selectedPolicy, policies, selectPolicy } = useClaimPolicyStore();
  const { 
    isDriverSame, 
    formData: driverData, 
    setDriverSame,
    updateFormData: updateDriverData 
  } = useDriverDetailsStore();
  const {
    position,
    roadSurface,
    trafficCondition,
    description,
    timeOfDay,
    headlightsOn,
    visibilityObstructions,
    accidentLocation,
    otherVehicles,
    setPosition,
    setRoadSurface,
    setTrafficCondition,
    setDescription,
    setTimeOfDay,
    setHeadlightsOn,
    setVisibilityObstructions,
    setAccidentLocation,
    addVehicle,
    removeVehicle,
    updateVehicle
  } = useAccidentDetailsStore();
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
    setPoliceStation
  } = useLiabilityInformationStore();
  const {
    aloneInVehicle,
    vehicleOccupants,
    independentWitnessPresence,
    independentWitnesses,
    witnessReason,
    setAloneInVehicle,
    addVehicleOccupant,
    removeVehicleOccupant,
    updateVehicleOccupant,
    setIndependentWitnessPresence,
    addIndependentWitness,
    removeIndependentWitness,
    updateIndependentWitness,
    setWitnessReason
  } = useWitnessInformationStore();
  const {
    driverName,
    insuredName,
    date,
    agreed,
    setDriverName,
    setInsuredName,
    setDate,
    setAgreed
  } = useDeclarationStore();

  const [isEditing, setIsEditing] = useState({
    policy: false,
    vehicle: false,
    driver: false,
    accident: false,
    liability: false,
    witness: false
  });

  const toggleEdit = (section: keyof typeof isEditing) => {
    setIsEditing(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = () => {
    console.log('Submitting claim with all data:', {
      selectedVehicle,
      selectedPolicy,
      driverData: {
        isDriverSame,
        ...driverData
      },
      accidentDetails: {
        position,
        roadSurface,
        trafficCondition,
        description,
        timeOfDay,
        headlightsOn,
        visibilityObstructions,
        accidentLocation,
        otherVehicles,
      },
      liabilityInformation: {
        responsibleParty,
        otherInsuredStatus,
        insuranceCompanyName,
        policeInvolved,
        officerName,
        policeStation
      },
      witnessInformation: {
        aloneInVehicle,
        vehicleOccupants,
        independentWitnessPresence,
        independentWitnesses,
        witnessReason
      },
      declaration: {
        driverName,
        insuredName,
        date,
        agreed
      }
    });

    const storesToClear = [
      'accident-details-storage',
      'claim-policy-selection-storage',
      'damage-details-storage',
      'declaration-storage',
      'claim-disclaimer-storage',
      'driver-details-storage',
      'liability-information-storage',
      'vehicle-selection-storage',
      'witness-information-storage'
    ];
  
    storesToClear.forEach(storeName => {
      localStorage.removeItem(storeName);
    });

    useAccidentDetailsStore.getState().clearAllData();
    useClaimPolicyStore.getState().clearAllData();
    useDriverDetailsStore.getState().clearAllData();
    useLiabilityInformationStore.getState().clearAllData();
    useVehicleSelectionStore.getState().clearAllData();
    useWitnessInformationStore.getState().clearAllData();
    useDeclarationStore.getState().clearAllData();
    
    alert("Claim submitted successfully!") 
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
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
        isYes ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
  const safeDriverGrade = driverData.grade || '';
  const safeExpirationDate = driverData.expirationDate || '';


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
                    checked={isDriverSame === true}
                    onChange={() => setDriverSame(true)} 
                    className="mr-2"
                  />
                  Same as insured
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="driverSame" 
                    checked={isDriverSame === false}
                    onChange={() => setDriverSame(false)} 
                    className="mr-2"
                  />
                  Different driver
                </label>
              </div>

              {!isDriverSame && (
                <>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={driverData.firstName}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={driverData.lastName}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <input
                      type="text"
                      name="age"
                      value={driverData.age}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={driverData.city}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Subcity</label>
                    <input
                      type="text"
                      name="subCity"
                      value={driverData.subCity}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Kebele</label>
                    <input
                      type="text"
                      name="kebele"
                      value={driverData.kebele}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={driverData.phoneNumber}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">License No</label>
                    <input
                      type="text"
                      name="licenseNo"
                      value={driverData.licenseNo}
                      onChange={handleDriverDataChange}
                      className="w-full p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Grade</label>
                    <select
                      name="grade"
                      value={driverData.grade}
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
                      value={driverData.expirationDate}
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
              <YesNoDisplay value={isDriverSame} />
            </div>
            
            {!isDriverSame && (
              <>
                <div><strong>First Name:</strong> {driverData.firstName}</div>
                <div><strong>Last Name:</strong> {driverData.lastName}</div>
                <div><strong>Age:</strong> {driverData.age}</div>
                <div><strong>City:</strong> {driverData.city}</div>
                <div><strong>Subcity:</strong> {driverData.subCity}</div>
                <div><strong>Kebele:</strong> {driverData.kebele}</div>
                <div><strong>Phone Number:</strong> {driverData.phoneNumber}</div>
                <div><strong>License No:</strong> {driverData.licenseNo}</div>
                <div><strong>Grade:</strong> {driverData.grade}</div>
                <div><strong>Expiration Date:</strong> {driverData.expirationDate}</div>
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
            <div>
              <h3 className="font-semibold mb-2">Position of Vehicle on Road</h3>
              <div className="flex flex-wrap gap-4">
                {['Left Side of Lane', 'Center of Lane', 'Right of Lane', 'Accident Was Not on a Road'].map((pos) => (
                  <label key={pos} className="flex items-center">
                    <input 
                      type="radio" 
                      name="position" 
                      value={pos} 
                      checked={position === pos}
                      onChange={() => setPosition(pos)}
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
                {['An Intersection', 'A Round About', 'Neither'].map((location) => (
                  <label key={location} className="flex items-center">
                    <input 
                      type="radio" 
                      name="accidentLocation" 
                      value={location} 
                      checked={accidentLocation === location}
                      onChange={() => setAccidentLocation(location)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
            <div><strong>Position on Road:</strong> {position}</div>
            <div><strong>Road Surface:</strong> {roadSurface}</div>
            <div><strong>Traffic Condition:</strong> {trafficCondition}</div>
            <div><strong>Time of Day:</strong> {timeOfDay}</div>
            {timeOfDay === 'Night Time' && (
              <div><strong>Headlights On:</strong> <YesNoDisplay value={headlightsOn} /></div>
            )}
            <div><strong>Visibility Obstructions:</strong> {visibilityObstructions}</div>
            <div><strong>Accident Location:</strong> {accidentLocation}</div>
            <div className="col-span-2">
              <strong>Description:</strong> 
              <p className="whitespace-pre-line">{description}</p>
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
                      value={insuranceCompanyName}
                      onChange={(e) => setInsuranceCompanyName(e.target.value)}
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
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
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
                <p><strong>Insurance Company:</strong> {insuranceCompanyName}</p>
              )}
            </div>
            <div>
              <strong>Police Involved:</strong> {policeInvolved}
              {policeInvolved === 'Yes' && (
                <>
                  <p><strong>Officer Name:</strong> {officerName}</p>
                  <p><strong>Police Station:</strong> {policeStation}</p>
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
                      name="independentWitnessPresence" 
                      value={option} 
                      checked={independentWitnessPresence === option}
                      onChange={() => setIndependentWitnessPresence(option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            {independentWitnessPresence === 'Yes' && (
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

            {independentWitnessPresence === 'Yes. I dont have their names' && (
              <div>
                <h3 className="font-semibold mb-2">Reason</h3>
                <textarea
                  value={witnessReason}
                  onChange={(e) => setWitnessReason(e.target.value)}
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
              <strong>Independent Witnesses:</strong> {independentWitnessPresence}
              
              {independentWitnessPresence === 'Yes' && independentWitnesses.length > 0 && (
                <div className="mt-2">
                  {independentWitnesses.map((witness, index) => (
                    <div key={index} className="mt-2 p-2 border rounded">
                      <p><strong>Name:</strong> {witness.name}</p>
                      <p><strong>Contact:</strong> {witness.contact}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {independentWitnessPresence === 'Yes. I dont have their names' && (
                <div className="mt-2">
                  <strong>Reason:</strong>
                  <p className="whitespace-pre-line">{witnessReason}</p>
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