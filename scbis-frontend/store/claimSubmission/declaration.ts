import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DeclarationState {
  driverName: string;
  insuredName: string;
  date: string;
  agreed: boolean;
  setDriverName: (name: string) => void;
  setInsuredName: (name: string) => void;
  setDate: (date: string) => void;
  setAgreed: (agreed: boolean) => void;
  clearAllData: () => void;
}

export const useDeclarationStore = create<DeclarationState>()(
  persist(
    (set) => ({
      driverName: '',
      insuredName: '',
      date: '',
      agreed: false,
      setDriverName: (name) => set({ driverName: name }),
      setInsuredName: (name) => set({ insuredName: name }),
      setDate: (date) => set({ date }),
      setAgreed: (agreed) => set({ agreed }),
      clearAllData: () => set({ 
        driverName: '',
        insuredName: '',
        date: '',
        agreed: false
      })
    }),
    {
      name: 'declaration-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);