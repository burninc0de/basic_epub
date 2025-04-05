import React, { useEffect, useRef, useState } from 'react';
import ePub from 'epubjs';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { ReaderSettings } from './ReaderSettings';
import { useReaderStore } from '../store';
import { FONT_OPTIONS, getFontFamilyValue, FontFamily } from '../types/reader';

export const Reader: React.FC = () => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<ePub.Rendition | null>(null);
  const bookRef = useRef<ePub.Book | null>(null);
  const [toc, setToc] = useState<ePub.Toc[]>([]);
  const [isDoubleColumn, setIsDoubleColumn] = useState(false); // State for column layout
  const { fontSize, lineHeight, theme, fontFamily, setTheme } = useReaderStore();
  const [error, setError] = useState<string | null>(null);

  const handleToggleColumns = (isDouble: boolean) => {
    setIsDoubleColumn(isDouble);
  };

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

      // Retrieve TOC and set it in state
      bookRef.current.loaded.navigation.then((navigation) => {
        setToc(navigation.toc);
      });

      // Retrieve the last location from localStorage
      const lastLocation = localStorage.getItem('epub-reader-location');
      if (lastLocation) {
        renditionRef.current.display(lastLocation).catch(err => {
          setError(`Failed to load last location: ${err.message}`);
        });
      } else {
        // Display first chapter if no saved location
        renditionRef.current.display("chapter_001.xhtml").catch(err => {
          setError(`Failed to load chapter: ${err.message}`);
        });
      }

      // Save the current location whenever it changes
      renditionRef.current.on('relocated', (location) => {
        if (location && location.start) {
          localStorage.setItem('epub-reader-location', location.start.cfi);
        }
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

    const fontValue = getFontFamilyValue(fontFamily);

    // Apply styles to the rendition body
    renditionRef.current.themes.default({
      body: {
        'font-size': `${fontSize}px !important`,
        'line-height': `${lineHeight} !important`,
        'background-color': theme === 'dark' ? '#1f2937 !important' : '#ffffff !important', // Fixed the mismatched backtick
        'color': theme === 'dark' ? '#f3f4f6 !important' : '#111827 !important', // Fixed the mismatched backtick
        ...(isDoubleColumn && {
          'column-width': '400px',
          'column-gap': '20px',
        }),
      },
      ...(fontValue !== 'inherit' && {
        'body, p': {
          'font-family': `${fontValue} !important`,
        },
      }),
    });
  }, [fontSize, lineHeight, theme, fontFamily, isDoubleColumn]);

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
      <ReaderSettings toc={toc} rendition={renditionRef.current} onToggleColumns={handleToggleColumns} />
    </div>
  );
};