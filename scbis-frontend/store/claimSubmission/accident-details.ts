import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

interface OtherVehicle {
  driverName: string;
  driverAddress: string;
  driverPhone: string;
}

interface Location {
  city: string;
  subCity: string;
  kebele: string;
  sefer: string;
}

interface AccidentDetailsState {
  otherVehicles: OtherVehicle[];
  dateOfAccident: string;
  timeOfAccident: string;
  speed: number;
  location: Location;
  positionOnRoad: string;
  roadSurface: string;
  trafficCondition: string;
  additionalDescription: string;
  timeOfDay: string;
  hornSounded: string;
  headlightsOn: string;
  wereYouInVehicle: string;
  visibilityObstructions: string;
  intersectionType: string;
  error: string;
  addVehicle: () => void;
  removeVehicle: (index: number) => void;
  updateVehicle: (index: number, data: Partial<OtherVehicle>) => void;
  setpositionOnRoad: (positionOnRoad: string) => void;
  setRoadSurface: (roadsurface: string) => void;
  setTrafficCondition: (trafficCondition: string) => void;
  setadditionalDescription: (description: string) => void;
  setTimeOfDay: (timeOfDay: string) => void;
  sethornSounded: (hornSounded: string) => void;
  setdateOfAccident: (dateOfAccident: string) => void;
  settimeOfAccident: (timeOfAccident: string) => void;
  setspeed: (speed: number) => void;
  setlocation: (location: Location) => void;
  setHeadlightsOn: (status: string) => void;
  setwereYouInVehicle: (wereYouInVehicle: string) => void;
  setVisibilityObstructions: (obstruction: string) => void;
  setintersectionType: (location: string) => void;
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
      positionOnRoad: '',
      roadSurface: '',
      trafficCondition: '',
      additionalDescription: '',
      timeOfDay: '',
      hornSounded: '',
      headlightsOn: '',
      wereYouInVehicle: '',
      visibilityObstructions: '',
      intersectionType: '',
      dateOfAccident: '',
      timeOfAccident: '',
      speed: 0,
      location: {
        city: '',
        subCity: '',
        kebele: '',
        sefer: ''
      },      
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
      setdateOfAccident: (dateOfAccident) => set({ dateOfAccident }),
      settimeOfAccident: (timeOfAccident) => set({ timeOfAccident }),
      setspeed: (speed) => set({ speed }),
      setlocation: (location) => set({ location }),
      setpositionOnRoad: (positionOnRoad) => set({ positionOnRoad }),
      setRoadSurface: (roadSurface) => set({ roadSurface }),
      setTrafficCondition: (trafficCondition) => set({ trafficCondition }),
      setadditionalDescription: (additionalDescription) => set({ additionalDescription }),
      setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
      sethornSounded: (hornSounded) => set({hornSounded}), 
      setHeadlightsOn: (headlightsOn) => set({ headlightsOn }),
      setwereYouInVehicle: (wereYouInVehicle) => set({wereYouInVehicle}),
      setVisibilityObstructions: (visibilityObstructions) => set({ visibilityObstructions }),
      setintersectionType: (intersectionType) => set({ intersectionType }),
      setError: (error) => set({ error }),
      clearAllData: () => 
        set({ 
          otherVehicles: [{ ...initialOtherVehicle }],
          positionOnRoad: '',
          roadSurface: '',
          trafficCondition: '',
          additionalDescription: '',
          timeOfDay: '',
          hornSounded: '',
          headlightsOn: '',
          wereYouInVehicle: '',
          visibilityObstructions: '',
          intersectionType: '',
          dateOfAccident: '',
          timeOfAccident: '',
          speed: 0,
          location: {
            city: '',
            subCity: '',
            kebele: '',
            sefer: ''
          },
          error: ''
        })      
    }),
    {
      name: 'accident-details-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);