import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type OwnershipUsageData = {
  ownerType: string;
  driverType: string;
  seatingCapacity: string;
  purchasedValue: string;
  dutyFree: string;
};

type OwnershipUsageState = {
  formData: OwnershipUsageData;
  setFormData: (data: Partial<OwnershipUsageData>) => void;
  clearFormData: () => void;
  logFormData: () => void;
};

export const useOwnershipUsageStore = create<OwnershipUsageState>()(
  persist(
    (set, get) => ({
      formData: {
        ownerType: '',
        driverType: '',
        seatingCapacity: '',
        purchasedValue: '',
        dutyFree: '',
      },
      setFormData: (data) => 
        set((state) => ({ formData: { ...state.formData, ...data } })),
      clearFormData: () => 
        set({ 
          formData: {
            ownerType: '',
            driverType: '',
            seatingCapacity: '',
            purchasedValue: '',
            dutyFree: '',
          }
        }),
      logFormData: () => {
      },
    }),
    {
      name: 'ownership-usage-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);