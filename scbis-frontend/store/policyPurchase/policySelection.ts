import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
type PolicyStore = {
  selectedPolicy: string | null;
  error: string | null;
  selectPolicy: (policy: string) => void;
  setError: (error: string) => void;
  resetPolicy: () => void;
};

const initialState: PolicyStore = {
  selectedPolicy: null,
  error: null,
  selectPolicy: (policy) => {},
  setError: (error) => {},
  resetPolicy: () => {},
};

export const usePolicyStore = create<PolicyStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      selectPolicy: (policy) => {
        set({ selectedPolicy: policy });
      },
      setError: (error) => {
        set({ error });
      },
      resetPolicy: () => {
        set({ selectedPolicy: null, error: null });
      },
    }),
    {
      name: 'policy-selection-storage', // LocalStorage key to persist state
    }
  )
);
