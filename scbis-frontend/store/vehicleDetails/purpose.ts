import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type VehiclePurposeState = {
  selectedType: string;
  setSelectedType: (type: string) => void;
  clearSelection: () => void;
};

export const useVehiclePurposeStore = create<VehiclePurposeState>()(
  persist(
    (set) => ({
      selectedType: '',
      setSelectedType: (type) => set({ selectedType: type }),
      clearSelection: () => set({ selectedType: '' }),
    }),
    {
      name: 'insurance-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);