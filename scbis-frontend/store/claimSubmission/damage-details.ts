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
  vehicleDamageFiles: string[]; 
  thirdPartyDamageFiles: string[]; 

  error: string;

  setvehicleDamageDesc: (desc: string) => void;
  setthirdPartyDamageDesc: (desc: string) => void;
  setinjuriesAny: (status: boolean) => void;
  setInjuredPersons: (person: Partial<InjuredPerson>) => void;

  addVehicleDamageFile: (url: string) => void; 
  removeVehicleDamageFile: (index: number) => void; 
  addThirdPartyDamageFile: (url: string) => void; 
  removeThirdPartyDamageFile: (index: number) => void; 

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
      vehicleDamageFiles: [],
      thirdPartyDamageFiles: [],
      error: '',

      setvehicleDamageDesc: (desc) => set({ vehicleDamageDesc: desc }),
      setthirdPartyDamageDesc: (desc) => set({ thirdPartyDamageDesc: desc }),
      setinjuriesAny: (status) => set({ injuriesAny: status }),
      setInjuredPersons: (person) =>
        set((state) => ({
          injuredPersons: { ...state.injuredPersons, ...person },
        })),

      addVehicleDamageFile: (url) => set({ vehicleDamageFiles: [url] }),
      removeVehicleDamageFile: (index) =>
        set((state) => {
          const updated = [...state.vehicleDamageFiles];
          updated.splice(index, 1);
          return { vehicleDamageFiles: updated };
        }),

      addThirdPartyDamageFile: (url) => set({ thirdPartyDamageFiles: [url] }),
      removeThirdPartyDamageFile: (index) =>
        set((state) => {
          const updated = [...state.thirdPartyDamageFiles];
          updated.splice(index, 1);
          return { thirdPartyDamageFiles: updated };
        }),

      setError: (error) => set({ error }),

      clearAllData: () =>
        set({
          vehicleDamageDesc: '',
          thirdPartyDamageDesc: '',
          injuriesAny: false,
          injuredPersons: { name: '', address: '' },
          vehicleDamageFiles: [],
          thirdPartyDamageFiles: [],
          error: '',
        }),
    }),
    {
      name: 'damage-details-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
