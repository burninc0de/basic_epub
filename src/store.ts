import { create } from 'zustand';
import { Book } from './types';

interface ReaderState {
  currentBook: Book | null;
  currentCfi: string | null;
  fontSize: number;
  lineHeight: number;
  theme: 'light' | 'dark';
  setCurrentBook: (book: Book | null) => void;
  setCurrentCfi: (cfi: string | null) => void;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
}

export const useReaderStore = create<ReaderState>((set) => ({
  currentBook: null,
  currentCfi: null,
  fontSize: 16,
  lineHeight: 1.5,
  theme: 'light',
  setCurrentBook: (book) => set({ currentBook: book }),
  setCurrentCfi: (cfi) => set({ currentCfi: cfi }),
  setFontSize: (size) => set({ fontSize: size }),
  setLineHeight: (height) => set({ lineHeight: height }),
  setTheme: (theme) => set({ theme: theme }),
  fontFamily: 'default',
  setFontFamily: (font) => set({ fontFamily: font }),
}));