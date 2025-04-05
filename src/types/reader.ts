export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

export const FONT_OPTIONS = {
  default: {
    label: 'Publisher Default',
    value: "inherit"  // Changed from 'inherit' to null
  },
  option1: {
    label: 'Libre Baskerville',
    value: "'Libre Baskerville', 'Georgia', serif"
  },
  option3: {
    label: 'Newsreader',
    value: "'Newsreader', 'Times New Roman', serif"
  },
  option4: {
    label: 'Lora',
    value: "'Lora', 'Charter', serif"
  }
} as const;

export type FontFamily = keyof typeof FONT_OPTIONS;

export const getFontFamilyValue = (key: FontFamily): string | null => {
  return FONT_OPTIONS[key].value;
};

export type ThemeStyles = {
  body: {
    fontSize: string;
    lineHeight: string;
    fontFamily: string;
    backgroundColor: string;
    color: string;
    transition: string;
    '::selection': {
      backgroundColor: string;
    };
  };
  a: {
    color: string;
  };
  'a:hover': {
    color: string;
  };
  'h1, h2, h3, h4, h5, h6': {
    color: string;
  };
  img: {
    filter: string;
  };
  '.epub-view': {
    width: string;
    maxWidth: string;
    '@media screen and (min-width: 769px)': {
      width: string;
    };
  };
};