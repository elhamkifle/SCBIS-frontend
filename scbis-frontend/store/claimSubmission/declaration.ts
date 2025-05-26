import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DeclarationState {
  driverFullName: string;
  insuredFullName: string;
  signatureDate: string;
  agreedToDeclaration: boolean;
  setdriverFullName: (name: string) => void;
  setinsuredFullName: (name: string) => void;
  setsignatureDate: (date: string) => void;
  setagreedToDeclaration: (agreedToDeclaration: boolean) => void;
  clearAllData: () => void;
}

export const useDeclarationStore = create<DeclarationState>()(
  persist(
    (set) => ({
      driverFullName: '',
      insuredFullName: '',
      signatureDate: '',
      agreedToDeclaration: false,
      setdriverFullName: (name) => set({ driverFullName: name }),
      setinsuredFullName: (name) => set({ insuredFullName: name }),
      setsignatureDate: (signatureDate) => set({ signatureDate }),
      setagreedToDeclaration: (agreedToDeclaration) => set({ agreedToDeclaration }),
      clearAllData: () => set({ 
        driverFullName: '',
        insuredFullName: '',
        signatureDate: '',
        agreedToDeclaration: false
      })
    }),
    {
      name: 'declaration-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);