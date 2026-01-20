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
      {/* Backdrop with smoke effect */}
      <div 
        className="fixed inset-0 bg-wood-950/90 backdrop-blur-sm"
        onClick={closeSearch}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-[10vh]">
        <div 
          className="relative w-full max-w-2xl card-70s overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-bronze-800/30">
            <h2 className="font-display text-cream-100 text-lg">Zoeken</h2>
            <button 
              onClick={closeSearch}
              className="p-1 text-cream-400 hover:text-bronze-400 transition-colors"
              aria-label="Sluiten"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Input */}
          <div className="p-4 bg-wood-900/50">
            <div className="flex items-center gap-3">
              <div className="text-bronze-500">
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Zoek preken, bijbelteksten, sprekers..."
                className="flex-1 bg-transparent text-cream-100 placeholder-cream-500/40 outline-none text-lg"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-all ${
                  showFilters || activeFilterCount > 0 
                    ? 'bg-bronze-600/30 text-bronze-400 border border-bronze-600/50' 
                    : 'text-cream-400 hover:text-bronze-400 border border-transparent hover:border-bronze-700/30'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-bronze-500 text-wood-950 text-xs flex items-center justify-center font-semibold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="px-4 py-3 bg-wood-900/30 border-b border-bronze-800/20">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Speaker filter */}
                <div>
                  <label className="block text-xs text-cream-400/60 mb-1.5 tracking-wide">Spreker</label>
                  <select
                    value={filters.speaker || ''}
                    onChange={e => setFilters({ ...filters, speaker: e.target.value || undefined })}
                    className="input-70s w-full text-sm"
                  >
                    <option value="">Alle sprekers</option>
                    {speakers.map(speaker => (
                      <option key={speaker} value={speaker}>{speaker}</option>
                    ))}
                  </select>
                </div>

                {/* Theme filter */}
                <div>
                  <label className="block text-xs text-cream-400/60 mb-1.5 tracking-wide">Thema</label>
                  <select
                    value={filters.theme || ''}
                    onChange={e => setFilters({ ...filters, theme: e.target.value || undefined })}
                    className="input-70s w-full text-sm"
                  >
                    <option value="">Alle thema&apos;s</option>
                    {themes.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>

                {/* Year range */}
                <div>
                  <label className="block text-xs text-cream-400/60 mb-1.5 tracking-wide">Jaar</label>
                  <div className="flex gap-2 items-center">
                    <select
                      value={filters.yearFrom || ''}
                      onChange={e => setFilters({ ...filters, yearFrom: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="flex-1 input-70s text-sm"
                    >
                      <option value="">Van</option>
                      {Array.from({ length: yearRange.max - yearRange.min + 1 }, (_, i) => yearRange.min + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <span className="text-cream-500/40">–</span>
                    <select
                      value={filters.yearTo || ''}
                      onChange={e => setFilters({ ...filters, yearTo: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="flex-1 input-70s text-sm"
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
                  className="mt-3 text-sm text-bronze-400 hover:text-bronze-300 transition-colors"
                >
                  Wis filters
                </button>
              )}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && query && (
            <div className="px-4 py-2 border-b border-bronze-800/20 bg-wood-900/20">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-cream-500/60">Suggesties:</span>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className="px-2 py-0.5 text-bronze-400 hover:text-bronze-300 bg-bronze-900/30 rounded transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
                <kbd className="ml-auto px-1.5 py-0.5 bg-wood-900 text-cream-500/50 text-xs rounded">Tab</kbd>
              </div>
            </div>
          )}

          {/* Results / Recent Searches */}
          <div ref={resultsRef} className="max-h-[50vh] overflow-y-auto">
            {/* No query - show recent searches */}
            {!query && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm text-cream-400/60">Recente zoekopdrachten</h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-bronze-400 hover:text-bronze-300 transition-colors"
                  >
                    Wis
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="w-full px-3 py-2 text-left text-cream-300 hover:bg-wood-800/50 rounded transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-cream-500/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No query and no recent - show hint */}
            {!query && recentSearches.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-wood-800/50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-bronze-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="font-display text-cream-200">Begin met zoeken</p>
                <p className="text-cream-400/60 text-sm mt-1">
                  Doorzoek {totalDocuments} preken op titel, bijbeltekst, spreker of thema
                </p>
              </div>
            )}

            {/* Search results */}
            {query && results.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs text-cream-500/60 border-b border-bronze-800/20">
                  {results.length} resultaten gevonden
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
              <div className="p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-wood-800/50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-cream-500/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-display text-cream-200">Geen resultaten</p>
                <p className="text-cream-400/60 text-sm mt-1">
                  Probeer een andere zoekterm of pas de filters aan
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-bronze-800/30 bg-wood-900/30">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-cream-500/50">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-wood-800 rounded">↑↓</kbd>
                Navigeren
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-wood-800 rounded">Enter</kbd>
                Openen
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-wood-800 rounded">Esc</kbd>
                Sluiten
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual search result item
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
      className={`block px-4 py-3 border-b border-bronze-800/10 transition-colors ${
        isSelected 
          ? 'bg-bronze-600/20' 
          : 'hover:bg-wood-800/30'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${
          isSelected ? 'bg-bronze-600/30' : 'bg-wood-800/50'
        }`}>
          <svg className="w-5 h-5 text-bronze-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title with highlights */}
          <h4 className="font-display text-cream-100 truncate">
            {titleParts.map((part, index) => (
              part.highlighted ? (
                <mark key={index} className="bg-bronze-500/30 text-bronze-300 px-0.5 rounded">
                  {part.text}
                </mark>
              ) : (
                <span key={index}>{part.text}</span>
              )
            ))}
          </h4>

          {/* Metadata */}
          <div className="flex items-center gap-2 mt-1 text-xs text-cream-400/60">
            <span>{formatDate(document.date)}</span>
            {document.speakerName && (
              <>
                <span>·</span>
                <span>{document.speakerName}</span>
              </>
            )}
            {document.bibleText && (
              <>
                <span>·</span>
                <span className="italic text-cream-400/70">{document.bibleText}</span>
              </>
            )}
          </div>

          {/* Themes */}
          {document.themes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {document.themes.slice(0, 3).map(theme => (
                <span
                  key={theme.id}
                  className="px-2 py-0.5 text-xs bg-wood-800/50 text-cream-400/70 rounded"
                >
                  {theme.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Arrow */}
        <svg className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-bronze-400' : 'text-cream-500/30'}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </Link>
  );
}
