import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

interface OtherVehicle {
  driverName: string;
  driverAddress: string;
  driverPhone: string;
}

interface AccidentDetailsState {
  otherVehicles: OtherVehicle[];
  position: string;
  roadSurface: string;
  trafficCondition: string;
  description: string;
  timeOfDay: string;
  headlightsOn: string;
  visibilityObstructions: string;
  accidentLocation: string;
  error: string;
  addVehicle: () => void;
  removeVehicle: (index: number) => void;
  updateVehicle: (index: number, data: Partial<OtherVehicle>) => void;
  setPosition: (position: string) => void;
  setRoadSurface: (surface: string) => void;
  setTrafficCondition: (condition: string) => void;
  setDescription: (description: string) => void;
  setTimeOfDay: (time: string) => void;
  setHeadlightsOn: (status: string) => void;
  setVisibilityObstructions: (obstruction: string) => void;
  setAccidentLocation: (location: string) => void;
  setError: (error: string) => void;
  clearAllData: () => void;
}

const initialOtherVehicle: OtherVehicle = {
  driverName: '',
  driverAddress: '',
  driverPhone: ''
};

// Custom storage implementation with proper typing
const storage: StateStorage = {
  getItem: (name: string): string | null => {
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    localStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  }
};

export const useAccidentDetailsStore = create<AccidentDetailsState>()(
  persist(
    (set) => ({
      otherVehicles: [{ ...initialOtherVehicle }],
      position: '',
      roadSurface: '',
      trafficCondition: '',
      description: '',
      timeOfDay: '',
      headlightsOn: '',
      visibilityObstructions: '',
      accidentLocation: '',
      error: '',
      addVehicle: () => 
        set((state) => ({ 
          otherVehicles: [...state.otherVehicles, { ...initialOtherVehicle }] 
        })),
      removeVehicle: (index) => 
        set((state) => ({ 
          otherVehicles: state.otherVehicles.filter((_, i) => i !== index) 
        })),
      updateVehicle: (index, data) => 
        set((state) => {
          const updatedVehicles = [...state.otherVehicles];
          updatedVehicles[index] = { ...updatedVehicles[index], ...data };
          return { otherVehicles: updatedVehicles };
        }),
      setPosition: (position) => set({ position }),
      setRoadSurface: (roadSurface) => set({ roadSurface }),
      setTrafficCondition: (trafficCondition) => set({ trafficCondition }),
      setDescription: (description) => set({ description }),
      setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
      setHeadlightsOn: (headlightsOn) => set({ headlightsOn }),
      setVisibilityObstructions: (visibilityObstructions) => set({ visibilityObstructions }),
      setAccidentLocation: (accidentLocation) => set({ accidentLocation }),
      setError: (error) => set({ error }),
      clearAllData: () => 
        set({ 
          otherVehicles: [{ ...initialOtherVehicle }],
          position: '',
          roadSurface: '',
          trafficCondition: '',
          description: '',
          timeOfDay: '',
          headlightsOn: '',
          visibilityObstructions: '',
          accidentLocation: '',
          error: ''
        })
    }),
    {
      name: 'accident-details-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);