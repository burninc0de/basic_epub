import React from 'react';
import { Book } from '../types';
import { useReaderStore } from '../store';
import { Book as BookIcon } from 'lucide-react';

const books: Book[] = [
  {
    title: 'Sample Book',
    author: 'Author Name',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200&h=300',
    filePath: '/epubs/cicely-hamilton_william-an-englishman.epub',
  },
  {
    title: 'Sample Book2 ',
    author: 'Author Name 2',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200&h=300',
    filePath: '/epubs/john-meade-falkner_the-nebuly-coat.epub',
  },
];

export const BookList: React.FC = () => {
  const setCurrentBook = useReaderStore((state) => state.setCurrentBook);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {books.map((book) => (
        <div
          key={book.filePath}
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => setCurrentBook(book)}
        >
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <BookIcon className="w-16 h-16 text-gray-400" />
            </div>
          )}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
            <p className="text-gray-600 text-sm">{book.author}</p>
          </div>
        </div>
      ))}
    </div>
  );
};