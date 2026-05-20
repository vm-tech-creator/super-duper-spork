'use client';

import Link from 'next/link';
import { BookData } from '@/lib/books';
import { getCoverDataUrl } from '@/lib/coverGenerator';

interface BookCardProps {
  book: BookData;
}

export default function BookCard({ book }: BookCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'preteen':
        return 'from-blue-400 to-cyan-300 text-blue-900';
      case 'teen':
        return 'from-purple-400 to-pink-300 text-purple-900';
      case 'adult':
        return 'from-amber-400 to-orange-300 text-amber-900';
      default:
        return 'from-gray-400 to-gray-300 text-gray-900';
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Simplified to avoid "crazy" generated summaries and focus on the actual content
  const getBookDescription = () => {
    return `Dive into this complete ${book.category} edition and experience the full story from beginning to end.`;
  };

  const coverUrl = getCoverDataUrl(book);
  const description = getBookDescription();

  return (
    <Link href={`/books/${book.id}`}>
      <div className="group cursor-pointer relative">
        <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
          {/* Book Cover - using generated SVG */}
          <div className="relative w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <img
              src={coverUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

          {/* Category Badge */}
          <div
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getCategoryColor(
              book.category
            )} shadow-md`}
          >
            {getCategoryLabel(book.category)}
          </div>

          {/* Book Info on Hover */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
            <h3 className="text-white font-bold text-lg line-clamp-2">{book.title}</h3>
            <p className="text-gray-200 text-sm mt-2 line-clamp-2">{description}</p>
            <p className="text-blue-300 text-xs mt-3 font-semibold">Click to read →</p>
          </div>
        </div>

        {/* Book Title Below Card */}
        <h3 className="mt-3 font-semibold text-gray-800 line-clamp-2 text-center group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>
      </div>
    </Link>
  );
}
