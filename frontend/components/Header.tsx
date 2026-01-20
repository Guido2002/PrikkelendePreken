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
    <header className={`sticky top-0 z-40 bevel-outset bg-warm-200 ${
      scrolled ? 'shadow-md' : ''
    }`}>
      <nav className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center gap-2 relative z-50"
          >
            <span className="w-8 h-8 bevel-outset bg-primary-600 flex items-center justify-center text-white font-bold text-xs">
              PP
            </span>
            <span className="text-base font-bold text-warm-950 hidden sm:block">
              Prikkelende Preken
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Nav Links */}
            <Link 
              href="/" 
              className={`btn-90s text-xs ${
                isActive('/') && pathname === '/'
                  ? 'bevel-pressed bg-warm-100'
                  : ''
              }`}
            >
              Home
            </Link>
            <Link 
              href="/sermons" 
              className={`btn-90s text-xs ${
                isActive('/sermons')
                  ? 'bevel-pressed bg-warm-100'
                  : ''
              }`}
            >
              Preken
            </Link>

            <Link 
              href="/dominees" 
              className={`btn-90s text-xs ${
                isActive('/dominees')
                  ? 'bevel-pressed bg-warm-100'
                  : ''
              }`}
            >
              Dominees
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-warm-400 mx-2" />

            {/* Search Button */}
            <button
              onClick={openSearch}
              className="btn-90s text-xs flex items-center gap-2"
              aria-label="Zoeken"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Zoeken
            </button>
          </div>

          {/* Mobile: Search + Menu buttons */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={openSearch}
              className="btn-90s p-2"
              aria-label="Zoeken"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`btn-90s p-2 relative z-50 ${mobileMenuOpen ? 'bevel-pressed' : ''}`}
              aria-label={mobileMenuOpen ? 'Sluit menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-5 h-5 relative flex items-center justify-center">
                {mobileMenuOpen ? '×' : '☰'}
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - 90s Window Style */}
      <div className={`md:hidden absolute inset-x-4 top-full mt-1 ${
        mobileMenuOpen ? 'block' : 'hidden'
      }`}>
        <div className="window-90s">
          <div className="window-90s-titlebar text-sm flex items-center justify-between">
            <span>📁 Navigatie</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="w-4 h-4 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center font-bold"
            >
              ×
            </button>
          </div>
          <div className="window-90s-content p-2 space-y-1">
            <Link 
              href="/" 
              className={`btn-90s w-full text-left flex items-center gap-2 ${
                isActive('/') && pathname === '/'
                  ? 'bevel-pressed bg-warm-100'
                  : ''
              }`}
            >
              🏠 Home
            </Link>
            <Link 
              href="/sermons" 
              className={`btn-90s w-full text-left flex items-center gap-2 ${
                isActive('/sermons')
                  ? 'bevel-pressed bg-warm-100'
                  : ''
              }`}
            >
              🎤 Preken
            </Link>

            <Link 
              href="/dominees" 
              className={`btn-90s w-full text-left flex items-center gap-2 ${
                isActive('/dominees')
                  ? 'bevel-pressed bg-warm-100'
                  : ''
              }`}
            >
              👤 Dominees
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

