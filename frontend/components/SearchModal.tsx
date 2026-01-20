'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearch } from './SearchProvider';
import { SearchResult, highlightMatches } from '@/lib/search';
import { formatDate } from '@/lib/strapi';

export default function SearchModal() {
  const {
    isOpen,
    closeSearch,
    query,
    setQuery,
    filters,
    setFilters,
    clearFilters,
    results,
    suggestions,
    recentSearches,
    clearRecentSearches,
    isLoading,
    speakers,
    themes,
    yearRange,
    totalDocuments,
    selectSuggestion,
  } = useSearch();

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showFilters, setShowFilters] = useState(false);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setSelectedIndex(-1);
      setShowFilters(false);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const maxIndex = results.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, maxIndex));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        if (selectedIndex >= 0 && results[selectedIndex]) {
          e.preventDefault();
          const slug = results[selectedIndex].document.slug;
          closeSearch();
          window.location.href = `/sermons/${slug}`;
        }
        break;
      case 'Tab':
        if (suggestions.length > 0 && !e.shiftKey) {
          e.preventDefault();
          selectSuggestion(suggestions[0]);
        }
        break;
    }
  }, [results, selectedIndex, suggestions, selectSuggestion, closeSearch]);

  // Scroll selected result into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedEl = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop - 90s style with pattern */}
      <div 
        className="fixed inset-0 bg-warm-950/80"
        onClick={closeSearch}
      />

      {/* Modal - 90s Window Style */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-[10vh]">
        <div 
          className="relative w-full max-w-2xl window-90s overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Window Title Bar */}
          <div className="window-90s-titlebar flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span>🔍</span>
              <span>zoeken.exe</span>
            </span>
            <button 
              onClick={closeSearch}
              className="w-5 h-5 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center font-bold hover:bg-warm-100 active:bevel-pressed"
            >
              ×
            </button>
          </div>
          {/* Search Content Area */}
          <div className="window-90s-content p-0">
            {/* Search Input - 90s style */}
            <div className="p-2 bg-warm-200 border-b-2 border-warm-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bevel-outset bg-warm-200 flex items-center justify-center">
                  {isLoading ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <span>🔍</span>
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Zoek preken, bijbelteksten, sprekers..."
                  className="flex-1 input-90s text-sm"
                />

              {/* Filter button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-90s text-xs px-2 py-1 ${
                  showFilters || activeFilterCount > 0 ? 'bevel-pressed bg-warm-100' : ''
                }`}
              >
                ⚙️ Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 bevel-inset bg-primary-600 text-white px-1 text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              </div>
            </div>

          {/* Filters Panel - 90s style */}
          {showFilters && (
            <div className="border-b-2 border-warm-400 bg-warm-100 p-2">
              <div className="flex flex-wrap gap-3">
                {/* Speaker filter */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-bold text-warm-700 mb-1 uppercase">Spreker:</label>
                  <select
                    value={filters.speaker || ''}
                    onChange={e => setFilters({ ...filters, speaker: e.target.value || undefined })}
                    className="w-full input-90s text-sm"
                  >
                    <option value="">Alle sprekers</option>
                    {speakers.map(speaker => (
                      <option key={speaker} value={speaker}>{speaker}</option>
                    ))}
                  </select>
                </div>

                {/* Theme filter */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-bold text-warm-700 mb-1 uppercase">Thema:</label>
                  <select
                    value={filters.theme || ''}
                    onChange={e => setFilters({ ...filters, theme: e.target.value || undefined })}
                    className="w-full input-90s text-sm"
                  >
                    <option value="">Alle thema&apos;s</option>
                    {themes.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>

                {/* Year range */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs font-bold text-warm-700 mb-1 uppercase">Jaar:</label>
                  <div className="flex gap-1 items-center">
                    <select
                      value={filters.yearFrom || ''}
                      onChange={e => setFilters({ ...filters, yearFrom: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="flex-1 input-90s text-sm"
                    >
                      <option value="">Van</option>
                      {Array.from({ length: yearRange.max - yearRange.min + 1 }, (_, i) => yearRange.min + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <span className="text-warm-400">-</span>
                    <select
                      value={filters.yearTo || ''}
                      onChange={e => setFilters({ ...filters, yearTo: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="flex-1 input-90s text-sm"
                    >
                      <option value="">Tot</option>
                      {Array.from({ length: yearRange.max - yearRange.min + 1 }, (_, i) => yearRange.min + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Clear filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="btn-90s text-xs mt-2"
                >
                  ✖ Wis filters
                </button>
              )}
            </div>
          )}

          {/* Suggestions - 90s style */}
          {suggestions.length > 0 && query && (
            <div className="border-b-2 border-warm-400 px-2 py-1 bg-warm-50">
              <div className="flex flex-wrap items-center gap-2 text-xs text-warm-700">
                <span className="font-bold">Suggesties:</span>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className="btn-90s text-xs px-2 py-0.5"
                  >
                    {suggestion}
                  </button>
                ))}
                <kbd className="sm:ml-auto px-1.5 py-0.5 bevel-outset bg-warm-200 text-warm-700 text-xs font-mono">Tab</kbd>
              </div>
            </div>
          )}

          {/* Results / Recent Searches - 90s style */}
          <div ref={resultsRef} className="max-h-[50vh] overflow-y-auto bevel-inset bg-white m-1">
            {/* No query - show recent searches */}
            {!query && recentSearches.length > 0 && (
              <div className="p-3">
                <div className="flex items-center justify-between mb-2 border-b-2 border-warm-200 pb-1">
                  <h3 className="text-sm font-bold text-warm-700 uppercase">📜 Recente zoekopdrachten</h3>
                  <button
                    onClick={clearRecentSearches}
                    className="btn-90s text-xs px-2 py-0.5"
                  >
                    Wis
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="w-full btn-90s text-left text-sm flex items-center gap-2"
                    >
                      ⏳ {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No query and no recent - show hint */}
            {!query && recentSearches.length === 0 && (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bevel-outset bg-warm-200 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔍</span>
                </div>
                <p className="text-warm-700 font-bold uppercase">Begin met zoeken</p>
                <p className="text-warm-600 text-sm mt-1">
                  Doorzoek {totalDocuments} preken op titel, bijbeltekst, spreker of thema
                </p>
              </div>
            )}

            {/* Search results */}
            {query && results.length > 0 && (
              <div className="py-1">
                <div className="px-3 py-1 text-xs text-warm-700 font-bold border-b border-warm-200 bg-warm-50">
                  📌 {results.length} resultaten gevonden
                </div>
                {results.map((result, index) => (
                  <SearchResultItem
                    key={result.document.id}
                    result={result}
                    isSelected={index === selectedIndex}
                    onClick={closeSearch}
                  />
                ))}
              </div>
            )}

            {/* No results */}
            {query && results.length === 0 && !isLoading && (
              <div className="p-6 text-center">
                <div className="w-12 h-12 bevel-outset bg-warm-200 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">😞</span>
                </div>
                <p className="text-warm-700 font-bold uppercase">Geen resultaten</p>
                <p className="text-warm-600 text-sm mt-1">
                  Probeer een andere zoekterm of pas de filters aan
                </p>
              </div>
            )}
          </div>
          </div>

          {/* Footer - 90s status bar style */}
          <div className="border-t-2 border-warm-400 px-2 py-1 bg-warm-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-warm-700">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bevel-outset bg-warm-100 font-mono">↑↓</kbd>
                  Navigeren
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bevel-outset bg-warm-100 font-mono">Enter</kbd>
                  Openen
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bevel-outset bg-warm-100 font-mono">ESC</kbd>
                  Sluiten
                </span>
              </div>
              <span className="hidden sm:inline font-mono">Powered by Fuse.js</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual search result item - 90s style
function SearchResultItem({ 
  result, 
  isSelected, 
  onClick 
}: { 
  result: SearchResult; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const { document, matches } = result;

  // Find title match for highlighting
  const titleMatch = matches.find(m => m.key === 'title');
  const titleParts = titleMatch 
    ? highlightMatches(document.title, titleMatch.indices)
    : [{ text: document.title, highlighted: false }];

  return (
    <Link
      href={`/sermons/${document.slug}`}
      onClick={onClick}
      className={`block px-2 py-2 border-b border-warm-200 ${
        isSelected 
          ? 'bg-primary-600 text-white' 
          : 'hover:bg-warm-100'
      }`}
    >
      <div className="flex items-start gap-2">
        {/* Icon */}
        <div className={`w-8 h-8 bevel-outset flex items-center justify-center flex-shrink-0 ${
          isSelected ? 'bg-white text-primary-600' : 'bg-warm-200'
        }`}>
          📄
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title with highlights */}
          <h4 className={`font-bold truncate ${isSelected ? 'text-white' : 'text-warm-950'}`}>
            {titleParts.map((part, index) => (
              part.highlighted ? (
                <mark key={index} className={`px-0.5 ${isSelected ? 'bg-accent-400 text-warm-950' : 'bg-accent-400'}`}>
                  {part.text}
                </mark>
              ) : (
                <span key={index}>{part.text}</span>
              )
            ))}
          </h4>

          {/* Metadata */}
          <div className={`flex items-center gap-2 mt-1 text-xs font-mono ${isSelected ? 'text-white/80' : 'text-warm-600'}`}>
            <span>📅 {formatDate(document.date)}</span>
            {document.speakerName && (
              <>
                <span>|</span>
                <span>👤 {document.speakerName}</span>
              </>
            )}
            {document.bibleText && (
              <>
                <span>|</span>
                <span className="italic">📖 {document.bibleText}</span>
              </>
            )}
          </div>

          {/* Themes */}
          {document.themes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {document.themes.slice(0, 3).map(theme => (
                <span
                  key={theme.id}
                  className={`px-1 text-xs ${isSelected ? 'bevel-outset bg-white text-warm-700' : 'bevel-outset bg-accent-100 text-warm-700'}`}
                >
                  {theme.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Arrow */}
        <span className={`flex-shrink-0 ${isSelected ? 'text-white' : 'text-warm-400'}`}>▶</span>
      </div>
    </Link>
  );
}
