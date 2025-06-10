import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DriverInfo = {
  driverLicenseGrade: string;
  driverName: string;
  drivingExperience: string;
};

type FormData = {
  employDriver: string;
  drivers: DriverInfo[];
  employDriverUnder21: string;
  physicalInfirmity: string;
  lessThanSixMonthsExperience: string;
  fullName: string;
  signatureDate: string;
  acceptTerms: boolean;
};

type DriverInformationStore = {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  updateDriver: (index: number, data: Partial<DriverInfo>) => void;
  addDriver: () => void;
  removeDriver: (index: number) => void;
  clearFormData: () => void;
};

const initialState: FormData = {
  employDriver: '',
  drivers: [{ driverLicenseGrade: '', driverName: '', drivingExperience: '' }],
  employDriverUnder21: '',
  physicalInfirmity: '',
  lessThanSixMonthsExperience: '',
  fullName: '',
  signatureDate: '',
  acceptTerms: false,
};

export const useDriverInformationStore = create<DriverInformationStore>()(
  persist(
    (set) => ({
      formData: initialState,
      updateFormData: (data) =>
        set((state) => ({ formData: { ...state.formData, ...data } })),
      updateDriver: (index, data) =>
        set((state) => {
          const updatedDrivers = [...state.formData.drivers];
          updatedDrivers[index] = { ...updatedDrivers[index], ...data };
          return { formData: { ...state.formData, drivers: updatedDrivers } };
        }),
      addDriver: () =>
        set((state) => ({
          formData: {
            ...state.formData,
            drivers: [
              ...state.formData.drivers,
              { driverLicenseGrade: '', driverName: '', drivingExperience: '' },
            ],
          },
        })),
      removeDriver: (index) =>
        set((state) => ({
          formData: {
            ...state.formData,
            drivers: state.formData.drivers.filter((_, i) => i !== index),
          },
        })),
      clearFormData: () => set({ formData: initialState }),
    }),
    {
      name: 'driver-information-storage',
    }
  )
);
