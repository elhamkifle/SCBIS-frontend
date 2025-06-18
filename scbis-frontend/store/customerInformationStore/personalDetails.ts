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
  originalData: PersonalDetail; // Track original data to detect changes
  isDataModified: boolean;
  updateFormData: (data: Partial<PersonalDetail>) => void;
  setOriginalData: (data: PersonalDetail) => void; // Set initial data from user profile
  checkIfModified: () => boolean; // Check if current data differs from original
  resetForm: () => void;
  clearStorage: () => void;
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
      originalData: initialState,
      isDataModified: false,
      
      updateFormData: (data) => {
        set((state) => {
          const newFormData = { ...state.formData, ...data };
          const isModified = JSON.stringify(newFormData) !== JSON.stringify(state.originalData);
          return { 
            formData: newFormData,
            isDataModified: isModified
          };
        });
      },

      setOriginalData: (data) => {
        set({ 
          originalData: data,
          formData: data,
          isDataModified: false
        });
      },

      checkIfModified: () => {
        const state = get();
        return JSON.stringify(state.formData) !== JSON.stringify(state.originalData);
      },
      
      resetForm: () => set({ 
        formData: initialState,
        originalData: initialState,
        isDataModified: false
      }),
      
      clearStorage: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('personal-details-storage');
        }
        set({ 
          formData: initialState,
          originalData: initialState,
          isDataModified: false
        });
      },
      
      logFormData: () => {
      },
    }),
    {
      name: 'personal-details-storage',
    }
  )
);