import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type CommercialVehicleTwoState = {
  selectedCategories: {
    [key: string]: boolean;
  };
  toggleCategory: (category: string) => void;
  clearSelection: () => void;
};

export const useCommercialVehicleTwoStore = create<CommercialVehicleTwoState>()(
  persist(
    (set, get) => ({
      selectedCategories: {},
      toggleCategory: (category) => 
        set((state) => ({
          selectedCategories: {
            ...state.selectedCategories,
            [category]: !state.selectedCategories[category]
          }
        })),
      clearSelection: () => set({ selectedCategories: {} }),
    }),
    {
      name: 'commercial-vehicle-two-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);