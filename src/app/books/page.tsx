'use client';

import { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { BookOpen, Search, ChevronUp, ChevronDown, Bookmark } from 'lucide-react';
import SaharaHeader from '@/components/SaharaHeader';
import BookCard from '@/components/BookCard';
import type { BookData } from '@/lib/books';

type CategoryFilter = 'all' | 'preteen' | 'teen' | 'adult' | 'bookmarked';
type SortOrder = 'asc' | 'desc';

const BOOKS_PER_PAGE = 12;

export default function BooksPage() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch books data
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Books loaded:', data.length, 'books');
        setBooks(data);
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch books';
        console.error('Error fetching books:', err);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const loadBookmarks = () => {
      const ids: number[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('bookmark_book_')) {
          const idStr = key.replace('bookmark_book_', '');
          const id = parseInt(idStr);
          if (!isNaN(id)) ids.push(id);
        }
      }
      setBookmarkedIds(ids);
    };

    loadBookmarks();
    // Listen for storage changes (e.g., if a user bookmarks in another tab)
    window.addEventListener('storage', loadBookmarks);
    return () => window.removeEventListener('storage', loadBookmarks);
  }, []);

  // Process books: filter, sort, and paginate
  const processedBooks = useMemo(() => {
    let result = [...books];

    // Filter by category
    if (selectedCategory === 'bookmarked') {
      result = result.filter(book => bookmarkedIds.includes(book.id));
    } else if (selectedCategory !== 'all') {
      result = result.filter(book => book.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        book =>
          book.title.toLowerCase().includes(query) ||
          book.id.toString().includes(query)
      );
    }

    // Sort by title
    result.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [books, searchQuery, selectedCategory, sortOrder, bookmarkedIds]);

  // Pagination
  const totalPages = Math.ceil(processedBooks.length / BOOKS_PER_PAGE);
  const paginatedBooks = useMemo(() => {
    const startIdx = (currentPage - 1) * BOOKS_PER_PAGE;
    return processedBooks.slice(startIdx, startIdx + BOOKS_PER_PAGE);
  }, [processedBooks, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortOrder]);

  const getCategoryStats = () => {
    return {
      preteen: books.filter(b => b.category === 'preteen').length,
      teen: books.filter(b => b.category === 'teen').length,
      adult: books.filter(b => b.category === 'adult').length,
      bookmarked: books.filter(b => bookmarkedIds.includes(b.id)).length,
    };
  };

  const stats = getCategoryStats();
  const categoryColors: Record<CategoryFilter, string> = {
    preteen: 'from-blue-400 to-cyan-300',
    teen: 'from-purple-400 to-pink-300',
    adult: 'from-amber-400 to-orange-300',
    all: 'from-gray-400 to-gray-300',
    bookmarked: 'from-rose-400 to-red-300',
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <main className="relative z-10 pt-24 px-4">
        <div className="py-12">
          <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-10 h-10 text-blue-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">My Books Library</h1>
              <BookOpen className="w-10 h-10 text-blue-400" />
            </div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover amazing stories across three age categories. Each book includes full chapters and beautiful cover art.
            </p>
          </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-300">
            <p>⚠️ {error}</p>
          </div>
        )}

        {/* Stats Cards - Category Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`p-6 rounded-lg font-semibold text-white transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-gray-600 shadow-lg scale-105'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <div className="text-3xl font-bold">{books.length}</div>
            <div className="text-sm opacity-90">Total Books</div>
          </button>

          <button
            onClick={() => setSelectedCategory('preteen')}
            className={`p-6 rounded-lg font-semibold text-blue-900 transition-all duration-300 bg-gradient-to-br ${
              selectedCategory === 'preteen' ? categoryColors.preteen + ' shadow-lg scale-105' : 'from-blue-300 to-cyan-200'
            }`}
          >
            <div className="text-3xl font-bold">{stats.preteen}</div>
            <div className="text-sm opacity-90">Preteen</div>
          </button>

          <button
            onClick={() => setSelectedCategory('teen')}
            className={`p-6 rounded-lg font-semibold text-purple-900 transition-all duration-300 bg-gradient-to-br ${
              selectedCategory === 'teen' ? categoryColors.teen + ' shadow-lg scale-105' : 'from-purple-300 to-pink-200'
            }`}
          >
            <div className="text-3xl font-bold">{stats.teen}</div>
            <div className="text-sm opacity-90">Teen</div>
          </button>

          <button
            onClick={() => setSelectedCategory('adult')}
            className={`p-6 rounded-lg font-semibold text-amber-900 transition-all duration-300 bg-gradient-to-br ${
              selectedCategory === 'adult' ? categoryColors.adult + ' shadow-lg scale-105' : 'from-amber-300 to-orange-200'
            }`}
          >
            <div className="text-3xl font-bold">{stats.adult}</div>
            <div className="text-sm opacity-90">Adult</div>
          </button>

          <button
            onClick={() => setSelectedCategory('bookmarked')}
            className={`p-6 rounded-lg font-semibold text-rose-900 transition-all duration-300 bg-gradient-to-br ${
              selectedCategory === 'bookmarked' ? categoryColors.bookmarked + ' shadow-lg scale-105' : 'from-rose-300 to-red-200'
            }`}
          >
            <div className="flex justify-center items-center gap-2">
              <div className="text-3xl font-bold">{stats.bookmarked}</div>
              <Bookmark className="w-5 h-5" />
            </div>
            <div className="text-sm opacity-90">Bookmarked</div>
          </button>
        </div>

        {/* Search and Sort Controls */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or book ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all"
            />
          </div>

          {/* Sort Button */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {sortOrder === 'asc' ? (
              <>
                <ChevronUp className="w-5 h-5" />
                A - Z
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" />
                Z - A
              </>
            )}
          </button>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-300">Loading books...</p>
            </div>
          </div>
        ) : paginatedBooks.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedCategory === 'all'
                  ? `All Books (${processedBooks.length})`
                  : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Books (${processedBooks.length})`}
                {searchQuery && ` - Search: "${searchQuery}"`}
              </h2>
              <p className="text-gray-400 text-sm">
                Page {currentPage} of {totalPages}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ← Previous
                </button>

                <div className="flex gap-2 items-center">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white shadow-lg scale-110'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-96">
            <p className="text-gray-300 text-xl">
              {selectedCategory === 'bookmarked' 
                ? "You haven't bookmarked any books yet." 
                : "No books found matching your search."}
            </p>
          </div>
        )}

        {/* Footer Stats */}
        {books.length > 0 && (
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/20 text-center">
            <p className="text-gray-300">
              📚 Featuring {books.length} complete stories with full chapters and professional cover designs. Each book is crafted with care across three age categories.
            </p>
          </div>
        )}
          </div>
        </div>
      </main>
    </div>
  );
}
