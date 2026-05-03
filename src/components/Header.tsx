'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl hover:text-yellow-400 transition-colors">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center text-gray-900 font-bold">S</div>
            <span>SAHARA</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold text-sm uppercase tracking-wide">
              Explore
            </Link>
            <Link href="/" className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold text-sm uppercase tracking-wide">
              Features
            </Link>
            <Link href="/books" className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold text-sm uppercase tracking-wide">
              Books
            </Link>
            <Link href="/" className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold text-sm uppercase tracking-wide">
              About
            </Link>
            <Link href="/" className="text-gray-300 hover:text-yellow-400 transition-colors font-semibold text-sm uppercase tracking-wide">
              Sign In
            </Link>
          </div>

          {/* Explore Now Button + Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <Link href="/books" className="hidden sm:block px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-sm rounded transition-colors uppercase tracking-wide">
              Explore Now
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-yellow-400 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-800">
            <Link href="/" className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors font-semibold text-sm uppercase tracking-wide">
              Explore
            </Link>
            <Link href="/" className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors font-semibold text-sm uppercase tracking-wide">
              Features
            </Link>
            <Link href="/books" className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors font-semibold text-sm uppercase tracking-wide">
              Books
            </Link>
            <Link href="/" className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors font-semibold text-sm uppercase tracking-wide">
              About
            </Link>
            <Link href="/" className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors font-semibold text-sm uppercase tracking-wide">
              Sign In
            </Link>
            <Link href="/books" className="block mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-sm rounded transition-colors uppercase tracking-wide text-center">
              Explore Now
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
