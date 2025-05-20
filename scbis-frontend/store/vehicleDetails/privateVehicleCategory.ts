import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type PrivateVehicleState = {
  carType: string;
  usageType: string;
  error: boolean;
  setCarType: (type: string) => void;
  setUsageType: (type: string) => void;
  setError: (error: boolean) => void;
  logSelection: () => void;
  clearSelection: () => void;
};

export const usePrivateVehicleCategoryStore = create<PrivateVehicleState>()(
  persist(
    (set, get) => ({
      carType: '',
      usageType: '', // Added to initial state
      error: false,
      setCarType: (type) => set({ carType: type }),
      setUsageType: (type) => set({ usageType: type }), // Added setter
      setError: (error) => set({ error }),
      logSelection: () => {
        const { carType, usageType } = get();
        console.log('Current selection:', { carType, usageType });
      },
      clearSelection: () => set({ 
        carType: '', 
        usageType: '', // Added to clear
        error: false 
      }),
    }),
    {
      name: 'private-vehicle-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);