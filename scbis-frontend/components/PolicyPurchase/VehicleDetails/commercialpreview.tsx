'use client';
import { useRouter } from 'next/navigation';
import { Edit, Check } from 'lucide-react';
import { useState } from 'react';
import { useVehiclePurposeStore } from '@/store/vehicleDetails/purpose';
import { useCommercialVehicleCategoryStore } from '@/store/vehicleDetails/commercialVehicle';
import { useCommercialVehicleTwoStore } from '@/store/vehicleDetails/commercialVehicle2';
import { useGeneralVehicleStore } from '@/store/vehicleDetails/generalVehicle';
import { useOwnershipUsageStore } from '@/store/vehicleDetails/ownershipAndUsage';

export default function CommercialVehiclePreview() {
  const router = useRouter();
  
  // Get all data from stores
  const { selectedType } = useVehiclePurposeStore();
  const { selectedCategories: commercialCategories1 } = useCommercialVehicleCategoryStore();
  const { selectedCategories: commercialCategories2 } = useCommercialVehicleTwoStore();
  const { formData: vehicleData } = useGeneralVehicleStore();
  const { formData: ownershipData } = useOwnershipUsageStore();

  const [isEditing, setIsEditing] = useState({
    purpose: false,
    category1: false,
    category2: false,
    vehicle: false,
    ownership: false
  });

  const toggleEdit = (section: keyof typeof isEditing) => {
    setIsEditing(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = () => {
    console.log('Submitting policy with all data:', {
      insuranceType: selectedType,
      commercialCategories1,
      commercialCategories2,
      vehicleDetails: vehicleData,
      ownershipDetails: ownershipData
    });
    
    alert('Policy submitted successfully!');
    router.push('/policy-purchase/confirmation');
  };

  const handlePrevious = () => {
    router.push('/policy-purchase/vehicle-information/ownershipAndUsage');
  };

  // Helper function to get category names
  const getSelectedCategories = (categories: Record<string, boolean>) => {
    return Object.entries(categories)
      .filter(([_, selected]) => selected)
      .map(([key]) => {
        // Map the keys to human-readable names
        const nameMap: Record<string, string> = {
          // Commercial Vehicle Category 1
          'taxi_small_buses': 'Taxi - Small Buses',
          'taxi_medium_buses': 'Taxi - Medium Buses',
          'taxi_large_buses': 'Taxi - Large Buses',
          'minibus_own_service': 'Minibus - Own Service',
          'minibus_public_service': 'Minibus - Public Service',
          'buses_own_small': 'Buses (Own) - Small',
          'buses_own_medium': 'Buses (Own) - Medium',
          'buses_own_large': 'Buses (Own) - Large',
          'buses_public_small': 'Buses (Public) - Small',
          'buses_public_medium': 'Buses (Public) - Medium',
          'buses_public_large': 'Buses (Public) - Large',
          'own_goods_pickups': 'Own Goods - Pickups',
          'own_goods_small': 'Own Goods - Small',
          'own_goods_medium': 'Own Goods - Medium',
          'own_goods_large': 'Own Goods - Large',
          'own_goods_trailers': 'Own Goods - Trailers',
          'own_goods_semi_trailers': 'Own Goods - Semi Trailers',
          'cartage_pickups': 'Cartage - Pickups',
          'cartage_small': 'Cartage - Small',
          'cartage_medium': 'Cartage - Medium',
          'cartage_large': 'Cartage - Large',
          
          // Commercial Vehicle Category 2
          'own_goods_tanker_trailers': 'Own Goods - Tanker Trailers',
          'own_goods_small_liquid': 'Own Goods - Small Liquid',
          'own_goods_medium_liquid': 'Own Goods - Medium Liquid',
          'own_goods_large_liquid': 'Own Goods - Large Liquid',
          'cartage_tanker_trailers': 'Cartage - Tanker Trailers',
          'cartage_small_liquid': 'Cartage - Small Liquid',
          'cartage_medium_liquid': 'Cartage - Medium Liquid',
          'cartage_large_liquid': 'Cartage - Large Liquid',
          'pcv_small_buses': 'PCV - Small Buses',
          'pcv_medium_buses': 'PCV - Medium Buses',
          'pcv_large_buses': 'PCV - Large Buses',
          'pcv_automobile': 'PCV - Automobile',
          'pcv_mini_buses': 'PCV - Mini Buses',
          'gcv_pickups': 'GCV - Pickups',
          'gcv_small_cargo': 'GCV - Small Cargo',
          'gcv_small_liquid': 'GCV - Small Liquid',
          'gcv_medium_goods': 'GCV - Medium Goods',
          'gcv_medium_liquid': 'GCV - Medium Liquid',
          'gcv_large_goods': 'GCV - Large Goods',
          'gcv_large_liquid': 'GCV - Large Liquid',
          'gcv_trailers': 'GCV - Trailers',
          'gcv_semi_trailers': 'GCV - Semi Trailers',
          'gcv_special_construction': 'GCV - Special Construction'
        };
        return nameMap[key] || key;
      });
  };

  return (
    <div className="flex flex-col items-center px-4">
      <div className="w-full max-w-5xl flex justify-between items-center mt-8">
        <h2 className="md:text-xl sm:text-lg font-bold">Policy Purchase</h2>
        <button className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded">Save as draft</button>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-wrap sm:justify-start md:justify-start items-center gap-2 mt-6 mb-4">
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full">1</div>
          <span className="ml-2 font-medium text-black text-xs sm:text-base">Purpose</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full">2</div>
          <span className="ml-2 text-black text-xs sm:text-base">Vehicle Category</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full">3</div>
          <span className="ml-2 text-black text-sm sm:text-base">General Vehicle Details</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-full">4</div>
          <span className="ml-2 text-black text-sm sm:text-base">Ownership and Usage</span>
        </div>
        <div className="w-7 sm:border-t-2 border-gray-400"></div>
        <div className="flex items-center">
          <div className="w-7 h-7 flex items-center justify-center bg-[#1F4878] text-white rounded-full">5</div>
          <span className="ml-2 text-black text-xs sm:text-base">Preview</span>
        </div>
      </div>

      <div className="bg-white mb-10 p-8 rounded-xl w-full max-w-5xl"
        style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}>

        {/* Purpose Section */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-600">1. Insurance Purpose</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-4">
            <div><strong>Selected Insurance Type:</strong> Commercial</div>
          </div>
        </div>

        {/* Commercial Vehicle Category Section 1 */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-600">2. Commercial Vehicle Categories (Part 1)</h2>
            <button onClick={() => toggleEdit('category1')} className="text-blue-500 hover:text-blue-700">
              {isEditing.category1 ? <Check size={20} /> : <Edit size={20} />}
            </button>
          </div>
          
          {isEditing.category1 ? (
            <div className="mt-4 text-red-500">
              <p>Please go back to the category selection pages to make changes</p>
            </div>
          ) : (
            <div className="mt-4 px-4">
              <h3 className="font-medium mb-2">Selected Categories:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {getSelectedCategories(commercialCategories1).map((category, index) => (
                  <li key={index}>{category}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Commercial Vehicle Category Section 2 */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-600">3. Commercial Vehicle Categories (Part 2)</h2>
            <button onClick={() => toggleEdit('category2')} className="text-blue-500 hover:text-blue-700">
              {isEditing.category2 ? <Check size={20} /> : <Edit size={20} />}
            </button>
          </div>
          
          {isEditing.category2 ? (
            <div className="mt-4 text-red-500">
              <p>Please go back to the category selection pages to make changes</p>
            </div>
          ) : (
            <div className="mt-4 px-4">
              <h3 className="font-medium mb-2">Selected Categories:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {getSelectedCategories(commercialCategories2).map((category, index) => (
                  <li key={index}>{category}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* General Vehicle Details Section */}
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-600">4. General Vehicle Details</h2>
            <button onClick={() => toggleEdit('vehicle')} className="text-blue-500 hover:text-blue-700">
              {isEditing.vehicle ? <Check size={20} /> : <Edit size={20} />}
            </button>
          </div>
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
        </div>

        {/* Ownership and Usage Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-600">5. Ownership and Usage</h2>
            <button onClick={() => toggleEdit('ownership')} className="text-blue-500 hover:text-blue-700">
              {isEditing.ownership ? <Check size={20} /> : <Edit size={20} />}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 px-4">
            <div><strong>Owner Type:</strong> {ownershipData.ownerType}</div>
            <div><strong>Driver Type:</strong> {ownershipData.driverType}</div>
            <div><strong>Seating Capacity:</strong> {ownershipData.seatingCapacity}</div>
            <div><strong>Purchased Value:</strong> {ownershipData.purchasedValue}</div>
            <div><strong>Duty Free:</strong> {ownershipData.dutyFree}</div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="w-full max-w-5xl flex justify-between my-6 pr-4">
          <button 
            onClick={handlePrevious} 
            className="bg-[#3AA4FF] text-white p-2 px-6 rounded"
          >
            Previous
          </button>
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