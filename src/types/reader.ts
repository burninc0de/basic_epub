export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

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