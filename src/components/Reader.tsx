import React, { useEffect, useRef, useState } from 'react';
import ePub from 'epubjs';
import { useReaderStore } from '../store';
import { ArrowLeft, ArrowRight, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReaderSettings } from './ReaderSettings';

import styles from './reader.module.css';

// Available font options for the reader
const FONT_OPTIONS = {
  default: 'Publisher Default',
  option1: "'Crimson Pro', 'Literata', serif",
  option2: "'Source Serif Pro', 'Merriweather', serif",
};

// Helper function to get CSS font-family value from the font option key
const getFontFamilyValue = (key: string) => {
  return FONT_OPTIONS[key as keyof typeof FONT_OPTIONS];
};

export const Reader: React.FC = () => {
  // Get reader state and actions from the global store
  const { currentBook, currentCfi, setCurrentCfi, fontSize, lineHeight, theme, fontFamily, setTheme, currentPage, setCurrentPage, totalPages, setTotalPages } = useReaderStore();
  
  // Refs to hold DOM elements and epub.js instances
  const viewerRef = useRef<HTMLDivElement>(null);     // Container where the book will be rendered
  const renditionRef = useRef<ePub.Rendition | null>(null);  // epub.js rendition instance
  const bookRef = useRef<ePub.Book | null>(null);     // epub.js book instance
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Main useEffect for book loading and initialization - removed style dependencies
  useEffect(() => {
    if (!currentBook || !viewerRef.current) return;

    const loadBook = async () => {
      try {
        setError(null);
        setIsLoading(true);
        
        // Create book instance
        bookRef.current = ePub(currentBook.filePath);

        // Create rendition first
        renditionRef.current = bookRef.current.renderTo(viewerRef.current!, {
          manager: "continuous",
          flow: "paginated",
          width: "100%",
          height: "100%",
          snap: true
        });

        // Display chapter and get the promise
        const displayed = renditionRef.current.display();

        // Handle the display promise exactly like the example
        displayed.then(function(renderer){
          // Now we can set up listeners after content is displayed
          renditionRef.current?.on('keyup', (event: KeyboardEvent) => {
            // Left Key
            if ((event.keyCode || event.which) == 37) {
              renditionRef.current?.prev();
            }
            // Right Key
            if ((event.keyCode || event.which) == 39) {
              renditionRef.current?.next();
            }
          });
        });

        // Navigation loaded - matching example structure
        bookRef.current.loaded.navigation.then(function(toc){
          console.log(toc); // We can use this later for TOC
        });

        // Clean up previous instances on unmount
        return () => {
          if (renditionRef.current) renditionRef.current.destroy();
          if (bookRef.current) bookRef.current.destroy();
        };

      } catch (err) {
        console.error('Failed to load book:', err);
        setError('Failed to load the book. The file might be corrupted or in an unsupported format.');
        setIsLoading(false);
      }
    };

    loadBook();

    return () => {
      if (renditionRef.current) renditionRef.current.destroy();
      if (bookRef.current) bookRef.current.destroy();
    };
  }, [currentBook, currentCfi, setCurrentCfi]); // Removed style dependencies

  // Separate useEffect for styling updates
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

  // useEffect to sync with system dark mode preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial value
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [setTheme]);

  // Navigation handlers - exactly like the example
  const handlePrevPage = () => {
    renditionRef.current?.prev();
  };

  const handleNextPage = () => {
    renditionRef.current?.next();
  };

  // Add document level keyboard listener like the example
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      // Left Key
      if ((e.keyCode || e.which) == 37) {
        renditionRef.current?.prev();
      }
      // Right Key
      if ((e.keyCode || e.which) == 39) {
        renditionRef.current?.next();
      }
    };

    document.addEventListener("keyup", handleKeyUp, false);
    
    return () => {
      document.removeEventListener("keyup", handleKeyUp, false);
    };
  }, []);

  const goToPage = (pageNumber: number) => {
    if (!renditionRef.current || !bookRef.current) return;
    
    const location = bookRef.current.locations.cfiFromLocation(pageNumber - 1);
    if (location) {
      renditionRef.current.display(location);
    }
  };

  // Don't render anything if no book is selected
  if (!currentBook) return null;

  // Main render with:
  // - Header with book title and close button
  // - Book content viewer
  // - Navigation buttons
  // - Reader settings panel
  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{currentBook.title}</h1>
        <button
          className="text-gray-600 hover:text-gray-900"
          onClick={() => useReaderStore.getState().setCurrentBook(null)}
        >
          Close
        </button>
      </div>
      <div className="flex-1 relative">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-50 text-red-700 p-4 rounded-lg shadow-sm flex items-center gap-2 max-w-md">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <>
            <div ref={viewerRef} className={`absolute inset-0 bg-white dark:bg-gray-800 transition-colors ${styles.container}`} />
            {!isLoading && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-lg shadow-lg">
                <button
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
              onClick={handlePrevPage}
              aria-label="Previous page"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
              onClick={handleNextPage}
              aria-label="Next page"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
      <ReaderSettings />
    </div>
  );
};