import React from 'react';
import { Reader } from './components/Reader';
import { useReaderStore } from './store';

function App() {
  // For testing purposes, always render Reader
  return <Reader />;

  // Original code commented out for later use
  /*
  const currentBook = useReaderStore((state) => state.currentBook);

  if (currentBook) {
    return <Reader />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <BookIcon className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Modern EPUB Reader</h1>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        <BookList />
      </main>
    </div>
  );
  */
}

export default App;