import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DriverDetails {
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  subCity: string;
  kebele: string;
  phoneNumber: string;
  licenseNo: string;
  grade: string;
  expirationDate: string;
}

interface DriverDetailsState {
  isDriverSameAsInsured: boolean | null;
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
  age: 0,
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
      isDriverSameAsInsured: null,
      agreed: false,
      formData: initialFormData,
      setDriverSame: (value) => set({ isDriverSameAsInsured: value }),
      setAgreed: (value) => set({ agreed: value }),
      updateFormData: (data) => 
        set((state) => ({ 
          formData: { ...state.formData, ...data } 
        })),
      clearAllData: () => set({ 
        isDriverSameAsInsured: null, 
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