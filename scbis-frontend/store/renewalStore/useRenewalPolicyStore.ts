// store/renewalPolicies.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Policy {
  _id: string;
  policyId: string;
  policyType: string;
  status: 'Active' | 'Expired' | 'Pending' | string;
  createdAt: string;
  coverageArea?: string;
  isRenewal?: boolean;
}

interface RenewalPoliciesState {
  policies: Policy[];
  setPolicies: (policies: Policy[]) => void;
  clearPolicies: () => void;
}

export const useRenewalPoliciesStore = create<RenewalPoliciesState>()(
  persist(
    (set) => ({
      policies: [],
      setPolicies: (policies) => set({ policies }),
      clearPolicies: () => set({ policies: [] }),
    }),
    {
      name: 'renewal-policies-storage',
    }
  )
);
