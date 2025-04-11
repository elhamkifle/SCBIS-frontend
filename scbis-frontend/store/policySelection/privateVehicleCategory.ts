import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PrivateVehicleCategoryStore = {
  carType: string;
  usageType: 'personal' | 'business' | '';
  error: boolean;
  setCarType: (type: string) => void;
  setUsageType: (type: 'personal' | 'business') => void;
  setError: (error: boolean) => void;
  reset: () => void;
  logSelection: () => void;
};

export const usePrivateVehicleCategoryStore = create<PrivateVehicleCategoryStore>()(
  persist(
    (set, get) => ({
      carType: '',
      usageType: '',
      error: false,
      
      setCarType: (type) => {
        set({ carType: type, error: false });
        console.log('Vehicle type selected:', type);
      },
      
      setUsageType: (type) => {
        set({ usageType: type });
        console.log('Usage type selected:', type);
      },
      
      setError: (error) => set({ error }),
      
      reset: () => set({ 
        carType: '', 
        usageType: '',
        error: false 
      }),
      
      logSelection: () => {
        console.log('Current vehicle selection:', {
          carType: get().carType,
          usageType: get().usageType
        });
      },
    }),
    {
      name: 'vehicle-selection-storage',
    }
  )
);