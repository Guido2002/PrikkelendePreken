'use client';

import { useSearch } from './SearchProvider';

export default function SearchTrigger() {
  const { openSearch } = useSearch();

  return (
    <button
      onClick={openSearch}
      className="flex items-center gap-2 px-4 py-2 bg-wood-900/50 border border-bronze-800/30 rounded text-cream-400/70 hover:text-cream-200 hover:border-bronze-700/50 hover:bg-wood-900/70 transition-all duration-300"
      aria-label="Zoeken (Ctrl+K)"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="text-sm">Zoeken...</span>
      <kbd className="hidden sm:inline-block px-1.5 py-0.5 ml-2 text-xs bg-wood-800/50 border border-bronze-800/30 rounded text-cream-500/50">
        ⌘K
      </kbd>
    </button>
  );
}
