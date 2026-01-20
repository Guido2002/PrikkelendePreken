import Fuse, { FuseResult, IFuseOptions } from 'fuse.js';

// Search document type for indexing
export interface SearchDocument {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  bibleText: string | null;
  date: string;
  hasAudio: boolean;
  speakerName: string | null;
  speakerId: number | null;
  themes: { id: number; name: string }[];
  // Computed fields for better search
  searchableText: string;
  year: number;
  month: number;
}

// Search result with highlight info
export interface SearchResult {
  document: SearchDocument;
  score: number;
  matches: SearchMatch[];
}

export interface SearchMatch {
  key: string;
  value: string;
  indices: [number, number][];
}

// Filter options
export interface SearchFilters {
  speaker?: string;
  theme?: string;
  yearFrom?: number;
  yearTo?: number;
  hasAudio?: boolean;
}

export type SearchSort = 'relevance' | 'newest' | 'oldest';

// Search options
export interface SearchOptions {
  query: string;
  filters?: SearchFilters;
  limit?: number;
  threshold?: number;
  sort?: SearchSort;
}

// Fuse.js configuration for optimal sermon search
const fuseOptions: IFuseOptions<SearchDocument> = {
  // Keys to search with weights
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'bibleText', weight: 0.25 },
    { name: 'speakerName', weight: 0.15 },
    { name: 'summary', weight: 0.1 },
    { name: 'themes.name', weight: 0.1 },
    // Broad catch-all text that includes content.
    { name: 'searchableText', weight: 0.1 },
  ],
  // Search configuration
  threshold: 0.3, // Lower = stricter matching
  distance: 100,
  minMatchCharLength: 2,
  ignoreLocation: true,
  includeScore: true,
  includeMatches: true,
  useExtendedSearch: true,
  findAllMatches: true,
};

// Search engine class
export class SermonSearchEngine {
  private fuse: Fuse<SearchDocument>;
  private documents: SearchDocument[];
  private currentThreshold: number;

  constructor(documents: SearchDocument[]) {
    this.documents = documents;
    this.fuse = new Fuse(documents, fuseOptions);
    this.currentThreshold = fuseOptions.threshold ?? 0.3;
  }

  private updateThresholdIfNeeded(threshold: number | undefined) {
    if (threshold === undefined) return;
    if (threshold === this.currentThreshold) return;
    this.currentThreshold = threshold;
    this.fuse = new Fuse(this.documents, { ...fuseOptions, threshold });
  }

  // Main search method
  search(options: SearchOptions): SearchResult[] {
    const { query, filters, limit = 20, threshold, sort = 'relevance' } = options;

    this.updateThresholdIfNeeded(threshold);

    let results: FuseResult<SearchDocument>[];

    if (query.trim()) {
      // Perform fuzzy search
      results = this.fuse.search(query, { limit: limit * 2 });
    } else {
      // No query - return all documents sorted by date
      const sortedDocs = [...this.documents].sort((a, b) => {
        const aTime = new Date(a.date).getTime();
        const bTime = new Date(b.date).getTime();
        if (sort === 'oldest') return aTime - bTime;
        // default for empty query: newest first
        return bTime - aTime;
      });

      results = sortedDocs
        .slice(0, limit * 2)
        .map((doc, index) => ({
          item: doc,
          refIndex: index,
          score: 0,
        }));
    }

    // Apply filters
    let filtered = results;
    if (filters) {
      filtered = results.filter(({ item }) => {
        // Speaker filter
        if (filters.speaker && item.speakerName !== filters.speaker) {
          return false;
        }

        // Theme filter
        if (filters.theme && !item.themes.some(t => t.name === filters.theme)) {
          return false;
        }

        // Year range filter
        if (filters.yearFrom && item.year < filters.yearFrom) {
          return false;
        }
        if (filters.yearTo && item.year > filters.yearTo) {
          return false;
        }

        // Audio filter
        if (filters.hasAudio && !item.hasAudio) {
          return false;
        }

        return true;
      });
    }

    // Optional sorting when the user requests date ordering.
    if (sort !== 'relevance') {
      filtered = [...filtered].sort((a, b) => {
        const aTime = new Date(a.item.date).getTime();
        const bTime = new Date(b.item.date).getTime();
        return sort === 'oldest' ? aTime - bTime : bTime - aTime;
      });
    }

    // Transform to SearchResult format
    return filtered.slice(0, limit).map(({ item, score, matches }) => ({
      document: item,
      score: score || 0,
      matches: (matches || []).map(m => ({
        key: m.key || '',
        value: m.value || '',
        indices: m.indices as [number, number][],
      })),
    }));
  }

  // Get all unique speakers
  getSpeakers(): string[] {
    const speakers = new Set<string>();
    this.documents.forEach(doc => {
      if (doc.speakerName) speakers.add(doc.speakerName);
    });
    return Array.from(speakers).sort();
  }

  // Get all unique themes
  getThemes(): string[] {
    const themes = new Set<string>();
    this.documents.forEach(doc => {
      doc.themes.forEach(t => themes.add(t.name));
    });
    return Array.from(themes).sort();
  }

  // Get year range
  getYearRange(): { min: number; max: number } {
    if (this.documents.length === 0) {
      const currentYear = new Date().getFullYear();
      return { min: currentYear, max: currentYear };
    }
    const years = this.documents.map(d => d.year);
    return {
      min: Math.min(...years),
      max: Math.max(...years),
    };
  }

  // Get suggestions based on partial input
  getSuggestions(query: string, limit = 5): string[] {
    if (!query.trim() || query.length < 2) return [];

    const suggestions = new Set<string>();
    const lowerQuery = query.toLowerCase();

    // Check titles
    this.documents.forEach(doc => {
      if (doc.title.toLowerCase().includes(lowerQuery)) {
        suggestions.add(doc.title);
      }
    });

    // Check bible texts
    this.documents.forEach(doc => {
      if (doc.bibleText?.toLowerCase().includes(lowerQuery)) {
        suggestions.add(doc.bibleText);
      }
    });

    // Check speaker names
    this.documents.forEach(doc => {
      if (doc.speakerName?.toLowerCase().includes(lowerQuery)) {
        suggestions.add(doc.speakerName);
      }
    });

    // Check themes
    this.documents.forEach(doc => {
      doc.themes.forEach(theme => {
        if (theme.name.toLowerCase().includes(lowerQuery)) {
          suggestions.add(theme.name);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  }

  // Get total document count
  getDocumentCount(): number {
    return this.documents.length;
  }
}

// Highlight matched text
export function highlightMatches(
  text: string,
  indices: [number, number][]
): { text: string; highlighted: boolean }[] {
  if (!indices || indices.length === 0) {
    return [{ text, highlighted: false }];
  }

  const result: { text: string; highlighted: boolean }[] = [];
  let lastIndex = 0;

  // Sort indices by start position
  const sortedIndices = [...indices].sort((a, b) => a[0] - b[0]);

  sortedIndices.forEach(([start, end]) => {
    // Add non-highlighted text before match
    if (start > lastIndex) {
      result.push({
        text: text.slice(lastIndex, start),
        highlighted: false,
      });
    }

    // Add highlighted match
    result.push({
      text: text.slice(start, end + 1),
      highlighted: true,
    });

    lastIndex = end + 1;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    result.push({
      text: text.slice(lastIndex),
      highlighted: false,
    });
  }

  return result;
}

// Local storage keys
const RECENT_SEARCHES_KEY = 'sermon-search-recent';
const MAX_RECENT_SEARCHES = 10;

// Recent searches management
export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const recent = getRecentSearches();
    const filtered = recent.filter(s => s !== query);
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Ignore storage errors
  }
}
