export interface Book {
  title: string;
  author: string;
  coverUrl: string;
  filePath: string;
}

export interface ReaderState {
  currentBook: Book | null;
  currentCfi: string;
  setCurrentBook: (book: Book | null) => void;
  setCurrentCfi: (cfi: string) => void;
}