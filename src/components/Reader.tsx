import React, { useEffect, useRef, useState } from 'react';
import ePub from 'epubjs';
import { useReaderStore } from '../store';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { ReaderSettings } from './ReaderSettings';

const FONT_OPTIONS = {
  // Define your font options here
};

export const Reader: React.FC = () => {
  const { currentBook, currentCfi, setCurrentCfi, fontSize, lineHeight, theme, fontFamily } = useReaderStore();
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<ePub.Rendition | null>(null);
  const bookRef = useRef<ePub.Book | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fontFamilyValue = fontFamily === 'default' 
    ? 'inherit' 
    : FONT_OPTIONS[fontFamily as keyof typeof FONT_OPTIONS];

  useEffect(() => {
    if (!currentBook || !viewerRef.current) return;

    const loadBook = async () => {
      try {
        setError(null);
        bookRef.current = ePub(currentBook.filePath);
        
        console.log('Book metadata:', await bookRef.current.loaded.metadata);
        console.log('Book spine:', await bookRef.current.loaded.spine);
        
        // Wait for book to be ready before rendering
        await bookRef.current.ready;
        

        renditionRef.current = bookRef.current.renderTo(viewerRef.current!, {
          width: '100%',
          height: '100%',
          spread: 'none',
          flow: 'scrolled-doc',
          manager: 'default',
          minSpreadWidth: 800,
          allowScriptedContent: true,
        });

        // Initialize rendition
        await renditionRef.current.display(currentCfi || undefined);

        // Set up keyboard navigation
        renditionRef.current.on('keyup', (event: KeyboardEvent) => {
          if (event.key === 'ArrowLeft') handlePrevPage();
          if (event.key === 'ArrowRight') handleNextPage();
        });

        // Track location changes
        renditionRef.current.on('locationChanged', (location: ePub.Location) => {
          setCurrentCfi(location.start.cfi);
        });

        // Enable touch events for mobile
        renditionRef.current.on('touchstart', (event: TouchEvent) => {
          const touch = event.changedTouches[0];
          if (touch.screenX < window.innerWidth * 0.3) handlePrevPage();
          if (touch.screenX > window.innerWidth * 0.7) handleNextPage();
        });

      } catch (err) {
        console.error('Failed to load book:', err);
        setError('Failed to load the book. The file might be corrupted or in an unsupported format.');
      }
    };

    loadBook();

    return () => {
      if (renditionRef.current) {
        renditionRef.current.destroy();
      }
      if (bookRef.current) {
        bookRef.current.destroy();
      }
    };
  }, [currentBook, currentCfi, setCurrentCfi]);

  useEffect(() => {
    if (!renditionRef.current) return;
    
    renditionRef.current.themes.default({
      body: {
        'font-size': `${fontSize}px !important`,
        'line-height': `${lineHeight} !important`,
        'background-color': theme === 'dark' ? '#1a1a1a !important' : '#ffffff !important',
        'color': theme === 'dark' ? '#ffffff !important' : '#000000 !important'
      }
    });
  }, [fontSize, lineHeight, theme]);

  const handlePrevPage = () => {
    if (renditionRef.current) {
      renditionRef.current.prev();
    }
  };

  const handleNextPage = () => {
    if (renditionRef.current) {
      renditionRef.current.next();
    }
  };

  if (!currentBook) return null;

  return (
    <div 
      className={`h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}
      style={{ 
        '--font-family': fontFamilyValue
      } as React.CSSProperties}
    >
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
            <div ref={viewerRef} className="absolute inset-0" />
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