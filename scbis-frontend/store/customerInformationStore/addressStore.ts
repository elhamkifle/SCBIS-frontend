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
  address: AddressDetails;
  updateAddress: (data: Partial<AddressDetails>) => void;
  resetAddress: () => void; // Method to reset address state
  logAddressData: () => void; // For debugging
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
      address: initialAddressState,
      
      // Method to update address state
      updateAddress: (data) => {
        set((state) => ({ 
          address: { ...state.address, ...data } 
        }));
        console.log('Updated address data:', { ...get().address, ...data });
      },

      // Method to reset address state
      resetAddress: () => set({ address: initialAddressState }),

      // Method for logging address state (for debugging purposes)
      logAddressData: () => {
        console.log('Current address state:', get().address);
      },
    }),
    {
      name: 'address-details-storage', // Persist the state in localStorage with this key
    }
  )
);
