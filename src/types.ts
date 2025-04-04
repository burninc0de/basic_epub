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

export interface ThemeStyles {
  body: {
    'font-size': string;
    'line-height': string;
    'font-family': string;
    'background-color': string;
    'color': string;
  };
  'a': {
    'color': string;
  };
  'h1, h2, h3, h4, h5, h6': {
    'color': string;
  };
  'img': {
    'filter': string;
  };
  '.epub-view': {
    'width': string;
    'max-width': string;
    '@media screen and (min-width: 769px)': {
      'width': string;
    };
  };
}