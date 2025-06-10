import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Policy {
  title: string;
  coverageEndDate: string;
  territory: string;
  duration: string;
}

interface ClaimPolicyState {
  policies: Policy[];
  selectedPolicy: string | null;
  addPolicy: (policy: Policy) => void;
  removePolicy: (title: string) => void;
  selectPolicy: (title: string) => void;
  clearSelection: () => void;
  clearAllData: () => void;
}

const initialPolicies: Policy[] = [
  {
    title: 'Third Party',
    coverageEndDate: '2023-12-31',
    territory: 'Ethiopia',
    duration: '1 Year',
  },
  {
    title: 'Own Damage',
    coverageEndDate: '2024-06-30',
    territory: 'Ethiopia',
    duration: '6 Months',
  },
];

export const useClaimPolicyStore = create<ClaimPolicyState>()(
  persist(
    (set) => ({
      policies: initialPolicies,
      selectedPolicy: null,
      addPolicy: (policy) => set((state) => ({ policies: [...state.policies, policy] })),
      removePolicy: (title) => 
        set((state) => ({ 
          policies: state.policies.filter(p => p.title !== title),
          selectedPolicy: state.selectedPolicy === title ? null : state.selectedPolicy
        })),
      selectPolicy: (title) => set({ selectedPolicy: title }),
      clearSelection: () => set({ selectedPolicy: null }),
      clearAllData: () => set({ policies: initialPolicies, selectedPolicy: null }),
    }),
    {
      name: 'claim-policy-selection-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        policies: state.policies,
        selectedPolicy: state.selectedPolicy
      }),
    }
  )
);