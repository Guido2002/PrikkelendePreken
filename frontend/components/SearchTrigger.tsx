'use client';

import { useSearch } from './SearchProvider';

export default function SearchTrigger() {
  const { openSearch } = useSearch();

  return (
    <button
      onClick={openSearch}
      className="w-full max-w-xl mx-auto flex items-center gap-3 px-5 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-left text-warm-200 hover:bg-white/15 hover:border-white/30 transition-all group"
    >
      <svg className="w-5 h-5 text-warm-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="flex-1">Zoek preken, sprekers, bijbelteksten...</span>
      <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/10 rounded-lg text-xs text-warm-300">
        <span>⌘</span>K
      </kbd>
    </button>
  );
}
