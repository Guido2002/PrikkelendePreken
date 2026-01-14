'use client';

import { useSearch } from './SearchProvider';

export default function SearchTrigger() {
  const { openSearch } = useSearch();

  return (
    <button
      onClick={openSearch}
      className="w-full max-w-xl mx-auto flex items-center gap-4 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-left text-warm-200 hover:bg-white/15 hover:border-white/30 transition-all group shadow-lg shadow-black/5"
    >
      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
        <svg className="w-5 h-5 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <span className="flex-1 text-warm-300">Zoek preken, sprekers, bijbelteksten...</span>
      <kbd className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg text-xs text-warm-300 font-medium">
        <span className="text-sm">⌘</span>K
      </kbd>
    </button>
  );
}
