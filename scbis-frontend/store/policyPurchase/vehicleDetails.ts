import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type VehicleInfo = {
  coverRequired: string;
  make: string;
  value: string;
  vehicleInGoodRepair: string;
  vehicleLeftOvernight: string;
  soleProperty: string;
  ownerName: string;
  ownerAddress: string;
  privateUse: string;
  otherUses: string;
  convicted: string;
  convictionDetails: string;
  insuredBefore: string;
  insurerName: string;
  companyHistory: string[];
  hadAccidents: string;
  accidentDetails: string;
  claimsInjury: string;
  claimsInjuryDetails: string;
  claimsProperty: string;
  claimsPropertyDetails: string;
  personalAccident: string;
  passengersInsured: string;
};

type VehicleInfoStore = {
  formData: VehicleInfo;
  updateFormData: (data: Partial<VehicleInfo>) => void;
  updateCompanyHistory: (value: string, checked: boolean) => void;
  resetForm: () => void;
  clearStorage: () => void;
};

const initialState: VehicleInfo = {
  coverRequired: '',
  make: '',
  value: '',
  vehicleInGoodRepair: '',
  vehicleLeftOvernight: '',
  soleProperty: '',
  ownerName: '',
  ownerAddress: '',
  privateUse: '',
  otherUses: '',
  convicted: '',
  convictionDetails: '',
  insuredBefore: '',
  insurerName: '',
  companyHistory: [],
  hadAccidents: '',
  accidentDetails: '',
  claimsInjury: '',
  claimsInjuryDetails: '',
  claimsProperty: '',
  claimsPropertyDetails: '',
  personalAccident: '',
  passengersInsured: '',
};

export const useVehicleInfoStore = create<VehicleInfoStore>()(
  persist(
    (set, get) => ({
      formData: initialState,
      
      updateFormData: (data) => {
        set((state) => ({ 
          formData: { ...state.formData, ...data } 
        }));
      },
      
      updateCompanyHistory: (value, checked) => {
        set((state) => ({
          formData: {
            ...state.formData,
            companyHistory: checked
              ? [...state.formData.companyHistory, value]
              : state.formData.companyHistory.filter((item) => item !== value)
          }
        }));
      },
      
      resetForm: () => set({ formData: initialState }),
      
      clearStorage: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('vehicle-info-storage');
        }
        set({ formData: initialState });
      },
    }),
    {
      name: 'vehicle-info-storage',
    }
  )
);