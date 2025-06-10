import {create} from 'zustand';

const useLoginStore = create((set) => ({
    email: '',
    password: '',
    error: false,

    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),
    setError: (error) => set({ error }),

    resetLogin: () => set({ email: '', password: '', error: false }),
}));

export default useLoginStore;
