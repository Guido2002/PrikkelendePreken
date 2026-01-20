'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchChapter } from '@/lib/apiBible';

export default function BibleChapterReader({
  bibleId,
  chapterId,
  fallbackReference,
  defaultOpen = true,
}: Readonly<{
  bibleId: string | null | undefined;
  chapterId: string | null | undefined;
  fallbackReference?: string | null;
  defaultOpen?: boolean;
}>) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(fallbackReference || null);
  const [copyright, setCopyright] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canLoad = Boolean(bibleId && chapterId);

  const title = useMemo(() => {
    if (reference) return reference;
    if (chapterId) return chapterId;
    return 'Bijbelgedeelte';
  }, [reference, chapterId]);

  useEffect(() => {
    if (!isOpen) return;
    if (!canLoad) return;

    const controller = new AbortController();

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchChapter({
          bibleId: bibleId as string,
          chapterId: chapterId as string,
          signal: controller.signal,
        });

        setReference(res.reference || fallbackReference || null);
        setContent(res.content || '');
        setCopyright(res.copyright || null);
      } catch (e) {
        if (!controller.signal.aborted) {
          setError(e instanceof Error ? e.message : 'Kon bijbelhoofdstuk niet ophalen.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [isOpen, canLoad, bibleId, chapterId, fallbackReference]);

  if (!bibleId || !chapterId) {
    return null;
  }

  return (
    <section className="bg-white border border-warm-200 rounded-2xl overflow-hidden">
      <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-warm-100">
        <div>
          <h2 className="text-lg font-semibold text-warm-900 font-serif">Lees mee</h2>
          <p className="text-sm text-warm-600 mt-1">{title}</p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(v => !v)}
          className="px-3 py-2 bg-warm-50 border border-warm-200 rounded-lg text-sm text-warm-800 hover:bg-warm-100 transition-colors"
          aria-expanded={isOpen}
        >
          {isOpen ? 'Verberg' : 'Toon'}
        </button>
      </div>

      {isOpen && (
        <div className="p-5 sm:p-6">
          {loading && (
            <p className="text-sm text-warm-500">Bijbeltekst laden…</p>
          )}

          {!loading && error && (
            <div className="text-sm text-warm-600">
              <p className="font-medium">{error}</p>
              <p className="text-warm-500 mt-1">
                Controleer in de Strapi backend of `API_BIBLE_KEY` is ingesteld en dat deze preek `bibleId` + `chapterId` heeft.
              </p>
            </div>
          )}

          {!loading && !error && content !== null && (
            <div className="text-warm-800 text-[15px] leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          )}

          {(copyright || null) && (
            <p className="mt-6 text-xs text-warm-500">
              {copyright}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
