// store/policyPurchase/durationJurisdiction.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DurationJurisdictionState = {
  policyDuration: string;
  jurisdiction: string;
  // Add any other fields needed for duration/jurisdiction
};

type DurationJurisdictionActions = {
  updateFormData: (data: Partial<DurationJurisdictionState>) => void;
  resetFormData: () => void;
};

const initialState: DurationJurisdictionState = {
  policyDuration: '',
  jurisdiction: '',
  // Initialize other fields here
};

export const usePolicyDurationStore = create<DurationJurisdictionState & DurationJurisdictionActions>()(
  persist(
    (set) => ({
      ...initialState,
      
      updateFormData: (data) => set((state) => ({ ...state, ...data })),
      
      resetFormData: () => set(initialState),
    }),
    {
      name: 'duration-jurisdiction-storage', // Unique name for localStorage
    }
  )
);