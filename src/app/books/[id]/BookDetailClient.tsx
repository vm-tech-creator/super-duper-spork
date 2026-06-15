'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, BookOpen, Bookmark, BookmarkCheck } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { getCoverDataUrl } from '@/lib/coverGenerator';
import type { BookData } from '@/lib/books';

// Recommendations Component
function RecommendationsSection({ currentBook }: { currentBook: BookData }) {
  const [allBooks, setAllBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books/list');
        if (response.ok) {
          const books: BookData[] = await response.json();
          setAllBooks(books);
        }
      } catch (err) {
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Get recommended books - same category, exclude current book
  const getRecommendations = () => {
    return allBooks
      .filter(b => b.category === currentBook.category && b.id !== currentBook.id)
      .slice(0, 4);
  };

  const recommendations = getRecommendations();

  if (loading || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-12 border-t-4 border-gray-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-8 h-8 text-blue-400" />
          <h2 className="text-3xl font-bold text-white">You Might Also Like</h2>
        </div>
        <p className="text-gray-300 mb-8">Since you enjoyed this {currentBook.category} book, check out these recommendations:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map(book => (
            <Link key={book.id} href={`/books/${book.id}`}>
              <div className="group cursor-pointer relative h-80 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                {/* Book Cover */}
                <img src={getCoverDataUrl(book)} alt={book.title} className="w-full h-full object-cover" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300" />

                {/* Book Info */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white font-bold text-sm line-clamp-2">{book.title}</h3>
                  <p className="text-blue-300 text-xs mt-2 font-semibold">Read Now →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Function to split content into pages
const splitContentIntoPages = (content: string, wordsPerPage: number): string[] => {
  if (!content || content.trim().length === 0) return ['No content available.'];
  
  // Split by double newlines to keep real paragraphs together
  const paragraphs = content.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);
  const splitPages: string[] = [];
  let currentBatch: string[] = [];
  let currentCount = 0;

  for (const para of paragraphs) {
    const wordCount = para.split(/\s+/).length;
    if (currentCount + wordCount > wordsPerPage && currentBatch.length > 0) {
      splitPages.push(currentBatch.join('\n\n'));
      currentBatch = [];
      currentCount = 0;
    }
    currentBatch.push(para);
    currentCount += wordCount;
  }

  if (currentBatch.length > 0) splitPages.push(currentBatch.join('\n\n'));
  return splitPages.length > 0 ? splitPages : [content.trim()];
};

export default function BookDetailClient({ bookId }: { bookId: string }) {
  const [book, setBook] = useState<BookData | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState<string[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [bookmarkedPage, setBookmarkedPage] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);

  useEffect(() => {
    if (!bookId) return;

    const fetchBookAndContent = async () => {
      try {
        setLoading(true);
        const booksResponse = await fetch('/api/books/list');
        if (!booksResponse.ok) throw new Error('Failed to fetch books');

        const books: BookData[] = await booksResponse.json();
        const selectedBook = books.find(b => b.id === parseInt(bookId));

        if (!selectedBook) {
          setError(`Book not found`);
          setLoading(false);
          return;
        }

        setBook(selectedBook);

        try {
          const contentResponse = await fetch(`/api/books/${selectedBook.id}`);
          if (contentResponse.ok) {
            const data = await contentResponse.json();
            setContent(data.content || 'No content available for this book.');
          } else {
            setContent('Content not available for this book.');
          }
        } catch (err) {
          setContent('Error loading book content.');
          console.error('Error fetching content:', err);
        }

        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndContent();
  }, [bookId]);

  useEffect(() => {
    if (content && bookId) {
      const paginatedContent = splitContentIntoPages(content, 500); // Increased to 500 words for a substantial reading experience
      setPages(paginatedContent);
      
      // Load bookmark for this specific book
      const savedBookmark = localStorage.getItem(`bookmark_book_${bookId}`);
      if (savedBookmark) {
        const pageNum = parseInt(savedBookmark);
        if (pageNum > 0 && pageNum <= paginatedContent.length) {
          setBookmarkedPage(pageNum);
          setCurrentPage(pageNum);
          return;
        }
      }
      setCurrentPage(1);
    }
  }, [content, bookId]);

  const handleBookmark = () => {
    if (!bookId) return;
    
    if (bookmarkedPage === currentPage) {
      localStorage.removeItem(`bookmark_book_${bookId}`);
      setBookmarkedPage(null);
    } else {
      localStorage.setItem(`bookmark_book_${bookId}`, currentPage.toString());
      setBookmarkedPage(currentPage);
    }
  };

  // Handle page changes with scroll reset for a better reading experience
  const handlePageChange = useCallback((direction: 'next' | 'prev') => {
    if (isTransitioning) return;

    setFlipDirection(direction);
    setCurrentPage((prev) => {
      const next = direction === 'next' ? prev + 1 : prev - 1;
      if (next < 1 || next > pages.length) return prev;
      return next;
    });
  }, [pages.length, isTransitioning]);

  // Effect to handle visual transitions and scroll resets on page change
  useEffect(() => {
    if (pages.length === 0) return;

    setIsTransitioning(true);
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      setFlipDirection(null);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentPage, pages.length]);

  // Handle keyboard events for page navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePageChange(e.key === 'ArrowRight' ? 'next' : 'prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePageChange]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading book...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !book) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Books
          </Link>
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 text-red-300">
            <p>⚠️ {error || 'Book not found'}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-[var(--text)]">
      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/books" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors font-semibold">
            <ChevronLeft className="w-5 h-5" />
            Back to Library
          </Link>

          {/* Book Container - Open Book Style */}
          <div className="relative mb-12" style={{ perspective: '2000px' }}>
            <div className={`bg-gray-900/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-gray-700 h-[75vh]`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isTransitioning
                ? flipDirection === 'next'
                  ? 'rotateY(100deg) rotateX(8deg) scale(0.95)'
                  : 'rotateY(-100deg) rotateX(8deg) scale(0.95)'
                : 'rotateY(0deg) rotateX(0deg) scale(1)',
              transition: 'all 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              boxShadow: isTransitioning 
                ? '0 0 80px rgba(59, 130, 246, 1), 0 20px 60px rgba(0, 0, 0, 0.8)'
                : '0 10px 40px rgba(0, 0, 0, 0.3)',
            }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
                {/* LEFT PAGE - Cover */}
                <div className="relative bg-gradient-to-br from-amber-50 to-yellow-50 p-12 shadow-inner border-r-2 border-gray-400 overflow-hidden">
                  <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20100%20100%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noise%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.9%22%20numOctaves=%224%22/%3E%3C/filter%3E%3Crect%20width=%22100%22%20height=%22100%22%20filter=%22url(%23noise)%22/%3E%3C/svg%3E')]"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-200 transform -skew-y-12 rounded-full opacity-30"></div>

                  <div className="relative z-10 w-full h-full flex flex-col">
                    <div className="mb-8 flex justify-center flex-shrink-0">
                      <div className="w-32 h-48 rounded-lg overflow-hidden shadow-xl border-2 border-gray-300">
                        <img src={getCoverDataUrl(book)} alt={book.title} className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center text-center">
                      <p className="text-sm font-semibold text-amber-900 mb-4 tracking-widest uppercase">
                        {book.category.charAt(0).toUpperCase() + book.category.slice(1)} Edition
                      </p>
                      <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mb-6"></div>
                      <p className="text-gray-600 text-sm italic mb-8">A complete story</p>
                    </div>

                    <div className="text-center pt-8 border-t border-gray-400 flex-shrink-0">
                      <p className="text-xs text-gray-500 font-serif tracking-widest uppercase">Cover</p>
                    </div>
                  </div>
                </div>

                {/* RIGHT PAGE - Content */}
                <div className="relative bg-gradient-to-br from-amber-50 to-yellow-50 p-12 shadow-inner overflow-hidden flex flex-col" style={{ perspective: '1200px' }}>
                  <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20100%20100%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noise%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.9%22%20numOctaves=%224%22/%3E%3C/filter%3E%3Crect%20width=%22100%22%20height=%22100%22%20filter=%22url(%23noise)%22/%3E%3C/svg%3E')]"></div>
                  <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-200 transform skew-y-12 rounded-full opacity-30"></div>

                  <div className="relative z-10 w-full h-full flex flex-col text-[color:var(--book-text,#1a202c)]" style={{ transformStyle: 'preserve-3d' }}>
                    <div className="pb-6 border-b-2 border-gray-300 flex-shrink-0 flex justify-between items-start">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-serif leading-tight mb-2">{book.title}</h1>
                        <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      </div>
                      
                      <button 
                        onClick={handleBookmark}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          bookmarkedPage === currentPage 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                        }`}
                        title={bookmarkedPage === currentPage ? "Remove bookmark" : "Bookmark this page"}
                      >
                        {bookmarkedPage === currentPage ? <BookmarkCheck className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
                      </button>
                    </div>

                    {/* Book Content - Scrollable with DRAMATIC FLIP */}
                    <div ref={contentRef} className="flex-1 overflow-y-auto pr-4 custom-scrollbar my-2 relative">
                      <div 
                              style={{
                                opacity: isTransitioning ? 0 : 1,
                                transition: 'opacity 0.35s ease-out',
                              }}
                              className="text-current font-serif text-base leading-relaxed space-y-4 pb-8 h-full text-[color:var(--book-text,#1a202c)]"
                            >
                        {pages.length > 0 ? (
                          <MarkdownRenderer content={content} currentPage={currentPage - 1} pages={pages} />
                        ) : (
                          <p className="text-gray-500 italic">No content available for this book.</p>
                        )}
                      </div>
                    </div>

                    <div className="text-center pt-4 border-t border-gray-400 flex-shrink-0">
                      <p className="text-xs text-gray-500 font-serif uppercase tracking-widest">Page {currentPage} of {pages.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-2 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 shadow-lg"></div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => handlePageChange('prev')}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg"
              disabled={currentPage === 1 || isTransitioning}
            >
              <span>📖</span>
              ← FLIP BACK
            </button>
            <Link
              href="/books"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all font-bold shadow-lg hover:shadow-xl"
            >
              Back to Library
            </Link>
            <button
              onClick={() => handlePageChange('next')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg"
              disabled={currentPage === pages.length || isTransitioning}
            >
              FLIP NEXT
              <span>📖</span>
            </button>
          </div>

          {/* Recommendations Section */}
          <RecommendationsSection currentBook={book} />
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.8);
        }

        @keyframes bookFlip {
          0% {
            transform: rotateY(0deg) rotateX(0deg);
          }
          50% {
            transform: rotateY(90deg) rotateX(5deg) scale(1.05);
          }
          100% {
            transform: rotateY(0deg) rotateX(0deg);
          }
        }

        @keyframes pageFlipForward {
          0% {
            transform: rotateY(0deg);
            opacity: 1;
          }
          45% {
            transform: rotateY(90deg);
            opacity: 0;
          }
          55% {
            transform: rotateY(-90deg);
            opacity: 0;
          }
          100% {
            transform: rotateY(0deg);
            opacity: 1;
          }
        }

        @keyframes pageFlipBackward {
          0% {
            transform: rotateY(0deg);
            opacity: 1;
          }
          45% {
            transform: rotateY(-90deg);
            opacity: 0;
          }
          55% {
            transform: rotateY(90deg);
            opacity: 0;
          }
          100% {
            transform: rotateY(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}
