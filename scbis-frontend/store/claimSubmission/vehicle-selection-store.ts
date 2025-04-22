import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

interface Vehicle {
  title: string;
  plateNo: string;
  purpose: string;
  yearOfManufacture: string;
}

interface VehicleSelectionState {
  vehicles: Vehicle[];
  selectedVehicle: string | null;
  addVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (title: string) => void;
  selectVehicle: (title: string) => void;
  clearSelection: () => void;
  clearAllData: () => void;
}

const initialVehicles: Vehicle[] = [
  {
    title: 'Vehicle 1',
    plateNo: '1122',
    purpose: 'Private',
    yearOfManufacture: '1999',
  },
  {
    title: 'Vehicle 2',
    plateNo: '3344',
    purpose: 'Commercial',
    yearOfManufacture: '2005',
  },
  {
    title: 'Vehicle 3',
    plateNo: '5566',
    purpose: 'Private',
    yearOfManufacture: '2010',
  },
];

export const useVehicleSelectionStore = create<VehicleSelectionState>()(
  persist(
    (set) => ({
      vehicles: initialVehicles,
      selectedVehicle: null,
      addVehicle: (vehicle) => set((state) => ({ vehicles: [...state.vehicles, vehicle] })),
      removeVehicle: (title) => 
        set((state) => ({ 
          vehicles: state.vehicles.filter(v => v.title !== title),
          selectedVehicle: state.selectedVehicle === title ? null : state.selectedVehicle
        })),
      selectVehicle: (title) => set({ selectedVehicle: title }),
      clearSelection: () => set({ selectedVehicle: null }),
      clearAllData: () => set({ vehicles: initialVehicles, selectedVehicle: null }),
    }),
    {
      name: 'vehicle-selection-storage', 
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({ 
        vehicles: state.vehicles,
        selectedVehicle: state.selectedVehicle
      }), 
    }
  )
);