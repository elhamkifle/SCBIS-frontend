import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ClaimDisclaimerState {
  agreed: boolean;
  setAgreed: (agreed: boolean) => void;
  clearAllData: () => void;
}

export const useClaimDisclaimerStore = create<ClaimDisclaimerState>()(
  persist(
    (set) => ({
      agreed: false,
      setAgreed: (agreed) => set({ agreed }),
      clearAllData: () => set({ agreed: false }),
    }),
    {
      name: 'claim-disclaimer-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);