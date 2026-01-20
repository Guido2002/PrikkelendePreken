'use client';

import { useSearch } from './SearchProvider';

export default function SearchTrigger() {
  const { openSearch } = useSearch();

  return (
    <button
      onClick={openSearch}
      className="w-full max-w-xl mx-auto bevel-inset bg-white p-1"
    >
      <div className="flex items-center gap-3 px-3 py-2 bg-white">
        <div className="w-8 h-8 bevel-outset bg-primary-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <span className="flex-1 min-w-0 text-warm-500 text-sm text-left">
          🔍 Zoek preken, sprekers, bijbelteksten...
        </span>
        <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bevel-outset bg-warm-200 text-xs text-warm-700 font-mono">
          Ctrl+K
        </kbd>
      </div>
    </button>
  );
}
