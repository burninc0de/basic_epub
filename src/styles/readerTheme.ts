import { ThemeStyles } from '../types';

export const createReaderTheme = (
  fontSize: number,
  lineHeight: string,
  fontFamily: string,
  theme: 'dark' | 'light'
): ThemeStyles => ({
  body: {
    'font-size': `${fontSize}px !important`,
    'line-height': `${lineHeight} !important`,
    'font-family': `${fontFamily} !important`,
    'background-color': theme === 'dark' ? '#1f2937 !important' : '#ffffff !important',
    'color': theme === 'dark' ? '#f3f4f6 !important' : '#111827 !important',
  },
  'a': {
    'color': theme === 'dark' ? '#60a5fa !important' : '#2563eb !important',
  },
  'h1, h2, h3, h4, h5, h6': {
    'color': theme === 'dark' ? '#f3f4f6 !important' : '#111827 !important',
  },
  'img': {
    'filter': theme === 'dark' ? 'brightness(0.8) contrast(1.2)' : 'none',
  },
  '.epub-view': {
    'width': '100% !important',
    'max-width': '100vw !important',
    '@media screen and (min-width: 769px)': {
      'width': '546px !important'
    }
  },
});