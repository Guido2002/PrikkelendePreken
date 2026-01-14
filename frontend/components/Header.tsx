'use client';

import Link from 'next/link';
import { useSearch } from './SearchProvider';

export default function Header() {
  const { openSearch } = useSearch();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-warm-200/50 sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center gap-2"
          >
            <span className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:shadow-md transition-shadow">
              PP
            </span>
            <span className="text-lg font-bold text-warm-900 group-hover:text-primary-700 transition-colors hidden sm:block">
              Prikkerende Preken
            </span>
          </Link>

          {/* Navigation & Search */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2 px-3 py-2 bg-warm-100 hover:bg-warm-200 text-warm-600 rounded-xl transition-all group"
              aria-label="Zoeken"
            >
              <svg className="w-4 h-4 text-warm-500 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden md:inline text-sm">Zoeken</span>
              <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 bg-white/80 text-warm-400 rounded text-xs font-mono ml-1">
                <span className="text-[10px]">⌘</span>K
              </kbd>
            </button>

            {/* Nav Links */}
            <ul className="flex items-center gap-1">
              <li>
                <Link 
                  href="/" 
                  className="px-4 py-2 text-warm-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg font-medium transition-all"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/sermons" 
                  className="px-4 py-2 text-warm-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg font-medium transition-all"
                >
                  Preken
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
