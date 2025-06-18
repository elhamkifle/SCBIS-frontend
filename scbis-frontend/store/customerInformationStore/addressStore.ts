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
  originalAddress: AddressDetails; // Track original data to detect changes
  isDataModified: boolean;
  updateAddress: (data: Partial<AddressDetails>) => void;
  setOriginalAddress: (data: AddressDetails) => void; // Set initial data from user profile
  checkIfModified: () => boolean; // Check if current data differs from original
  resetAddress: () => void;
  logAddressData: () => void;
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
      originalAddress: initialAddressState,
      isDataModified: false,
      
      // Method to update address state
      updateAddress: (data) => {
        set((state) => {
          const newAddress = { ...state.address, ...data };
          const isModified = JSON.stringify(newAddress) !== JSON.stringify(state.originalAddress);
          return { 
            address: newAddress,
            isDataModified: isModified
          };
        });
      },

      // Method to set original address data from user profile
      setOriginalAddress: (data) => {
        set({ 
          originalAddress: data,
          address: data,
          isDataModified: false
        });
      },

      // Method to check if address has been modified
      checkIfModified: () => {
        const state = get();
        return JSON.stringify(state.address) !== JSON.stringify(state.originalAddress);
      },

      // Method to reset address state
      resetAddress: () => set({ 
        address: initialAddressState,
        originalAddress: initialAddressState,
        isDataModified: false
      }),

      // Method for logging address state (for debugging purposes)
      logAddressData: () => {
      },
    }),
    {
      name: 'address-details-storage', // Persist the state in localStorage with this key
    }
  )
);
