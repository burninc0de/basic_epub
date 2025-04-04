import { create } from 'zustand';
import { ReaderState } from './types';

export const useReaderStore = create<ReaderState>((set) => ({
  currentBook: null,
  currentCfi: '',
  setCurrentBook: (book) => set({ currentBook: book }),
  setCurrentCfi: (cfi) => set({ currentCfi: cfi }),
}));