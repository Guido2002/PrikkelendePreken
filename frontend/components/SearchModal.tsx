'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearch } from './SearchProvider';
import { SearchResult, SearchSort, highlightMatches } from '@/lib/search';
import { formatDate } from '@/lib/strapi';

export default function SearchModal() {
  const router = useRouter();
  const {
    isOpen,
    closeSearch,
    query,
    setQuery,
    filters,
    setFilters,
    sort,
    setSort,
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
          router.push(`/sermons/${slug}`);
        } else if (results[0]) {
          // If nothing is selected, open the first result.
          e.preventDefault();
          const slug = results[0].document.slug;
          closeSearch();
          router.push(`/sermons/${slug}`);
        }
        break;
      case 'Tab':
        if (suggestions.length > 0 && !e.shiftKey) {
          e.preventDefault();
          selectSuggestion(suggestions[0]);
        }
        break;
    }
  }, [results, selectedIndex, suggestions, selectSuggestion, closeSearch, router]);

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
  const shouldShowResults = query.trim().length > 0 || activeFilterCount > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="pp-search-title">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Sluit zoeken"
        className="fixed inset-0 bg-warm-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeSearch}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-[10vh]">
        <div className="relative w-full max-w-2xl bg-white dark:bg-warm-950 rounded-2xl shadow-2xl overflow-hidden transform transition-all border border-warm-100/0 dark:border-warm-800/60">
          <h2 id="pp-search-title" className="sr-only">Zoeken</h2>
          {/* Search Header */}
          <div className="relative border-b border-warm-100 dark:border-warm-800">
            {/* Search icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              {isLoading ? (
                <svg className="w-5 h-5 text-primary-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-warm-400 dark:text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="w-full pl-11 sm:pl-12 pr-24 sm:pr-32 py-3.5 sm:py-4 text-base sm:text-lg bg-transparent text-warm-900 dark:text-warm-50 placeholder-warm-400 dark:placeholder-warm-500 focus:outline-none"
            />

            {/* Right side buttons */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                aria-controls="pp-search-filters"
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-200'
                    : 'bg-warm-100 text-warm-600 hover:bg-warm-200 dark:bg-warm-900/40 dark:text-warm-200 dark:hover:bg-warm-900/60'
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
            <div id="pp-search-filters" className="border-b border-warm-100 dark:border-warm-800 bg-warm-50/50 dark:bg-warm-900/20 p-4">
              <div className="flex flex-wrap gap-4">
                {/* Sort */}
                <div className="flex-1 min-w-[180px]">
                  <label htmlFor="pp-search-sort" className="block text-xs font-medium text-warm-600 dark:text-warm-300 mb-1.5">Sorteren</label>
                  <select
                    id="pp-search-sort"
                    value={sort}
                    onChange={e => setSort(e.target.value as SearchSort)}
                    className="w-full px-3 py-2 bg-white dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-800 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="relevance">Relevantie</option>
                    <option value="newest">Nieuwste eerst</option>
                    <option value="oldest">Oudste eerst</option>
                  </select>
                </div>

                {/* Has audio */}
                <div className="flex-1 min-w-[180px]">
                  <label htmlFor="pp-search-has-audio" className="block text-xs font-medium text-warm-600 dark:text-warm-300 mb-1.5">Audio</label>
                  <label className="w-full px-3 py-2 bg-white dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-800 dark:text-warm-100 flex items-center gap-2 cursor-pointer select-none">
                    <input
                      id="pp-search-has-audio"
                      type="checkbox"
                      checked={Boolean(filters.hasAudio)}
                      onChange={e => setFilters({ ...filters, hasAudio: e.target.checked ? true : undefined })}
                      className="accent-primary-600"
                    />
                    Alleen met audio
                  </label>
                </div>

                {/* Speaker filter */}
                <div className="flex-1 min-w-[180px]">
                  <label htmlFor="pp-search-speaker" className="block text-xs font-medium text-warm-600 dark:text-warm-300 mb-1.5">Spreker</label>
                  <select
                    id="pp-search-speaker"
                    value={filters.speaker || ''}
                    onChange={e => setFilters({ ...filters, speaker: e.target.value || undefined })}
                    className="w-full px-3 py-2 bg-white dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-800 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="">Alle sprekers</option>
                    {speakers.map(speaker => (
                      <option key={speaker} value={speaker}>{speaker}</option>
                    ))}
                  </select>
                </div>

                {/* Theme filter */}
                <div className="flex-1 min-w-[180px]">
                  <label htmlFor="pp-search-theme" className="block text-xs font-medium text-warm-600 dark:text-warm-300 mb-1.5">Thema</label>
                  <select
                    id="pp-search-theme"
                    value={filters.theme || ''}
                    onChange={e => setFilters({ ...filters, theme: e.target.value || undefined })}
                    className="w-full px-3 py-2 bg-white dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-800 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="">Alle thema&apos;s</option>
                    {themes.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>

                {/* Year range */}
                <div className="flex-1 min-w-[180px]">
                  <span className="block text-xs font-medium text-warm-600 dark:text-warm-300 mb-1.5">Jaar</span>
                  <div className="flex gap-2 items-center">
                    <select
                      aria-label="Jaar van"
                      value={filters.yearFrom || ''}
                      onChange={e => setFilters({ ...filters, yearFrom: e.target.value ? Number.parseInt(e.target.value, 10) : undefined })}
                      className="flex-1 px-3 py-2 bg-white dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-800 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      <option value="">Van</option>
                      {Array.from({ length: yearRange.max - yearRange.min + 1 }, (_, i) => yearRange.min + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <span className="text-warm-400 dark:text-warm-500">-</span>
                    <select
                      aria-label="Jaar tot"
                      value={filters.yearTo || ''}
                      onChange={e => setFilters({ ...filters, yearTo: e.target.value ? Number.parseInt(e.target.value, 10) : undefined })}
                      className="flex-1 px-3 py-2 bg-white dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 rounded-lg text-sm text-warm-800 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
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
                  className="mt-3 text-sm text-primary-600 dark:text-primary-200 hover:text-primary-700 dark:hover:text-primary-100 font-medium flex items-center gap-1"
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
            <div className="border-b border-warm-100 dark:border-warm-800 px-4 py-2 bg-warm-50/30 dark:bg-warm-900/10">
              <div className="flex flex-wrap items-center gap-2 text-xs text-warm-500">
                <span>Suggesties:</span>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    onClick={() => selectSuggestion(suggestion)}
                    className="px-2 py-0.5 bg-white dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 rounded text-warm-700 dark:text-warm-100 hover:border-primary-300 dark:hover:border-primary-400/40 hover:text-primary-600 dark:hover:text-primary-200 transition-colors"
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
            {!query && activeFilterCount === 0 && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-warm-600 dark:text-warm-200">Recente zoekopdrachten</h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-warm-400 hover:text-warm-600 dark:hover:text-warm-200"
                  >
                    Wis geschiedenis
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={search}
                      onClick={() => setQuery(search)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-warm-700 dark:text-warm-100 hover:bg-warm-50 dark:hover:bg-warm-900/30 transition-colors"
                    >
                      <svg className="w-4 h-4 text-warm-400 dark:text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No query and no recent - show hint */}
            {!query && activeFilterCount === 0 && recentSearches.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-warm-100 dark:bg-warm-900/40 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-warm-400 dark:text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-warm-600 dark:text-warm-100 font-medium">Begin met zoeken</p>
                <p className="text-warm-400 dark:text-warm-400 text-sm mt-1">
                  Doorzoek {totalDocuments} preken op titel, bijbeltekst, spreker of thema
                </p>
              </div>
            )}

            {/* Search results */}
            {shouldShowResults && results.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 text-xs text-warm-500 dark:text-warm-300">
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
            {shouldShowResults && results.length === 0 && !isLoading && (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-warm-100 dark:bg-warm-900/40 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-warm-400 dark:text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-warm-600 dark:text-warm-100 font-medium">Geen resultaten</p>
                <p className="text-warm-400 dark:text-warm-400 text-sm mt-1">
                  Probeer een andere zoekterm of pas de filters aan
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-warm-100 dark:border-warm-800 px-4 py-3 bg-warm-50/50 dark:bg-warm-900/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-warm-500">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 rounded">↑↓</kbd>
                  Navigeren
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 rounded">Enter</kbd>
                  Openen
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 rounded">ESC</kbd>
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
}: Readonly<{ 
  result: SearchResult; 
  isSelected: boolean;
  onClick: () => void;
}>) {
  const { document, matches } = result;

  // Find title match for highlighting
  const titleMatch = matches.find(m => m.key === 'title');
  const titleParts = titleMatch 
    ? highlightMatches(document.title, titleMatch.indices)
    : [{ text: document.title, highlighted: false }];

  let titleOffset = 0;

  return (
    <Link
      href={`/sermons/${document.slug}`}
      onClick={onClick}
      className={`block px-4 py-3 transition-colors ${
        isSelected 
          ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-primary-500' 
          : 'hover:bg-warm-50 dark:hover:bg-warm-900/30 border-l-2 border-transparent'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isSelected ? 'bg-primary-100 dark:bg-primary-900/25' : 'bg-warm-100 dark:bg-warm-900/40'
        }`}>
          <svg className={`w-5 h-5 ${isSelected ? 'text-primary-600' : 'text-warm-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title with highlights */}
          <h4 className="font-semibold text-warm-900 dark:text-warm-50 truncate">
            {titleParts.map((part) => {
              const key = `${titleOffset}-${part.highlighted}`;
              titleOffset += part.text.length;
              return part.highlighted ? (
                <mark key={key} className="bg-primary-200/50 text-primary-900 dark:bg-primary-800/30 dark:text-primary-100 rounded px-0.5">
                  {part.text}
                </mark>
              ) : (
                <span key={key}>{part.text}</span>
              );
            })}
          </h4>

          {/* Metadata */}
          <div className="flex items-center gap-3 mt-1 text-sm text-warm-500 dark:text-warm-300">
            <span>{formatDate(document.date)}</span>
            {document.speakerName && (
              <>
                <span className="text-warm-300 dark:text-warm-600">•</span>
                <span>{document.speakerName}</span>
              </>
            )}
            {document.bibleText && (
              <>
                <span className="text-warm-300 dark:text-warm-600">•</span>
                <span className="italic text-warm-600 dark:text-warm-200">{document.bibleText}</span>
              </>
            )}
          </div>

          {/* Themes */}
          {document.themes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {document.themes.slice(0, 3).map(theme => (
                <span
                  key={theme.id}
                  className="px-2 py-0.5 bg-accent-100 dark:bg-accent-700/20 text-accent-700 dark:text-accent-100 rounded text-xs"
                >
                  {theme.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Arrow */}
        <svg className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-primary-500' : 'text-warm-300 dark:text-warm-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
