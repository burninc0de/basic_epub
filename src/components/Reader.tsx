import React, { useEffect, useRef, useState } from 'react';
import ePub from 'epubjs';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { ReaderSettings } from './ReaderSettings';
import { useReaderStore } from '../store';

// Font options matching Reader.tsx
const FONT_OPTIONS = {
  default: 'Publisher Default',
  option1: "'Crimson Pro', 'Literata', serif",
  option2: "'Source Serif Pro', 'Merriweather', serif",
};

const getFontFamilyValue = (key: string) => {
  return FONT_OPTIONS[key as keyof typeof FONT_OPTIONS];
};

export const Reader: React.FC = () => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<ePub.Rendition | null>(null);
  const bookRef = useRef<ePub.Book | null>(null);
  
  // Replace static values with store values
  const { fontSize, lineHeight, theme, fontFamily, setTheme } = useReaderStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    try {
      // Load the book - using a test EPUB for now
      bookRef.current = ePub("https://s3.amazonaws.com/epubjs/books/moby-dick/OPS/package.opf");

      // Create rendition with updated options
      renditionRef.current = bookRef.current.renderTo(viewerRef.current, {
        width: '100%',
        height: '100%',
        spread: 'none',
        flow: 'paginated',
        manager: 'default',
        minSpreadWidth: 800,
        allowScriptedContent: true,
      });

      // Display first chapter
      renditionRef.current.display("chapter_001.xhtml").catch(err => {
        setError(`Failed to load chapter: ${err.message}`);
      });
    } catch (err) {
      setError(`Failed to load book: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    // Set up keyboard navigation
    const handleKeyUp = (e: KeyboardEvent) => {
      if ((e.keyCode || e.which) == 37) renditionRef.current?.prev();
      if ((e.keyCode || e.which) == 39) renditionRef.current?.next();
    };

    document.addEventListener("keyup", handleKeyUp, false);

    return () => {
      document.removeEventListener("keyup", handleKeyUp, false);
      if (renditionRef.current) renditionRef.current.destroy();
      if (bookRef.current) bookRef.current.destroy();
    };
  }, []); // Remove theme dependency since we handle it in the separate useEffect

  // Add system theme detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    setTheme(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Add new useEffect for styling updates
  useEffect(() => {
    if (!renditionRef.current) return;
    
    renditionRef.current.themes.default({
      body: {
        'font-size': `${fontSize}px !important`,
        'line-height': `${lineHeight} !important`,
        'font-family': `${getFontFamilyValue(fontFamily)} !important`,
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
  }, [fontSize, lineHeight, theme, fontFamily]);

  // Add this useEffect to handle dark mode class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handlePrevPage = () => {
    if (renditionRef.current) renditionRef.current.prev();
  };

  const handleNextPage = () => {
    if (renditionRef.current) renditionRef.current.next();
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Epub Reader</h1>
      </div>

      {/* Main content area */}
      <div className="flex-1 relative bg-white dark:bg-gray-800">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-100 p-4 rounded-lg shadow-sm flex items-center gap-2 max-w-md">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <>
            <div 
              ref={viewerRef} 
              className="absolute inset-0 bottom-16 bg-white dark:bg-gray-800 transition-colors"
            />
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-700/80 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-600 text-gray-800 dark:text-white"
              onClick={handlePrevPage}
              aria-label="Previous page"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-700/80 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-600 text-gray-800 dark:text-white"
              onClick={handleNextPage}
              aria-label="Next page"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Reader Settings Panel */}
      <ReaderSettings />
    </div>
  );
};