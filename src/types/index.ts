export interface ThemeStyles {
  body: Record<string, string>;
  a: Record<string, string>;
  'h1, h2, h3, h4, h5, h6': Record<string, string>;
  img: Record<string, string>;
  '.epub-view': Record<string, string> & {
    '@media screen and (min-width: 769px)': Record<string, string>;
  };
}