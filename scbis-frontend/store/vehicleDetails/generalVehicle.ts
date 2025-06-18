import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type VehicleDetails = {
  make: string;
  model: string;
  mfgYear: string;
  engineCapacity: string;
  chassisNo: string;
  engineNo: string;
  plateNo: string;
  bodyType: string;
};

type GeneralVehicleState = {
  formData: VehicleDetails;
  setFormData: (data: Partial<VehicleDetails>) => void;
  clearFormData: () => void;
  logFormData: () => void;
};

export const useGeneralVehicleStore = create<GeneralVehicleState>()(
  persist(
    (set, get) => ({
      formData: {
        make: '',
        model: '',
        mfgYear: '',
        engineCapacity: '',
        chassisNo: '',
        engineNo: '',
        plateNo: '',
        bodyType: '',
      },
      setFormData: (data) => 
        set((state) => ({ formData: { ...state.formData, ...data } })),
      clearFormData: () => 
        set({ 
          formData: {
            make: '',
            model: '',
            mfgYear: '',
            engineCapacity: '',
            chassisNo: '',
            engineNo: '',
            plateNo: '',
            bodyType: '',
          }
        }),
      logFormData: () => {
      },
    }),
    {
      name: 'general-vehicle-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);