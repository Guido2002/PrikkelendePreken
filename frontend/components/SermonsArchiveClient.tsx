'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SermonCard from '@/components/SermonCard';
import Pagination from '@/components/Pagination';
import { useSearch } from '@/components/SearchProvider';
import type { SearchDocument } from '@/lib/search';
import type { SermonCardData } from '@/components/SermonCard';
import type { Sermon, Speaker, Theme } from '@/lib/types';

type PaginationMeta = {
  page: number;
  pageCount: number;
  total: number;
};

type Props = {
  initialSermons: Sermon[];
  initialPagination: PaginationMeta;
  speakers: Speaker[];
  themes: Theme[];
  pageSize: number;
};

function getPageFromPathname(pathname: string): number {
  // Supported:
  // - /sermons => 1
  // - /sermons/page/3 => 3
  const re = /\/sermons\/page\/(\d+)/;
  const match = re.exec(pathname);
  if (match?.[1]) {
    const n = Number(match[1]);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }
  return 1;
}

function safeNumber(value: string | null): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeQuery(text: string): string {
  return text
    .toLowerCase()
    .replaceAll(/\s+/g, ' ')
    .trim();
}

function matchesAllTokens(haystack: string, query: string): boolean {
  const normalized = normalizeQuery(query);
  if (!normalized) return true;
  const tokens = normalized.split(' ').filter(Boolean);
  if (tokens.length === 0) return true;
  const h = normalizeQuery(haystack);
  return tokens.every((t) => h.includes(t));
}

function byDateDesc(a: SearchDocument, b: SearchDocument) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

function setOrDelete(params: URLSearchParams, key: string, value: string | null | undefined) {
  const trimmed = value?.trim();
  if (trimmed) params.set(key, trimmed);
  else params.delete(key);
}

function setOrDeleteNumber(params: URLSearchParams, key: string, value: number | null | undefined) {
  if (value === undefined) return;
  if (value === null) {
    params.delete(key);
    return;
  }
  params.set(key, String(value));
}

export default function SermonsArchiveClient({
  initialSermons,
  initialPagination,
  speakers,
  themes,
  pageSize,
}: Readonly<Props>) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { documents, yearRange, isIndexLoaded } = useSearch();

  const currentPage = useMemo(() => getPageFromPathname(pathname), [pathname]);

  const speakerSlug = searchParams.get('speaker') || '';
  const themeSlug = searchParams.get('theme') || '';
  const audioOnly = searchParams.get('audio') === '1' || searchParams.get('audio') === 'true';
  const queryText = searchParams.get('q') || '';
  const yearFrom = safeNumber(searchParams.get('yearFrom'));
  const yearTo = safeNumber(searchParams.get('yearTo'));

  const selectedSpeakerName = useMemo(() => {
    if (!speakerSlug) return '';
    return speakers.find((s) => s.slug === speakerSlug)?.name ?? '';
  }, [speakerSlug, speakers]);

  const selectedThemeName = useMemo(() => {
    if (!themeSlug) return '';
    return themes.find((t) => t.slug === themeSlug)?.name ?? '';
  }, [themeSlug, themes]);

  const filteredDocs = useMemo(() => {
    // Prefer the prebuilt search index (works offline/no network). If it's empty,
    // fall back to just the initial page's data.
    if (!documents || documents.length === 0) {
      return [] as SearchDocument[];
    }

    const sorted = [...documents].sort(byDateDesc);

    return sorted.filter((doc) => {
      if (selectedSpeakerName && doc.speakerName !== selectedSpeakerName) {
        return false;
      }

      if (selectedThemeName && !doc.themes.some((t) => t.name === selectedThemeName)) {
        return false;
      }

      if (audioOnly && !doc.hasAudio) {
        return false;
      }

      if (yearFrom !== null && doc.year < yearFrom) {
        return false;
      }

      if (yearTo !== null && doc.year > yearTo) {
        return false;
      }

      if (queryText && !matchesAllTokens(doc.searchableText, queryText)) {
        return false;
      }

      return true;
    });
  }, [documents, selectedSpeakerName, selectedThemeName, audioOnly, yearFrom, yearTo, queryText]);

  const pagination = useMemo((): PaginationMeta => {
    // If the index isn't loaded, just keep whatever the server rendered.
    if (!documents || documents.length === 0) {
      return initialPagination;
    }

    const total = filteredDocs.length;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(Math.max(1, currentPage), pageCount);
    return { page, pageCount, total };
  }, [documents, filteredDocs.length, pageSize, currentPage, initialPagination]);

  // If user is on a page number that's now out-of-range due to filters,
  // keep the URL consistent by navigating to page 1.
  useEffect(() => {
    if (!documents || documents.length === 0) return;
    if (currentPage <= pagination.pageCount) return;

    const params = new URLSearchParams(searchParams.toString());
    const qs = params.toString();
    router.replace(qs ? `/sermons?${qs}` : '/sermons');
  }, [documents, currentPage, pagination.pageCount, router, searchParams]);

  const sermons: SermonCardData[] = useMemo(() => {
    // When index isn't available, show the server-rendered list.
    if (!documents || documents.length === 0) {
      return initialSermons as unknown as SermonCardData[];
    }

    const startIndex = (pagination.page - 1) * pageSize;
    const pageDocs = filteredDocs.slice(startIndex, startIndex + pageSize);

    const speakerSlugByName = new Map<string, string>();
    for (const s of speakers) {
      speakerSlugByName.set(s.name, s.slug);
    }

    return pageDocs.map((doc) => {
      const slug = speakerSlugByName.get(doc.speakerName ?? '') ?? null;
      const speaker = doc.speakerName
        ? {
            name: doc.speakerName,
            slug: slug ?? '',
          }
        : null;

      return {
        id: doc.id,
        slug: doc.slug,
        title: doc.title,
        date: doc.date,
        summary: doc.summary,
        bibleText: doc.bibleText,
        bibleReference: null,
        audio: doc.hasAudio
          ? ({
              id: doc.id,
              documentId: '',
              name: 'audio',
              url: '',
              mime: '',
              size: 0,
            } as const)
          : null,
        speaker: speaker && slug ? ({ id: 0, documentId: '', name: speaker.name, slug, bio: null, createdAt: '', updatedAt: '' } as const) : null,
        themes: [],
        plaats: null,
      };
    });
  }, [documents, initialSermons, filteredDocs, pagination.page, pageSize, speakers]);

  const selectedThemeLabel = selectedThemeName || "Alle thema's";

  function updateFilters(next: {
    speaker?: string;
    theme?: string;
    audio?: boolean;
    q?: string;
    yearFrom?: number | null;
    yearTo?: number | null;
  }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.speaker !== undefined) setOrDelete(params, 'speaker', next.speaker);
    if (next.theme !== undefined) setOrDelete(params, 'theme', next.theme);

    if (next.audio !== undefined) {
      if (next.audio) params.set('audio', '1');
      else params.delete('audio');
    }

    if (next.q !== undefined) setOrDelete(params, 'q', next.q);
    setOrDeleteNumber(params, 'yearFrom', next.yearFrom);
    setOrDeleteNumber(params, 'yearTo', next.yearTo);

    const qs = params.toString();
    router.push(qs ? `/sermons?${qs}` : '/sermons');
  }

  function clearAll() {
    router.push('/sermons');
  }

  const filtersActive = Boolean(speakerSlug || themeSlug || audioOnly || queryText || yearFrom !== null || yearTo !== null);

  return (
    <div className="lg:grid lg:grid-cols-[320px_1fr] gap-8">
      {/* Sidebar filters */}
      <aside className="mb-10 lg:mb-0">
        <div className="sticky top-24 bg-white dark:bg-warm-900/40 rounded-2xl shadow-soft border border-warm-100 dark:border-warm-800/60 overflow-hidden">
          <div className="px-6 py-5 border-b border-warm-100 dark:border-warm-800/60">
            <h2 className="text-lg font-bold text-warm-900 dark:text-warm-50">Filters</h2>
            <p className="text-sm text-warm-500 dark:text-warm-300 mt-1">
              Filter op spreker, thema of audio.
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Speaker */}
            <div>
              <label htmlFor="speakerFilter" className="block text-sm font-semibold text-warm-800 dark:text-warm-100 mb-2">Spreker</label>
              <select
                id="speakerFilter"
                value={speakerSlug}
                onChange={(e) => updateFilters({ speaker: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-warm-50 dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 text-warm-800 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-primary-400/40"
              >
                <option value="">Alle sprekers</option>
                {speakers.map((s) => (
                  <option key={s.id} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-warm-500 dark:text-warm-400 mt-2">Geselecteerd: {selectedSpeakerName}</p>
            </div>

            {/* Theme */}
            <div>
              <label htmlFor="themeFilter" className="block text-sm font-semibold text-warm-800 dark:text-warm-100 mb-2">Thema</label>
              <select
                id="themeFilter"
                value={themeSlug}
                onChange={(e) => updateFilters({ theme: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-warm-50 dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 text-warm-800 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-primary-400/40"
              >
                <option value="">Alle thema\'s</option>
                {themes.map((t) => (
                  <option key={t.id} value={t.slug}>
                    {t.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-warm-500 dark:text-warm-400 mt-2">Geselecteerd: {selectedThemeLabel}</p>
            </div>

            {/* Year range */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="block text-sm font-semibold text-warm-800 dark:text-warm-100">Jaar</span>
                <span className="text-xs text-warm-500 dark:text-warm-400">{yearRange.min}–{yearRange.max}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="yearFrom" className="block text-xs text-warm-600 dark:text-warm-300 mb-1">Vanaf</label>
                  <input
                    id="yearFrom"
                    inputMode="numeric"
                    value={yearFrom ?? ''}
                    onChange={(e) => updateFilters({ yearFrom: safeNumber(e.target.value) })}
                    placeholder={String(yearRange.min)}
                    className="w-full h-11 px-4 rounded-xl bg-warm-50 dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 text-warm-800 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-primary-400/40"
                  />
                </div>
                <div>
                  <label htmlFor="yearTo" className="block text-xs text-warm-600 dark:text-warm-300 mb-1">Tot</label>
                  <input
                    id="yearTo"
                    inputMode="numeric"
                    value={yearTo ?? ''}
                    onChange={(e) => updateFilters({ yearTo: safeNumber(e.target.value) })}
                    placeholder={String(yearRange.max)}
                    className="w-full h-11 px-4 rounded-xl bg-warm-50 dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 text-warm-800 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-primary-400/40"
                  />
                </div>
              </div>
            </div>

            {/* Quick text filter */}
            <div>
              <label htmlFor="qFilter" className="block text-sm font-semibold text-warm-800 dark:text-warm-100 mb-2">Tekst</label>
              <input
                id="qFilter"
                value={queryText}
                onChange={(e) => updateFilters({ q: e.target.value })}
                placeholder="Zoek in titel/tekst…"
                className="w-full h-11 px-4 rounded-xl bg-warm-50 dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 text-warm-800 dark:text-warm-100 focus:outline-none focus:ring-2 focus:ring-primary-400/40"
              />
              <p className="text-xs text-warm-500 dark:text-warm-400 mt-2">Tip: meerdere woorden werken ook.</p>
            </div>

            {/* Audio */}
            <div className="flex items-start gap-3">
              <input
                id="audioOnly"
                type="checkbox"
                checked={audioOnly}
                onChange={(e) => updateFilters({ audio: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-warm-300 dark:border-warm-700 text-primary-600 focus:ring-primary-400"
              />
              <div>
                <label htmlFor="audioOnly" className="text-sm font-semibold text-warm-800 dark:text-warm-100">
                  Alleen met audio
                </label>
                <p className="text-xs text-warm-500 dark:text-warm-400 mt-1">Verberg preken zonder audio-bestand.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearAll}
                disabled={!filtersActive}
                className={
                  'inline-flex items-center justify-center h-11 px-4 rounded-xl font-semibold border transition-colors ' +
                  (filtersActive
                    ? 'bg-white dark:bg-warm-950/40 border-warm-200 dark:border-warm-800 text-warm-700 dark:text-warm-100 hover:bg-warm-50 dark:hover:bg-warm-900/30 hover:border-primary-300 dark:hover:border-primary-400/40'
                    : 'bg-warm-50 dark:bg-warm-900/20 border-warm-100 dark:border-warm-800 text-warm-400 dark:text-warm-500 cursor-not-allowed')
                }
              >
                Reset
              </button>

              {!isIndexLoaded && (
                <span className="text-sm text-warm-500 dark:text-warm-300">Index laden…</span>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <p className="text-warm-500 dark:text-warm-300 text-sm">
            Toon {sermons.length} van {pagination.total} preken
            {filtersActive && <span className="ml-2 text-primary-700 dark:text-primary-200 font-medium">(gefilterd)</span>}
          </p>
          <p className="text-warm-500 dark:text-warm-300 text-sm">Pagina {pagination.page} van {pagination.pageCount}</p>
        </div>

        {sermons.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {sermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>

            <Pagination currentPage={pagination.page} totalPages={pagination.pageCount} />
          </>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-warm-900/40 rounded-2xl shadow-soft border border-warm-100 dark:border-warm-800/60">
            <div className="w-20 h-20 bg-warm-100 dark:bg-warm-900/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-warm-700 dark:text-warm-100 text-xl font-medium mb-2">Geen preken gevonden.</p>
            <p className="text-warm-500 dark:text-warm-300">
              Pas je filters aan of <button type="button" onClick={clearAll} className="text-primary-700 dark:text-primary-200 font-semibold hover:underline">reset alles</button>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
