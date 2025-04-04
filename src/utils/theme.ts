import { ThemeStyles, Theme } from '../types/reader';

type ThemeColor = {
  background: string;
  text: string;
  link: string;
  linkHover: string;
};

const THEME_COLORS: Record<'dark' | 'light', ThemeColor> = {
  dark: {
    background: '#1f2937',
    text: '#f3f4f6',
    link: '#60a5fa',
    linkHover: '#93c5fd'
  },
  light: {
    background: '#ffffff',
    text: '#111827',
    link: '#2563eb',
    linkHover: '#1d4ed8'
  }
} as const;

export const createReaderTheme = (
  fontSize: number,
  lineHeight: number,
  fontFamily: string,
  theme: Theme
): ThemeStyles => {
  const colors = theme === Theme.Dark ? THEME_COLORS.dark : THEME_COLORS.light;
  
  return {
    body: {
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}`,
      fontFamily: fontFamily,
      backgroundColor: colors.background,
      color: colors.text,
      transition: 'background-color 0.2s ease-in-out',
      '::selection': {
        backgroundColor: colors.link,
      },
    },
    a: {
      color: colors.link,
    },
    'a:hover': {
      color: colors.linkHover,
    },
    'h1, h2, h3, h4, h5, h6': {
      color: colors.text,
    },
    img: {
      filter: theme === Theme.Dark ? 'brightness(0.8) contrast(1.2)' : 'none',
    },
    '.epub-view': {
      width: '100%',
      maxWidth: '100vw',
      '@media screen and (min-width: 769px)': {
        width: '546px',
      },
    },
  };
};