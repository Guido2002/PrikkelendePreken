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
    <header className={`sticky top-0 z-40 transition-all duration-500 ${
      scrolled 
        ? 'bg-wood-950/98 shadow-warm backdrop-blur-sm' 
        : 'bg-gradient-to-b from-wood-950/95 to-wood-950/90'
    }`}>
      {/* Subtle warm glow at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bronze-500/30 to-transparent" />
      
      <nav className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center gap-3 relative z-50"
          >
            {/* Elegant monogram */}
            <span className="w-10 h-10 rounded-sm bg-gradient-to-br from-bronze-500 to-bronze-700 flex items-center justify-center shadow-lg group-hover:shadow-glow transition-shadow duration-500">
              <span className="font-display text-wood-950 font-bold text-lg">PP</span>
            </span>
            <div className="hidden sm:block">
              <span className="font-display text-lg font-semibold text-cream-100 tracking-wide group-hover:text-bronze-400 transition-colors duration-300">
                Prikkelende Preken
              </span>
              <span className="block text-xs text-cream-400/60 tracking-widest uppercase">
                Preek Archief
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Nav Links */}
            <Link 
              href="/" 
              className={`px-4 py-2 text-sm font-body transition-all duration-300 rounded ${
                isActive('/') && pathname === '/'
                  ? 'text-bronze-400 bg-wood-900/50'
                  : 'text-cream-200 hover:text-bronze-400 hover:bg-wood-900/30'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/sermons" 
              className={`px-4 py-2 text-sm font-body transition-all duration-300 rounded ${
                isActive('/sermons')
                  ? 'text-bronze-400 bg-wood-900/50'
                  : 'text-cream-200 hover:text-bronze-400 hover:bg-wood-900/30'
              }`}
            >
              Preken
            </Link>
            <Link 
              href="/dominees" 
              className={`px-4 py-2 text-sm font-body transition-all duration-300 rounded ${
                isActive('/dominees')
                  ? 'text-bronze-400 bg-wood-900/50'
                  : 'text-cream-200 hover:text-bronze-400 hover:bg-wood-900/30'
              }`}
            >
              Dominees
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-gradient-to-b from-transparent via-bronze-600/40 to-transparent mx-3" />

            {/* Search Button */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2 px-4 py-2 text-sm font-body text-cream-200 hover:text-bronze-400 hover:bg-wood-900/30 rounded transition-all duration-300"
              aria-label="Zoeken"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Zoeken</span>
            </button>
          </div>

          {/* Mobile: Search + Menu buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={openSearch}
              className="p-2 text-cream-200 hover:text-bronze-400 transition-colors"
              aria-label="Zoeken"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 relative z-50 transition-colors ${
                mobileMenuOpen ? 'text-bronze-400' : 'text-cream-200 hover:text-bronze-400'
              }`}
              aria-label={mobileMenuOpen ? 'Sluit menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-5 h-5 relative flex items-center justify-center">
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Warm wood panel */}
      <div className={`md:hidden absolute inset-x-0 top-full transition-all duration-300 ${
        mobileMenuOpen 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}>
        <div className="mx-4 mt-2 card-70s overflow-hidden">
          <div className="p-4 space-y-1">
            <Link 
              href="/" 
              className={`block px-4 py-3 rounded transition-all duration-300 ${
                isActive('/') && pathname === '/'
                  ? 'text-bronze-400 bg-wood-900/50'
                  : 'text-cream-200 hover:text-bronze-400 hover:bg-wood-900/30'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/sermons" 
              className={`block px-4 py-3 rounded transition-all duration-300 ${
                isActive('/sermons')
                  ? 'text-bronze-400 bg-wood-900/50'
                  : 'text-cream-200 hover:text-bronze-400 hover:bg-wood-900/30'
              }`}
            >
              Preken
            </Link>
            <Link 
              href="/dominees" 
              className={`block px-4 py-3 rounded transition-all duration-300 ${
                isActive('/dominees')
                  ? 'text-bronze-400 bg-wood-900/50'
                  : 'text-cream-200 hover:text-bronze-400 hover:bg-wood-900/30'
              }`}
            >
              Dominees
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom border glow */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-bronze-600/20 to-transparent" />
    </header>
  );
}

