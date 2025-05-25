import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type CommercialVehicleState = {
  selectedCategories: {
    [key: string]: boolean;
  };
  toggleCategory: (category: string) => void;
  clearSelection: () => void;
};

export const useCommercialVehicleCategoryStore = create<CommercialVehicleState>()(
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
      name: 'commercial-vehicle-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);