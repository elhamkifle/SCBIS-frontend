// store/renewalForm.ts
import { create } from 'zustand';

interface RenewalFormState {
  durationInMonths: number;
  licenseFileUrl: string;
  setDuration: (months: number) => void;
  setLicenseFileUrl: (url: string) => void;
  clearRenewalForm: () => void;
}

export const useRenewalFormStore = create<RenewalFormState>((set) => ({
  durationInMonths: 0,
  licenseFileUrl: '',
  setDuration: (months) => set({ durationInMonths: months }),
  setLicenseFileUrl: (url) => set({ licenseFileUrl: url }),
  clearRenewalForm: () => set({ durationInMonths: 0, licenseFileUrl: '' }),
}));
