import { useEffect } from 'react';

export const useDarkMode = (isDark: boolean) => {
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
};