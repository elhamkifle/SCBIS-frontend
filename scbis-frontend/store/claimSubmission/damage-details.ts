import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface InjuredPerson {
  name: string;
  address: string;
}

interface DamageDetailsState {
  vehicleDesc: string;
  thirdPartyDesc: string;
  injury: boolean;
  injuredPerson: InjuredPerson;
  error: string;
  setVehicleDesc: (desc: string) => void;
  setThirdPartyDesc: (desc: string) => void;
  setInjury: (status: boolean) => void;
  setInjuredPerson: (person: Partial<InjuredPerson>) => void;
  setError: (error: string) => void;
  clearAllData: () => void;
}

export const useDamageDetailsStore = create<DamageDetailsState>()(
  persist(
    (set) => ({
      vehicleDesc: '',
      thirdPartyDesc: '',
      injury: false,
      injuredPerson: { name: '', address: '' },
      error: '',
      setVehicleDesc: (desc) => set({ vehicleDesc: desc }),
      setThirdPartyDesc: (desc) => set({ thirdPartyDesc: desc }),
      setInjury: (status) => set({ injury: status }),
      setInjuredPerson: (person) => 
        set((state) => ({ 
          injuredPerson: { ...state.injuredPerson, ...person } 
        })),
      setError: (error) => set({ error }),
      clearAllData: () => set({ 
        vehicleDesc: '',
        thirdPartyDesc: '',
        injury: false,
        injuredPerson: { name: '', address: '' },
        error: ''
      })
    }),
    {
      name: 'damage-details-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);