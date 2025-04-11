// store/policyStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PolicyStore = {
  selectedPolicy: string;
  error: string;
  selectPolicy: (policy: string) => void;
  setError: (error: string) => void;
  reset: () => void;
  logSelection: () => void; // For debugging
};

export const usePolicyStore = create<PolicyStore>()(
  persist(
    (set, get) => ({
      selectedPolicy: '',
      error: '',
      selectPolicy: (policy) => {
        set({ selectedPolicy: policy, error: '' });
        console.log('Policy selected:', policy);
      },
      setError: (error) => set({ error }),
      reset: () => set({ selectedPolicy: '', error: '' }),
      logSelection: () => {
        console.log('Current policy selection:', get().selectedPolicy);
      },
    }),
    {
      name: 'policy-selection-storage',
    }
  )
);