import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PersonalDetail = {
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  email: string;
  phone: string;
  tin: string;
};

type PersonalDetailStore = {
  formData: PersonalDetail;
  updateFormData: (data: Partial<PersonalDetail>) => void;
  resetForm: () => void;
  clearStorage: () => void; // New method for complete clearing
  logFormData: () => void;
};

const initialState: PersonalDetail = {
  title: '',
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  nationality: '',
  email: '',
  phone: '',
  tin: '',
};

export const usePersonalDetailStore = create<PersonalDetailStore>()(
  persist(
    (set, get) => ({
      formData: initialState,
      
      updateFormData: (data) => {
        set((state) => ({ 
          formData: { ...state.formData, ...data } 
        }));
        console.log('Updated personal details:', { ...get().formData, ...data });
      },
      
      resetForm: () => set({ formData: initialState }),
      
      // New method that completely clears localStorage
      clearStorage: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('personal-details-storage');
        }
        set({ formData: initialState });
      },
      
      logFormData: () => {
        console.log('Current personal details:', get().formData);
      },
    }),
    {
      name: 'personal-details-storage',
    }
  )
);