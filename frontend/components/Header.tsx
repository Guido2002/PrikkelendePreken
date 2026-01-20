'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSearch } from './SearchProvider';

export default function Header() {
  const { openSearch } = useSearch();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-warm-100' 
        : 'bg-white/80 backdrop-blur-md border-b border-warm-200/50'
    }`}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center gap-2.5 relative z-50"
          >
            <span className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
              PP
            </span>
            <span className="text-lg font-bold text-warm-900 group-hover:text-primary-700 transition-colors hidden sm:block">
              Prikkelende Preken
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Nav Links */}
            <Link 
              href="/" 
              className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                isActive('/') && pathname === '/'
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-warm-600 hover:text-primary-700 hover:bg-primary-50/50'
              }`}
            >
              Home
              {isActive('/') && pathname === '/' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
              )}
            </Link>
            <Link 
              href="/sermons" 
              className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                isActive('/sermons')
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-warm-600 hover:text-primary-700 hover:bg-primary-50/50'
              }`}
            >
              Preken
              {isActive('/sermons') && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
              )}
            </Link>

            <Link 
              href="/dominees" 
              className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                isActive('/dominees')
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-warm-600 hover:text-primary-700 hover:bg-primary-50/50'
              }`}
            >
              Dominees
              {isActive('/dominees') && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
              )}
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-warm-200 mx-2" />

            {/* Search Button */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2.5 px-4 py-2 bg-warm-50 hover:bg-warm-100 text-warm-600 rounded-xl transition-all duration-200 group border border-warm-200/50 hover:border-warm-300"
              aria-label="Zoeken"
            >
              <svg className="w-4 h-4 text-warm-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm text-warm-500">Zoeken...</span>
              <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 bg-white text-warm-400 rounded-md text-xs font-mono border border-warm-200">
                <span className="text-[10px]">⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Mobile: Search + Menu buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={openSearch}
              className="p-2.5 text-warm-500 hover:text-primary-600 hover:bg-warm-100 rounded-xl transition-all"
              aria-label="Zoeken"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative p-2.5 text-warm-600 hover:text-primary-600 hover:bg-warm-100 rounded-xl transition-all z-50"
              aria-label={mobileMenuOpen ? 'Sluit menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-5 h-5 relative">
                <span className={`absolute left-0 block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                  mobileMenuOpen ? 'top-[9px] rotate-45' : 'top-1'
                }`} />
                <span className={`absolute left-0 top-[9px] block w-5 h-0.5 bg-current transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`} />
                <span className={`absolute left-0 block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                  mobileMenuOpen ? 'top-[9px] -rotate-45' : 'top-[17px]'
                }`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute inset-x-0 top-full transition-all duration-300 ease-out ${
        mobileMenuOpen 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="bg-white/95 backdrop-blur-md border-b border-warm-200 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            <Link 
              href="/" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive('/') && pathname === '/'
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-warm-700 hover:bg-warm-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <Link 
              href="/sermons" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive('/sermons')
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-warm-700 hover:bg-warm-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Preken
            </Link>

            <Link 
              href="/dominees" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive('/dominees')
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-warm-700 hover:bg-warm-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Dominees
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

