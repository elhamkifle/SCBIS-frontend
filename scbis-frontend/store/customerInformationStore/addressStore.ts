import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
type AddressDetails = {
  country: string;
  state: string;
  city: string;
  subcity: string;
  zone: string;
  wereda: string;
  kebele: string;
  houseNo: string;
};

type AddressStore = {
  currentStep: number;
  address: AddressDetails;
  updateAddress: (data: Partial<AddressDetails>) => void;
  nextStep: () => void;
  prevStep: () => void;
  logState: () => void; // For debugging
};

const initialAddressState: AddressDetails = {
  country: '',
  state: '',
  city: '',
  subcity: '',
  zone: '',
  wereda: '',
  kebele: '',
  houseNo: '',
};

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      address: initialAddressState,
      updateAddress: (data) => {
        set((state) => ({ 
          address: { ...state.address, ...data } 
        }));
        console.log('Updated address data:', { ...get().address, ...data });
      },
      nextStep: () => {
        const newStep = get().currentStep + 1;
        set({ currentStep: newStep });
        console.log('Moving to step:', newStep);
      },
      prevStep: () => {
        const newStep = get().currentStep - 1;
        set({ currentStep: newStep });
        console.log('Moving to step:', newStep);
      },
      logState: () => {
        console.log('Current form state:', get());
      },
    }),
    {
      name: 'multi-step-form-storage',
    }
  )
);