import { create } from 'zustand';

const useOtpStore = create((set) => ({
  otp: {
    one: '',
    two: '',
    three: '',
    four: '',
    five: '',
    six: ''
  },
  setOtpField: (field, value) => set((state) => ({
    otp: { ...state.otp, [field]: value }
  })),
  resetOtp: () => set({ otp: { one: '', two: '', three: '', four: '', five: '', six: '' } })
}));

export default useOtpStore;
