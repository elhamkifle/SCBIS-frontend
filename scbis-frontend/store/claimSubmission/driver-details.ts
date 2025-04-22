import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DriverDetails {
  firstName: string;
  lastName: string;
  age: string;
  city: string;
  subCity: string;
  kebele: string;
  phoneNumber: string;
  licenseNo: string;
  grade: string;
  expirationDate: string;
}

interface DriverDetailsState {
  isDriverSame: boolean | null;
  agreed: boolean;
  formData: DriverDetails;
  setDriverSame: (value: boolean | null) => void;
  setAgreed: (value: boolean) => void;
  updateFormData: (data: Partial<DriverDetails>) => void;
  clearAllData: () => void;
}

const initialFormData: DriverDetails = {
  firstName: '',
  lastName: '',
  age: '',
  city: '',
  subCity: '',
  kebele: '',
  phoneNumber: '',
  licenseNo: '',
  grade: '',
  expirationDate: '',
};

export const useDriverDetailsStore = create<DriverDetailsState>()(
  persist(
    (set) => ({
      isDriverSame: null,
      agreed: false,
      formData: initialFormData,
      setDriverSame: (value) => set({ isDriverSame: value }),
      setAgreed: (value) => set({ agreed: value }),
      updateFormData: (data) => 
        set((state) => ({ 
          formData: { ...state.formData, ...data } 
        })),
      clearAllData: () => set({ 
        isDriverSame: null, 
        agreed: false, 
        formData: initialFormData 
      }),
    }),
    {
      name: 'driver-details-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);