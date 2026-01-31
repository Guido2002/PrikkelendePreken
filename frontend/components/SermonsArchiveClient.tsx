'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SermonCard from '@/components/SermonCard';
import Pagination from '@/components/Pagination';
import type { Sermon, Speaker, Theme, StrapiResponse } from '@/lib/types';

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

function getStrapiBaseUrl(): string {
  // Must be NEXT_PUBLIC_* for client bundles
  return process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
}

async function fetchSermonsClient(params: {
  page: number;
  pageSize: number;
  speakerSlug?: string;
  themeSlug?: string;
  audioOnly?: boolean;
}): Promise<StrapiResponse<Sermon[]>> {
  const { page, pageSize, speakerSlug, themeSlug, audioOnly } = params;

  const qs = new URLSearchParams({
    populate: '*',
    sort: 'date:desc',
    'pagination[page]': String(page),
    'pagination[pageSize]': String(pageSize),
  });

  if (speakerSlug) {
    qs.append('filters[speaker][slug][$eq]', speakerSlug);
  }

  if (themeSlug) {
    qs.append('filters[themes][slug][$eq]', themeSlug);
  }

  if (audioOnly) {
    // Works for media field and most optional fields in Strapi v4
    qs.append('filters[audio][$notNull]', 'true');
  }

  const url = `${getStrapiBaseUrl()}/api/sermons?${qs.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to fetch sermons: ${res.status} ${res.statusText}`);
  }

  return res.json();
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

  const currentPage = useMemo(() => getPageFromPathname(pathname), [pathname]);

  const speakerSlug = searchParams.get('speaker') || '';
  const themeSlug = searchParams.get('theme') || '';
  const audioOnly = searchParams.get('audio') === '1' || searchParams.get('audio') === 'true';

  const [sermons, setSermons] = useState<Sermon[]>(initialSermons);
  const [pagination, setPagination] = useState<PaginationMeta>(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastRequestKeyRef = useRef<string>('');

  const isUsingInitial =
    !speakerSlug && !themeSlug && !audioOnly && currentPage === initialPagination.page;

  useEffect(() => {
    if (isUsingInitial) {
      // Reset to initial content when user cleared filters / returned to initial page
      setSermons(initialSermons);
      setPagination(initialPagination);
      setIsLoading(false);
      setError(null);
      return;
    }

    const requestKey = JSON.stringify({ currentPage, pageSize, speakerSlug, themeSlug, audioOnly });
    lastRequestKeyRef.current = requestKey;

    setIsLoading(true);
    setError(null);

    fetchSermonsClient({
      page: currentPage,
      pageSize,
      speakerSlug: speakerSlug || undefined,
      themeSlug: themeSlug || undefined,
      audioOnly,
    })
      .then((response) => {
        // Ignore stale responses
        if (lastRequestKeyRef.current !== requestKey) return;

        setSermons(response.data);
        setPagination({
          page: response.meta.pagination?.page ?? currentPage,
          pageCount: response.meta.pagination?.pageCount ?? 1,
          total: response.meta.pagination?.total ?? 0,
        });
      })
      .catch((e: unknown) => {
        if (lastRequestKeyRef.current !== requestKey) return;
        setError(e instanceof Error ? e.message : 'Er ging iets mis bij het laden van preken.');
        setSermons([]);
        setPagination({ page: currentPage, pageCount: 1, total: 0 });
      })
      .finally(() => {
        if (lastRequestKeyRef.current !== requestKey) return;
        setIsLoading(false);
      });
  }, [
    isUsingInitial,
    initialSermons,
    initialPagination,
    currentPage,
    pageSize,
    speakerSlug,
    themeSlug,
    audioOnly,
  ]);

  const selectedSpeakerName = useMemo(() => {
    if (!speakerSlug) return 'Alle sprekers';
    return speakers.find((s) => s.slug === speakerSlug)?.name ?? 'Spreker';
  }, [speakerSlug, speakers]);

  const selectedThemeName = useMemo(() => {
    if (!themeSlug) return 'Alle thema\'s';
    return themes.find((t) => t.slug === themeSlug)?.name ?? 'Thema';
  }, [themeSlug, themes]);

  function updateFilters(next: { speaker?: string; theme?: string; audio?: boolean }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.speaker !== undefined) {
      if (next.speaker) params.set('speaker', next.speaker);
      else params.delete('speaker');
    }

    if (next.theme !== undefined) {
      if (next.theme) params.set('theme', next.theme);
      else params.delete('theme');
    }

    if (next.audio !== undefined) {
      if (next.audio) params.set('audio', '1');
      else params.delete('audio');
    }

    const qs = params.toString();
    router.push(qs ? `/sermons?${qs}` : '/sermons');
  }

  function clearAll() {
    router.push('/sermons');
  }

  const filtersActive = Boolean(speakerSlug || themeSlug || audioOnly);

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
              <p className="text-xs text-warm-500 dark:text-warm-400 mt-2">Geselecteerd: {selectedThemeName}</p>
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

              {isLoading && (
                <span className="text-sm text-warm-500 dark:text-warm-300">Laden…</span>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50/60 dark:bg-red-900/15 border border-red-200/60 dark:border-red-900/30">
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
              </div>
            )}
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
