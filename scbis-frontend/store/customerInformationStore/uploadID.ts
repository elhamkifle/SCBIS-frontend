import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UploadIDStore = {
  files: File[];
  error: string;
  uploadedUrls: string[];
  setFiles: (files: File[]) => void;
  setError: (error: string) => void;
  setUploadedUrls: (urls: string[]) => void;
  reset: () => void;
};

export const useUploadIDStore = create<UploadIDStore>()(
  persist(
    (set) => ({
      files: [],
      error: '',
      uploadedUrls: [],
      setFiles: (files) => set({ files }),
      setError: (error) => set({ error }),
      setUploadedUrls: (urls) => set({ uploadedUrls: urls }),
      reset: () => set({ files: [], error: '', uploadedUrls: [] }),
    }),
    {
      name: 'upload-id-storage',
      // Don't persist files as they can't be serialized
      partialize: (state) => ({ 
        error: state.error,
        uploadedUrls: state.uploadedUrls
      }),
    }
  )
);