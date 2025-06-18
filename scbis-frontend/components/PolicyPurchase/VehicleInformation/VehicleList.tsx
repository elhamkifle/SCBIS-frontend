'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Plus, Loader2, AlertCircle } from 'lucide-react';
import { vehicleApi } from '@/utils/vehicleApi';
import { useVehicleSelectionStore } from '@/store/vehicleSelection/vehicleSelectionStore';
import { useUserStore } from '@/store/authStore/useUserStore';

interface VehicleData {
  _id: string;
  userId: string;
  vehicleType: string;
  privateVehicle?: {
    usageType: string[];
    vehicleCategory: string;
    generalDetails: {
      make: string;
      model: string;
      manufacturingYear?: number;
      chassisNumber?: string;
      engineCapacity: number;
      plateNumber: string;
      bodyType: string;
      engineNumber: string;
    };
    ownershipUsage: {
      ownerType: string;
      purchasedValue: number;
      dutyFree: boolean;
      driverType: string;
      seatingCapacity: number;
    };
  };
  commercialVehicle?: {
    usageType: string[];
    vehicleCategory: string;
    primaryVehicleType: string;
    subCategory: string;
    size: string;
    selectedCategories: {
      category1: Record<string, boolean>;
      category2: Record<string, boolean>;
    };
    generalDetails: {
      make: string;
      model: string;
      manufacturingYear?: number;
      chassisNumber?: string;
      engineCapacity: number;
      plateNumber: string;
      bodyType: string;
      engineNumber: string;
    };
    ownershipUsage: {
      ownerType: string;
      purchasedValue: number;
      dutyFree: boolean;
      driverType: string;
      seatingCapacity: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export default function VehicleList() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  
  const {
    vehicles,
    isLoading,
    error,
    setVehicles,
    setLoading,
    setError,
    setSelectedVehicle,
    setCreateNewVehicle,
  } = useVehicleSelectionStore();

  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    console.log('🚗 Vehicle List Page mounted');
    
    // Only fetch vehicles if user is verified
    if (user?.userVerified === true) {
      fetchUserVehicles();
    } else {
      console.log('🚫 User not verified - skipping vehicle fetch');
      setLoading(false);
    }
  }, [user?.userVerified]);

  const fetchUserVehicles = async () => {
    console.log('🔄 Starting to fetch user vehicles...');
    setLoading(true);
    setLocalLoading(true);
    setError(null);

    try {
      const userVehicles = await vehicleApi.getUserVehicles();
      console.log('✅ Successfully fetched vehicles:', userVehicles);
      setVehicles(userVehicles || []);
    } catch (err) {
      console.error('❌ Error fetching vehicles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
      setLocalLoading(false);
      console.log('🏁 Finished fetching vehicles');
    }
  };

  const handleSelectVehicle = async (vehicle: VehicleData) => {
    console.log('🎯 User selected vehicle:', vehicle);
    
    try {
      setLocalLoading(true);
      
      // Fetch detailed vehicle information
      console.log(`🔍 Fetching detailed info for vehicle ID: ${vehicle._id}`);
      const detailedVehicle = await vehicleApi.getVehicleDetails(vehicle._id);
      
      // Store the selected vehicle
      setSelectedVehicle(vehicle._id, detailedVehicle);
      
      console.log('✅ Vehicle selected successfully, navigating to purpose page...');
      router.push('/policy-purchase/purchase/policySelection');
    } catch (err) {
      console.error('❌ Error selecting vehicle:', err);
      setError(err instanceof Error ? err.message : 'Failed to select vehicle');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCreateNewVehicle = () => {
    console.log('🆕 User chose to create new vehicle');
    setCreateNewVehicle();
    console.log('➡️ Navigating to purpose page for new vehicle...');
    router.push('/policy-purchase/vehicle-information/purpose');
  };

  const formatVehicleInfo = (vehicle: VehicleData) => {
    if (vehicle.privateVehicle) {
      const { generalDetails, usageType, vehicleCategory } = vehicle.privateVehicle;
      return {
        title: `${generalDetails.make} ${generalDetails.model}`,
        plateNumber: generalDetails.plateNumber,
        type: `${vehicle.vehicleType} - ${vehicleCategory}`,
        usage: usageType.join(', '),
        bodyType: generalDetails.bodyType,
        engineCapacity: `${generalDetails.engineCapacity}cc`,
      };
    }
    
    if (vehicle.commercialVehicle) {
      const { generalDetails, usageType, vehicleCategory } = vehicle.commercialVehicle;
      return {
        title: `${generalDetails.make} ${generalDetails.model}`,
        plateNumber: generalDetails.plateNumber,
        type: `${vehicle.vehicleType} - ${vehicleCategory}`,
        usage: usageType.join(', '),
        bodyType: generalDetails.bodyType,
        engineCapacity: `${generalDetails.engineCapacity}cc`,
      };
    }
    
    // Fallback for unknown vehicle structure
    return {
      title: 'Unknown Vehicle',
      plateNumber: 'N/A',
      type: vehicle.vehicleType,
      usage: 'N/A',
      bodyType: 'N/A',
      engineCapacity: 'N/A',
    };
  };

  if (localLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading your vehicles...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 mb-10">
      {/* Header */}
      <div className="w-full flex justify-between items-center mt-2 mb-6">
        <h2 className="md:text-xl sm:text-lg font-bold">Select Vehicle</h2>
        <button
          className="bg-[#0F1D3F] sm:text-xs md:text-lg text-white px-4 py-2 rounded"
          onClick={() => console.log('💾 Save as draft clicked')}
        >
          Save as draft
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="w-full max-w-4xl mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <div>
            <p className="text-red-700 font-medium">Error loading vehicles</p>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={fetchUserVehicles}
              className="mt-2 text-red-600 underline text-sm hover:text-red-800"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full max-w-6xl">
        <h3 className="text-lg font-semibold mb-6 text-center">
          Choose an existing vehicle or create a new one
        </h3>

        {/* Create New Vehicle Card */}
        <div className="mb-8">
          <div
            onClick={handleCreateNewVehicle}
            className="bg-white p-6 rounded-2xl shadow-lg border-2 border-dashed border-blue-300 hover:border-blue-500 cursor-pointer transition-all duration-200 hover:shadow-xl"
            style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-blue-600 mb-2">Create New Vehicle</h4>
              <p className="text-gray-600">Add a new vehicle to your account</p>
            </div>
          </div>
        </div>

        {/* Existing Vehicles */}
        {vehicles.length > 0 ? (
          <div>
            <h4 className="text-lg font-medium mb-4">Your Saved Vehicles ({vehicles.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => {
                const vehicleInfo = formatVehicleInfo(vehicle);
                return (
                  <div
                    key={vehicle._id}
                    onClick={() => handleSelectVehicle(vehicle)}
                    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-all duration-200 hover:shadow-xl"
                    style={{ boxShadow: '0px 10px 20px rgba(0, 123, 255, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.1)' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Car className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {vehicle.vehicleType}
                      </span>
                    </div>
                    
                    <h5 className="text-lg font-semibold text-gray-800 mb-2">
                      {vehicleInfo.title}
                    </h5>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Plate:</span>
                        <span className="font-medium">{vehicleInfo.plateNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium">{vehicleInfo.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Usage:</span>
                        <span className="font-medium">{vehicleInfo.usage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Engine:</span>
                        <span className="font-medium">{vehicleInfo.engineCapacity}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Added: {new Date(vehicle.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          !error && (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No vehicles found</h4>
              <p className="text-gray-500 mb-6">You haven&apos;t added any vehicles yet.</p>
              <button
                onClick={handleCreateNewVehicle}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Vehicle
              </button>
            </div>
          )
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between w-full max-w-6xl mt-8">
        <button
          onClick={() => router.back()}
          className="border border-black px-6 py-2 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <div className="text-sm text-gray-500">
          Select a vehicle to continue
        </div>
      </div>
    </div>
  );
} 