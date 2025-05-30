import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Vehicle data type based on API response
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
  commercialVehicle?: any; // Add if needed
  createdAt: string;
  updatedAt: string;
}

interface VehicleSelectionState {
  selectedVehicleId: string | null;
  isExistingVehicle: boolean;
  vehicleData: VehicleData | null;
  vehicles: VehicleData[];
  isLoading: boolean;
  error: string | null;
}

interface VehicleSelectionActions {
  setSelectedVehicle: (vehicleId: string, vehicleData: VehicleData) => void;
  setCreateNewVehicle: () => void;
  setVehicles: (vehicles: VehicleData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSelection: () => void;
  clearAll: () => void;
}

const initialState: VehicleSelectionState = {
  selectedVehicleId: null,
  isExistingVehicle: false,
  vehicleData: null,
  vehicles: [],
  isLoading: false,
  error: null,
};

export const useVehicleSelectionStore = create<VehicleSelectionState & VehicleSelectionActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSelectedVehicle: (vehicleId: string, vehicleData: VehicleData) => {
        console.log('🚗 Vehicle selected:', { vehicleId, vehicleData });
        set({
          selectedVehicleId: vehicleId,
          isExistingVehicle: true,
          vehicleData: vehicleData,
          error: null,
        });
      },

      setCreateNewVehicle: () => {
        console.log('🆕 Create new vehicle selected');
        set({
          selectedVehicleId: null,
          isExistingVehicle: false,
          vehicleData: null,
          error: null,
        });
      },

      setVehicles: (vehicles: VehicleData[]) => {
        console.log(`📋 Setting ${vehicles.length} vehicles in store`);
        set({ vehicles });
      },

      setLoading: (loading: boolean) => {
        console.log(`⏳ Loading state: ${loading}`);
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        console.log(`❌ Error state: ${error}`);
        set({ error, isLoading: false });
      },

      clearSelection: () => {
        console.log('🧹 Clearing vehicle selection');
        set({
          selectedVehicleId: null,
          isExistingVehicle: false,
          vehicleData: null,
          error: null,
        });
      },

      clearAll: () => {
        console.log('🧹 Clearing all vehicle selection data');
        set(initialState);
      },
    }),
    {
      name: 'vehicle-selection-storage',
      partialize: (state) => ({
        selectedVehicleId: state.selectedVehicleId,
        isExistingVehicle: state.isExistingVehicle,
        vehicleData: state.vehicleData,
      }),
    }
  )
); 