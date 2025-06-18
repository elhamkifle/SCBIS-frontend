import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VehicleDocumentsState {
  driversLicense: string | null;
  vehicleLibre: string | null;
  setDriversLicense: (url: string | null) => void;
  setVehicleLibre: (url: string | null) => void;
  clearDocuments: () => void;
}

export const useVehicleDocumentsStore = create<VehicleDocumentsState>()(
  persist(
    (set) => ({
      driversLicense: null,
      vehicleLibre: null,
      setDriversLicense: (url: string | null) => set({ driversLicense: url }),
      setVehicleLibre: (url: string | null) => set({ vehicleLibre: url }),
      clearDocuments: () => set({ driversLicense: null, vehicleLibre: null }),
    }),
    {
      name: 'vehicle-documents-storage',
    }
  )
); 