import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Witness {
  name: string;
  contact: string;
}

interface WitnessInformationState {
  aloneInVehicle: string;
  vehicleOccupants: Witness[];
  independentWitnessPresence: string;
  independentWitnesses: Witness[];
  witnessReason: string;
  setAloneInVehicle: (status: string) => void;
  addVehicleOccupant: () => void;
  updateVehicleOccupant: (index: number, field: keyof Witness, value: string) => void;
  removeVehicleOccupant: (index: number) => void;
  setIndependentWitnessPresence: (presence: string) => void;
  addIndependentWitness: () => void;
  updateIndependentWitness: (index: number, field: keyof Witness, value: string) => void;
  removeIndependentWitness: (index: number) => void;
  setWitnessReason: (reason: string) => void;
  clearAllData: () => void;
}

const initialWitness: Witness = {
  name: '',
  contact: ''
};

export const useWitnessInformationStore = create<WitnessInformationState>()(
  persist(
    (set) => ({
      aloneInVehicle: '',
      vehicleOccupants: [{ ...initialWitness }],
      independentWitnessPresence: '',
      independentWitnesses: [{ ...initialWitness }],
      witnessReason: '',
      setAloneInVehicle: (status) => set({ aloneInVehicle: status }),
      addVehicleOccupant: () => 
        set((state) => ({
          vehicleOccupants: [...state.vehicleOccupants, { ...initialWitness }]
        })),
      updateVehicleOccupant: (index, field, value) =>
        set((state) => {
          const updated = [...state.vehicleOccupants];
          updated[index][field] = value;
          return { vehicleOccupants: updated };
        }),
      removeVehicleOccupant: (index) =>
        set((state) => ({
          vehicleOccupants: state.vehicleOccupants.filter((_, i) => i !== index)
        })),
      setIndependentWitnessPresence: (presence) => 
        set({ independentWitnessPresence: presence }),
      addIndependentWitness: () => 
        set((state) => ({
          independentWitnesses: [...state.independentWitnesses, { ...initialWitness }]
        })),
      updateIndependentWitness: (index, field, value) =>
        set((state) => {
          const updated = [...state.independentWitnesses];
          updated[index][field] = value;
          return { independentWitnesses: updated };
        }),
      removeIndependentWitness: (index) =>
        set((state) => ({
          independentWitnesses: state.independentWitnesses.filter((_, i) => i !== index)
        })),
      setWitnessReason: (reason) => set({ witnessReason: reason }),
      clearAllData: () => 
        set({
          aloneInVehicle: '',
          vehicleOccupants: [{ ...initialWitness }],
          independentWitnessPresence: '',
          independentWitnesses: [{ ...initialWitness }],
          witnessReason: ''
        })
    }),
    {
      name: 'witness-information-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);