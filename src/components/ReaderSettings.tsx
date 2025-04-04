import React from 'react';
import { useReaderStore } from '../store';
import { Sun, Moon, Plus, Minus, Text, Type } from 'lucide-react';
import { useState } from 'react';

const FONT_OPTIONS = {
  default: 'Publisher Default',
  option1: "'Crimson Pro', 'Literata', serif",
  option2: "'Source Serif Pro', 'Merriweather', serif",
};

const getFontFamilyValue = (key: string) => {
  return FONT_OPTIONS[key as keyof typeof FONT_OPTIONS];
};

export const ReaderSettings: React.FC = () => {
  const { fontSize, lineHeight, theme, fontFamily, setFontSize, setLineHeight, setTheme, setFontFamily } = useReaderStore();
  const [showFontMenu, setShowFontMenu] = useState(false);

  const handleFontSizeChange = (delta: number) => {
    setFontSize(Math.max(12, Math.min(24, fontSize + delta)));
  };

  const handleLineHeightChange = (delta: number) => {
    setLineHeight(Math.max(1, Math.min(2, lineHeight + delta)));
  };

  return (
    <div className="fixed bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-4 max-w-[95%] sm:max-w-none">
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
            {Object.entries(FONT_OPTIONS).map(([value, label]) => (
              <button
                key={value}
                className={`w-full text-left px-3 py-2 text-sm rounded flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  fontFamily === value ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
                onClick={() => {
                  setFontFamily(value);
                  setShowFontMenu(false);
                }}
              >
                <span className="font-sans">{label}</span>
                <span className="text-gray-500 dark:text-gray-400" style={{ fontFamily: getFontFamilyValue(value) }}>
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