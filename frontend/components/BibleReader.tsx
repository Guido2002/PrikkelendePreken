'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BibleReference } from '@/lib/types';
import { BibleTranslation, buildBibleLink, fetchBiblePassage, formatReference } from '@/lib/bible';

export default function BibleReader({
  bibleReference,
  fallbackBibleText,
}: Readonly<{
  bibleReference: BibleReference | null;
  fallbackBibleText?: string | null;
}>) {
  const refText = useMemo(
    () => formatReference(bibleReference, fallbackBibleText) || null,
    [bibleReference, fallbackBibleText]
  );

  const [translation, setTranslation] = useState<BibleTranslation>('SV');
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!refText) return;

    const currentRefText = refText;

    const controller = new AbortController();

    async function run() {
      setLoading(true);
      setError(null);
      setText(null);

      try {
        const res = await fetchBiblePassage({ refText: currentRefText, translation, signal: controller.signal });
        if (!res) {
          setError('Geen Bijbel-API geconfigureerd voor tekstweergave.');
          return;
        }
        setText(res.text);
      } catch {
        if (!controller.signal.aborted) {
          setError('Kon bijbeltekst niet ophalen.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [refText, translation]);

  if (!refText) return null;

  const svLink = buildBibleLink(refText, 'SV');
  const hsvLink = buildBibleLink(refText, 'HSV');

  return (
    <section className="mt-12">
      <div className="bg-white border border-warm-200 rounded-2xl p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-warm-900 font-serif">Bijbelgedeelte</h2>
            <p className="text-sm text-warm-600 mt-1">{refText}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={translation}
              onChange={(e) => setTranslation(e.target.value as BibleTranslation)}
              className="px-3 py-2 bg-warm-50 border border-warm-200 rounded-lg text-sm text-warm-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              aria-label="Vertaling"
            >
              <option value="SV">Statenvertaling (SV)</option>
              <option value="HSV">Herziene Statenvertaling (HSV)</option>
            </select>

            {svLink && (
              <a
                href={svLink}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-warm-50 border border-warm-200 rounded-lg text-sm text-warm-800 hover:bg-warm-100 transition-colors"
                title="Open extern"
              >
                Open SV
              </a>
            )}
            {hsvLink && (
              <a
                href={hsvLink}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-warm-50 border border-warm-200 rounded-lg text-sm text-warm-800 hover:bg-warm-100 transition-colors"
                title="Open extern"
              >
                Open HSV
              </a>
            )}
          </div>
        </div>

        <div className="mt-5">
          {loading && (
            <p className="text-sm text-warm-500">Laden…</p>
          )}

          {!loading && text && (
            <div className="prose prose-warm max-w-none prose-p:text-warm-700">
              <p style={{ whiteSpace: 'pre-wrap' }}>{text}</p>
            </div>
          )}

          {!loading && !text && error && (
            <div className="text-sm text-warm-600">
              <p className="font-medium">{error}</p>
              <p className="text-warm-500 mt-1">
                Tip: stel `NEXT_PUBLIC_BIBLE_TEXT_API_URL` in (een endpoint dat JSON teruggeeft als <code>{'{"text":"..."}'}</code>),
                en/of zet `NEXT_PUBLIC_BIBLE_SV_URL_TEMPLATE` / `NEXT_PUBLIC_BIBLE_HSV_URL_TEMPLATE` met <code>{'{ref}'}</code>.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
