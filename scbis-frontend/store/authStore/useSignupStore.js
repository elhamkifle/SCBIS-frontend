// store/useSignupStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSignupStore = create(
  persist(
    (set) => ({
      // Step 1 fields
      fName: '',
      lName: '',
      dob: '',
      pNo: '',

      // Step 2 fields
      email: '',
      confirmPass: '',
      password: '',

      // Actions
      setFName: (fName) => set({ fName }),
      setLName: (lName) => set({ lName }),
      setDob: (dob) => set({ dob }),
      setPNo: (pNo) => set({ pNo }),
      setEmail: (email) => set({ email }),
      setPassword: (password) => set({ password }),
      setConfirmPass: (confirmPass) => set({ confirmPass }),

      // Clear store (e.g., after signup complete)
      clearSignupData: () =>
        set({
          fName: '',
          lName: '',
          dob: '',
          pNo: '',
          email: '',
          password: '',
          confirmPass: '',
        }),
    }),
    {
      name: 'signup-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useSignupStore;
