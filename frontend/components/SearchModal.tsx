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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-warm-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeSearch}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-[10vh]">
        <div 
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all"
          onClick={e => e.stopPropagation()}
        >
          {/* Search Header */}
          <div className="relative border-b border-warm-100">
            {/* Search icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              {isLoading ? (
                <svg className="w-5 h-5 text-primary-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Zoek preken, bijbelteksten, sprekers..."
              className="w-full pl-11 sm:pl-12 pr-24 sm:pr-32 py-3.5 sm:py-4 text-base sm:text-lg bg-transparent text-warm-900 placeholder-warm-400 focus:outline-none"
            />

            {/* Right side buttons */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 flex items-center justify-center bg-primary-600 text-white rounded-full text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Keyboard shortcut hint */}
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-warm-100 text-warm-500 rounded text-xs font-mono">
                ESC
              </kbd>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-b border-warm-100 bg-warm-50/50 p-4">
              <div className="flex flex-wrap gap-4">
                {/* Speaker filter */}
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs font-medium text-warm-600 mb-1.5">Spreker</label>
                  <select
                    value={filters.speaker || ''}
                    onChange={e => setFilters({ ...filters, speaker: e.target.value || undefined })}
                    className="w-full px-3 py-2 bg-white border border-warm-200 rounded-lg text-sm text-warm-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="">Alle sprekers</option>
                    {speakers.map(speaker => (
                      <option key={speaker} value={speaker}>{speaker}</option>
                    ))}
                  </select>
                </div>

                {/* Theme filter */}
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs font-medium text-warm-600 mb-1.5">Thema</label>
                  <select
                    value={filters.theme || ''}
                    onChange={e => setFilters({ ...filters, theme: e.target.value || undefined })}
                    className="w-full px-3 py-2 bg-white border border-warm-200 rounded-lg text-sm text-warm-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="">Alle thema&apos;s</option>
                    {themes.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>

                {/* Year range */}
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs font-medium text-warm-600 mb-1.5">Jaar</label>
                  <div className="flex gap-2 items-center">
                    <select
                      value={filters.yearFrom || ''}
                      onChange={e => setFilters({ ...filters, yearFrom: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="flex-1 px-3 py-2 bg-white border border-warm-200 rounded-lg text-sm text-warm-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
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
                      className="flex-1 px-3 py-2 bg-white border border-warm-200 rounded-lg text-sm text-warm-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
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
                  className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Wis alle filters
                </button>
              )}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && query && (
            <div className="border-b border-warm-100 px-4 py-2 bg-warm-50/30">
              <div className="flex flex-wrap items-center gap-2 text-xs text-warm-500">
                <span>Suggesties:</span>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className="px-2 py-0.5 bg-white border border-warm-200 rounded text-warm-700 hover:border-primary-300 hover:text-primary-600 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
                <kbd className="sm:ml-auto px-1.5 py-0.5 bg-warm-100 text-warm-400 rounded text-xs">Tab</kbd>
              </div>
            </div>
          )}

          {/* Results / Recent Searches */}
          <div ref={resultsRef} className="max-h-[50vh] overflow-y-auto">
            {/* No query - show recent searches */}
            {!query && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-warm-600">Recente zoekopdrachten</h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-warm-400 hover:text-warm-600"
                  >
                    Wis geschiedenis
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-warm-700 hover:bg-warm-50 transition-colors"
                    >
                      <svg className="w-4 h-4 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                <div className="w-12 h-12 bg-warm-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-warm-600 font-medium">Begin met zoeken</p>
                <p className="text-warm-400 text-sm mt-1">
                  Doorzoek {totalDocuments} preken op titel, bijbeltekst, spreker of thema
                </p>
              </div>
            )}

            {/* Search results */}
            {query && results.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 text-xs text-warm-500">
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
                <div className="w-12 h-12 bg-warm-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-warm-600 font-medium">Geen resultaten</p>
                <p className="text-warm-400 text-sm mt-1">
                  Probeer een andere zoekterm of pas de filters aan
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-warm-100 px-4 py-3 bg-warm-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-warm-500">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-white border border-warm-200 rounded">↑↓</kbd>
                  Navigeren
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-white border border-warm-200 rounded">Enter</kbd>
                  Openen
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-white border border-warm-200 rounded">ESC</kbd>
                  Sluiten
                </span>
              </div>
              <span className="hidden sm:inline">Powered by Fuse.js</span>
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
      className={`block px-4 py-3 transition-colors ${
        isSelected 
          ? 'bg-primary-50 border-l-2 border-primary-500' 
          : 'hover:bg-warm-50 border-l-2 border-transparent'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isSelected ? 'bg-primary-100' : 'bg-warm-100'
        }`}>
          <svg className={`w-5 h-5 ${isSelected ? 'text-primary-600' : 'text-warm-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title with highlights */}
          <h4 className="font-semibold text-warm-900 truncate">
            {titleParts.map((part, index) => (
              part.highlighted ? (
                <mark key={index} className="bg-primary-200/50 text-primary-900 rounded px-0.5">
                  {part.text}
                </mark>
              ) : (
                <span key={index}>{part.text}</span>
              )
            ))}
          </h4>

          {/* Metadata */}
          <div className="flex items-center gap-3 mt-1 text-sm text-warm-500">
            <span>{formatDate(document.date)}</span>
            {document.speakerName && (
              <>
                <span className="text-warm-300">•</span>
                <span>{document.speakerName}</span>
              </>
            )}
            {document.bibleText && (
              <>
                <span className="text-warm-300">•</span>
                <span className="italic text-warm-600">{document.bibleText}</span>
              </>
            )}
          </div>

          {/* Themes */}
          {document.themes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {document.themes.slice(0, 3).map(theme => (
                <span
                  key={theme.id}
                  className="px-2 py-0.5 bg-accent-100 text-accent-700 rounded text-xs"
                >
                  {theme.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Arrow */}
        <svg className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-primary-500' : 'text-warm-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
