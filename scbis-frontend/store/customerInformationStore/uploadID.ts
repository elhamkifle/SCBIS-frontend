import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UploadIDStore = {
  files: File[];
  error: string;
  setFiles: (files: File[]) => void;
  setError: (error: string) => void;
  reset: () => void;
};

export const useUploadIDStore = create<UploadIDStore>()(
  persist(
    (set) => ({
      files: [],
      error: '',
      setFiles: (files) => set({ files }),
      setError: (error) => set({ error }),
      reset: () => set({ files: [], error: '' }),
    }),
    {
      name: 'upload-id-storage',
      // Don't persist files as they can't be serialized
      partialize: (state) => ({ 
        error: state.error 
      }),
    }
  )
);