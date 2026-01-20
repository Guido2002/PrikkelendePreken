'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { SermonSearchEngine, SearchDocument, SearchResult, SearchFilters, SearchSort, getRecentSearches, addRecentSearch, clearRecentSearches } from '@/lib/search';

interface SearchContextType {
  // State
  isOpen: boolean;
  query: string;
  filters: SearchFilters;
  sort: SearchSort;
  results: SearchResult[];
  suggestions: string[];
  recentSearches: string[];
  isLoading: boolean;
  isIndexLoaded: boolean;
  
  // Metadata
  speakers: string[];
  themes: string[];
  yearRange: { min: number; max: number };
  totalDocuments: number;
  
  // Actions
  openSearch: () => void;
  closeSearch: () => void;
  setQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  setSort: (sort: SearchSort) => void;
  clearFilters: () => void;
  search: (query: string, filters?: SearchFilters) => void;
  clearRecentSearches: () => void;
  selectSuggestion: (suggestion: string) => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

interface SearchProviderProps {
  children: React.ReactNode;
  searchIndex: SearchDocument[];
}

export function SearchProvider({ children, searchIndex }: SearchProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sort, setSort] = useState<SearchSort>('relevance');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize search engine
  const searchEngine = useMemo(() => {
    return new SermonSearchEngine(searchIndex);
  }, [searchIndex]);

  const isIndexLoaded = searchIndex.length > 0;

  // Get metadata from search engine
  const speakers = useMemo(() => searchEngine.getSpeakers(), [searchEngine]);
  const themes = useMemo(() => searchEngine.getThemes(), [searchEngine]);
  const yearRange = useMemo(() => searchEngine.getYearRange(), [searchEngine]);
  const totalDocuments = searchEngine.getDocumentCount();

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Update suggestions when query changes
  useEffect(() => {
    if (query.length >= 2) {
      const newSuggestions = searchEngine.getSuggestions(query, 5);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query, searchEngine]);

  // Keyboard shortcut to open search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Perform search
  const search = useCallback((searchQuery: string, searchFilters?: SearchFilters) => {
    setIsLoading(true);
    
    // Small delay for UI feedback
    setTimeout(() => {
      const searchResults = searchEngine.search({
        query: searchQuery,
        filters: searchFilters || filters,
        sort,
        limit: 20,
      });
      
      setResults(searchResults);
      setIsLoading(false);
      
      // Save to recent searches
      if (searchQuery.trim()) {
        addRecentSearch(searchQuery);
        setRecentSearches(getRecentSearches());
      }
    }, 50);
  }, [searchEngine, filters, sort]);

  // Auto-search when query or filters change
  useEffect(() => {
    if (isOpen) {
      search(query, filters);
    }
  }, [query, filters, sort, isOpen, search]);

  const openSearch = useCallback(() => {
    setIsOpen(true);
    setRecentSearches(getRecentSearches());
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSuggestions([]);
  }, []);

  const clearFiltersAction = useCallback(() => {
    setFilters({});
  }, []);

  const handleClearRecentSearches = useCallback(() => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  const selectSuggestion = useCallback((suggestion: string) => {
    setQuery(suggestion);
  }, []);

  const value: SearchContextType = {
    isOpen,
    query,
    filters,
    sort,
    results,
    suggestions,
    recentSearches,
    isLoading,
    isIndexLoaded,
    speakers,
    themes,
    yearRange,
    totalDocuments,
    openSearch,
    closeSearch,
    setQuery,
    setFilters,
    setSort,
    clearFilters: clearFiltersAction,
    search,
    clearRecentSearches: handleClearRecentSearches,
    selectSuggestion,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}
