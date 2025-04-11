import { create } from 'zustand';

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

export const usePersonalDetailStore = create<PersonalDetailStore>((set) => ({
  formData: initialState,
  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  resetForm: () => set({ formData: initialState }),
}));