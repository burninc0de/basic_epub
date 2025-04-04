import React from 'react';
import { useReaderStore } from '../store';
import { Sun, Moon, Plus, Minus, Text } from 'lucide-react';

export const ReaderSettings: React.FC = () => {
  const { fontSize, lineHeight, theme, setFontSize, setLineHeight, setTheme } = useReaderStore();

  const handleFontSizeChange = (delta: number) => {
    setFontSize(Math.max(12, Math.min(24, fontSize + delta)));
  };

  const handleLineHeightChange = (delta: number) => {
    setLineHeight(Math.max(1, Math.min(2, lineHeight + delta)));
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex items-center gap-4">
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

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

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

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

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