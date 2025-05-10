import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface InjuredPerson {
  name: string;
  address: string;
}

interface DamageDetailsState {
  vehicleDamageDesc: string;
  thirdPartyDamageDesc: string;
  injuriesAny: boolean;
  injuredPersons: InjuredPerson;
  error: string;
  setvehicleDamageDesc: (desc: string) => void;
  setthirdPartyDamageDesc: (desc: string) => void;
  setinjuriesAny: (status: boolean) => void;
  setInjuredPersons: (person: Partial<InjuredPerson>) => void;
  setError: (error: string) => void;
  clearAllData: () => void;
}

export const useDamageDetailsStore = create<DamageDetailsState>()(
  persist(
    (set) => ({
      vehicleDamageDesc: '',
      thirdPartyDamageDesc: '',
      injuriesAny: false,
      injuredPersons: { name: '', address: '' },
      error: '',
      setvehicleDamageDesc: (desc) => set({ vehicleDamageDesc: desc }),
      setthirdPartyDamageDesc: (desc) => set({ thirdPartyDamageDesc: desc }),
      setinjuriesAny: (status) => set({ injuriesAny: status }),
      setInjuredPersons: (person) => 
        set((state) => ({ 
          injuredPersons: { ...state.injuredPersons, ...person } 
        })),
      setError: (error) => set({ error }),
      clearAllData: () => set({ 
        vehicleDamageDesc: '',
        thirdPartyDamageDesc: '',
        injuriesAny: false,
        injuredPersons: { name: '', address: '' },
        error: ''
      })
    }),
    {
      name: 'damage-details-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);