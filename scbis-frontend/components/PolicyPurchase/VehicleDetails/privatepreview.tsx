'use client';

import { Edit, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useVehiclePurposeStore } from '@/store/vehicleDetails/purpose';
import { usePrivateVehicleCategoryStore } from '@/store/vehicleDetails/privateVehicleCategory';
import { useGeneralVehicleStore } from '@/store/vehicleDetails/generalVehicle';
import { useOwnershipUsageStore } from '@/store/vehicleDetails/ownershipAndUsage';
import { useState } from 'react';

type VehicleDetails = {
  make: string;
  model: string;
  mfgYear: string;
  [key: string]: any;
};

type OwnershipUsageData = {
  isOwned: boolean;
  isUsedForWork: boolean;
  [key: string]: any;
};

export default function PolicyPreview() {
  const router = useRouter();

  const { selectedType, setSelectedType } = useVehiclePurposeStore();
  const { carType, usageType, setCarType, setUsageType } = usePrivateVehicleCategoryStore();
  const { formData: vehicleData, setFormData: setVehicleData } = useGeneralVehicleStore();
  const { formData: ownershipData, setFormData: setOwnershipData } = useOwnershipUsageStore();

  const [isEditing, setIsEditing] = useState({
    purpose: false,
    category: false,
    vehicle: false,
    ownership: false
  });

  const toggleEdit = (section: keyof typeof isEditing) => {
    setIsEditing(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = () => {
    console.log('Submitting policy with all data:', {
      insuranceType: selectedType,
      vehicleCategory: { carType, usageType },
      vehicleDetails: vehicleData,
      ownershipDetails: ownershipData
    });
  
    alert('Policy submitted successfully!');
  

    localStorage.removeItem('insurance-storage');
    localStorage.removeItem('private-vehicle-storage');
    localStorage.removeItem('general-vehicle-storage');
    localStorage.removeItem('ownership-usage-storage');
  
    router.push('/policy-purchase/purchase/policySelection');
  };

  const handlePrevious = () => {
    router.push('/policy-purchase/vehicle-information/ownershipAndUsage');
  };

  const YesNoDisplay = ({ value }: { value: string | boolean }) => {
    const displayValue = typeof value === 'boolean' ? (value ? 'yes' : 'no') : value;
    return (
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
        displayValue === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {displayValue === 'yes' ? 'Yes' : 'No'}
      </span>
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
  
    setVehicleData({
      ...vehicleData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleOwnershipChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
  
    setOwnershipData({
      ...ownershipData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const vehicleMakes = ['Toyota', 'Honda', 'Ford', 'Nissan', 'Hyundai'];
  const mfgYears = Array.from({ length: 20 }, (_, i) => (new Date().getFullYear() - i).toString());
  const bodyTypes = ['Sedan', 'SUV', 'Truck', 'Van', 'Hatchback', 'Coupe'];

  return (
    <div className="flex flex-col items-center px-4">

      <div className="bg-white p-8 pt-2 mb-10 rounded-xl w-full max-w-5xl"
        style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}>

      <div className="w-full max-w-5xl mb-10 flex justify-between items-center mt-8">
        <h2 className="md:text-xl sm:text-lg font-bold">Preview </h2>
      </div>

        {/* Purpose Section */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-600">1. Insurance Purpose</h2>
            <button onClick={() => toggleEdit('purpose')} className="text-blue-500 hover:text-blue-700">
              {isEditing.purpose ? <Check size={20} /> : <Edit size={20} />}
            </button>
          </div>
          
          {isEditing.purpose ? (
            <div className="mt-4">
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Insurance Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border border-black rounded"
                >
                  <option value="private">Private</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-4">
              <div><strong>Selected Insurance Type:</strong> {selectedType === 'private' ? 'Private' : 'Commercial'}</div>
            </div>
          )}
        </div>

        {/* Vehicle Category Section */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-600">2. Vehicle Category</h2>
            <button onClick={() => toggleEdit('category')} className="text-blue-500 hover:text-blue-700">
              {isEditing.category ? <Check size={20} /> : <Edit size={20} />}
            </button>
          </div>
          
          {isEditing.category ? (
            <div className="mt-4 space-y-4">
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Vehicle Type</label>
                <select
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                  className="w-full p-2 border border-black rounded"
                >
                  <option value="passenger">Passenger Cars</option>
                  <option value="suvs">SUVs & Off-Road Vehicles</option>
                  <option value="pickup">Pickup Trucks & Utility Vehicles</option>
                  <option value="minivan">Vans & Mini-Buses</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-medium">Usage Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="usageType"
                      checked={usageType === 'personal'}
                      onChange={() => setUsageType('personal')}
                    />
                    Private or Personal Use
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="usageType"
                      checked={usageType === 'business'}
                      onChange={() => setUsageType('business')}
                    />
                    Private Business Use
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-4">
              <div><strong>Vehicle Type:</strong> {
                carType === 'passenger' ? 'Passenger Cars' :
                carType === 'suvs' ? 'SUVs & Off-Road Vehicles' :
                carType === 'pickup' ? 'Pickup Trucks & Utility Vehicles' :
                'Vans & Mini-Buses'
              }</div>
              <div><strong>Usage Type:</strong> {usageType === 'personal' ? 'Private/Personal Use' : 'Private Business Use'}</div>
            </div>
          )}
        </div>

        {/* General Vehicle Details Section */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-600">3. General Vehicle Details</h2>
            <button onClick={() => toggleEdit('vehicle')} className="text-blue-500 hover:text-blue-700">
              {isEditing.vehicle ? <Check size={20} /> : <Edit size={20} />}
            </button>
          </div>
          
          {isEditing.vehicle ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Make</label>
                <select
                  name="make"
                  value={vehicleData.make}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-black rounded"
                >
                  <option value="">Select Make</option>
                  {vehicleMakes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Model</label>
                <input
                  type="text"
                  name="model"
                  value={vehicleData.model}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-black rounded"
                />
              </div>
              
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Manufacturing Year</label>
                <select
                  name="mfgYear"
                  value={vehicleData.mfgYear}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-black rounded"
                >
                  <option value="">Select Year</option>
                  {mfgYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Engine Capacity (CC)</label>
                <input
                  type="text"
                  name="engineCapacity"
                  value={vehicleData.engineCapacity}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-black rounded"
                />
              </div>
              
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Chassis No</label>
                <input
                  type="text"
                  name="chassisNo"
                  value={vehicleData.chassisNo}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-black rounded"
                />
              </div>
              
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Engine No</label>
                <input
                  type="text"
                  name="engineNo"
                  value={vehicleData.engineNo}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-black rounded"
                />
              </div>
              
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Plate No</label>
                <input
                  type="text"
                  name="plateNo"
                  value={vehicleData.plateNo}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-black rounded"
                />
              </div>
              
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Body Type</label>
                <select
                  name="bodyType"
                  value={vehicleData.bodyType}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-black rounded"
                >
                  <option value="">Select Body Type</option>
                  {bodyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-4">
              <div><strong>Make:</strong> {vehicleData.make}</div>
              <div><strong>Model:</strong> {vehicleData.model}</div>
              <div><strong>Manufacturing Year:</strong> {vehicleData.mfgYear}</div>
              <div><strong>Engine Capacity (CC):</strong> {vehicleData.engineCapacity}</div>
              <div><strong>Chassis No:</strong> {vehicleData.chassisNo}</div>
              <div><strong>Engine No:</strong> {vehicleData.engineNo}</div>
              <div><strong>Plate No:</strong> {vehicleData.plateNo}</div>
              <div><strong>Body Type:</strong> {vehicleData.bodyType}</div>
            </div>
          )}
        </div>

        {/* Ownership and Usage Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-600">4. Ownership and Usage</h2>
            <button onClick={() => toggleEdit('ownership')} className="text-blue-500 hover:text-blue-700">
              {isEditing.ownership ? <Check size={20} /> : <Edit size={20} />}
            </button>
          </div>
          
          {isEditing.ownership ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Owner Type</label>
                <select
                  name="ownerType"
                  value={ownershipData.ownerType}
                  onChange={handleOwnershipChange}
                  className="w-full p-2 border border-black rounded"
                >
                  <option value="Individual">Individual</option>
                  <option value="Company">Company</option>
                </select>
              </div>
              
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Driver Type</label>
                <select
                  name="driverType"
                  value={ownershipData.driverType}
                  onChange={handleOwnershipChange}
                  className="w-full p-2 border border-black rounded"
                >
                  <option value="Private">Private</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Seating Capacity</label>
                <input
                  type="text"
                  name="seatingCapacity"
                  value={ownershipData.seatingCapacity}
                  onChange={handleOwnershipChange}
                  className="w-full p-2 border border-black rounded"
                />
              </div>
              
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Purchased Value</label>
                <input
                  type="text"
                  name="purchasedValue"
                  value={ownershipData.purchasedValue}
                  onChange={handleOwnershipChange}
                  className="w-full p-2 border border-black rounded"
                />
              </div>
              
              <div className="relative">
                <label className="absolute left-4 -top-2 text-black bg-white text-sm px-1">Duty Free</label>
                <select
                  name="dutyFree"
                  value={ownershipData.dutyFree}
                  onChange={handleOwnershipChange}
                  className="w-full p-2 border border-black rounded"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-4">
              <div><strong>Owner Type:</strong> {ownershipData.ownerType}</div>
              <div><strong>Driver Type:</strong> {ownershipData.driverType}</div>
              <div><strong>Seating Capacity:</strong> {ownershipData.seatingCapacity}</div>
              <div><strong>Purchased Value:</strong> {ownershipData.purchasedValue}</div>
              <div><strong>Duty Free:</strong> {ownershipData.dutyFree}</div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="w-full max-w-5xl flex justify-end my-6 pr-4">
          <button 
            onClick={handleSubmit} 
            className="bg-green-500 text-white p-2 px-6 rounded"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
}