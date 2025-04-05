import React, { useState, useEffect, useRef } from 'react';
import { useReaderStore } from '../store';
import { Sun, Moon, Plus, Minus, Text, Type, List } from 'lucide-react';
import { FONT_OPTIONS, getFontFamilyValue, FontFamily } from '../types/reader';

interface ReaderSettingsProps {
  toc: ePub.Toc[];
  rendition: ePub.Rendition | null;
}

export const ReaderSettings: React.FC<ReaderSettingsProps> = ({ toc, rendition }) => {
  const { fontSize, lineHeight, theme, fontFamily, setFontSize, setLineHeight, setTheme, setFontFamily } = useReaderStore();
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleFontSizeChange = (delta: number) => {
    setFontSize(Math.max(12, Math.min(24, fontSize + delta)));
  };

  const handleLineHeightChange = (delta: number) => {
    setLineHeight(Math.max(1, Math.min(2, lineHeight + delta)));
  };

  const handleTOCClick = (href: string) => {
    if (rendition) {
      rendition.display(href); // Navigate to the correct section
    }
    setShowTOC(false);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowTOC(false);
      }
    };

    if (showTOC) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTOC]);

  return (
    <div className="fixed bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-4 max-w-[95%] sm:max-w-none">
      {/* TOC Button */}
      <button
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => setShowTOC(true)}
        aria-label="Open Table of Contents"
      >
        <List className="w-5 h-5" />
      </button>

      {/* TOC Modal */}
      {showTOC && (
        <div
          className="fixed inset-0 z-50" // Fullscreen backdrop without styling
          onClick={() => setShowTOC(false)} // Close modal when clicking outside
        >
          <div
            ref={modalRef} // Attach ref to the modal
            className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
            <ul className="space-y-2">
              {toc.map((item) => (
                <li key={item.href}>
                  <button
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleTOCClick(item.href)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              onClick={() => setShowTOC(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Font Family Selection */}
      <div className="relative">
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setShowFontMenu(!showFontMenu)}
          aria-label="Change font"
        >
          <Type className="w-5 h-5" />
        </button>
        
        {showFontMenu && (
          <div className="absolute bottom-full mb-2 left-0 sm:left-1/2 sm:-translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 min-w-[200px] max-w-[280px]">
            {Object.entries(FONT_OPTIONS).map(([key, font]) => (
              <button
                key={key}
                className={`w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  fontFamily === key ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
                onClick={() => {
                  setFontFamily(key as FontFamily);
                  setShowFontMenu(false);
                }}
              >
                <span className="font-sans">{font.label}</span>
                <span className="text-gray-500 dark:text-gray-400" style={{ fontFamily: font.value }}>
                  Aa
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

      {/* Font Size Controls */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => handleFontSizeChange(-1)}
          aria-label="Decrease font size"
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="w-8 text-center">{fontSize}px</span>
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => handleFontSizeChange(1)}
          aria-label="Increase font size"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

      {/* Line Spacing Controls */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => handleLineHeightChange(-0.1)}
          aria-label="Decrease line spacing"
        >
          <Text className="w-5 h-5 transform scale-y-75" />
        </button>
        <span className="w-12 text-center">{lineHeight.toFixed(1)}x</span>
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => handleLineHeightChange(0.1)}
          aria-label="Increase line spacing"
        >
          <Text className="w-5 h-5 transform scale-y-125" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

      {/* Theme Toggle */}
      <button
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};