'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  clearListeningEntry,
  computeProgressPercent,
  getListeningHistory,
  subscribeListeningHistory,
  type ListeningEntry,
  shouldShowContinue,
} from '@/lib/listeningHistory';

export default function ContinueListening() {
  const [entries, setEntries] = useState<ListeningEntry[]>([]);

  useEffect(() => {
    setEntries(getListeningHistory());
    return subscribeListeningHistory(() => setEntries(getListeningHistory()));
  }, []);

  const visible = useMemo(() => entries.filter(shouldShowContinue).slice(0, 6), [entries]);

  if (visible.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-8 md:pb-12">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-primary-600 dark:text-primary-200 font-semibold text-sm uppercase tracking-wider">Verder luisteren</span>
          <h2 className="text-2xl md:text-3xl font-bold text-warm-900 dark:text-warm-50 mt-2 font-serif">Ga verder waar je bleef</h2>
        </div>
        <Link
          href="/sermons"
          className="hidden sm:inline-flex items-center gap-2 text-primary-600 dark:text-primary-200 hover:text-primary-700 dark:hover:text-primary-100 font-semibold group"
        >
          Naar preken
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {visible.map((e) => {
          const pct = computeProgressPercent(e);
          return (
            <article
              key={e.slug}
              className="group bg-white dark:bg-warm-900/55 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden border border-warm-100 dark:border-warm-800/70 hover:border-primary-200/60 dark:hover:border-primary-400/40 dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg font-bold text-warm-900 dark:text-warm-50 group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors font-serif leading-snug line-clamp-2">
                    <Link href={`/sermons/${e.slug}`} className="hover:underline decoration-primary-300 underline-offset-4">
                      {e.title}
                    </Link>
                  </h3>
                  <button
                    type="button"
                    onClick={() => clearListeningEntry(e.slug)}
                    className="shrink-0 w-9 h-9 rounded-xl border border-warm-200/80 bg-warm-50/80 text-warm-500 hover:bg-warm-100/70 hover:text-primary-700 hover:border-primary-200 transition-colors inline-flex items-center justify-center dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white dark:hover:border-white/20"
                    aria-label="Verwijder uit verder luisteren"
                    title="Verwijder"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {(e.speakerName || e.date) && (
                  <p className="text-warm-600 dark:text-warm-200 text-sm mb-4">
                    {e.speakerName ? e.speakerName : null}
                    {e.speakerName && e.date ? ' · ' : null}
                    {e.date ? new Date(e.date).toLocaleDateString('nl-NL') : null}
                  </p>
                )}

                {e.bibleText && <p className="text-primary-700 dark:text-primary-200 text-sm font-medium mb-4">{e.bibleText}</p>}

                <div className="h-2.5 bg-warm-100 dark:bg-warm-950/50 rounded-full overflow-hidden ring-1 ring-warm-200/70 dark:ring-white/10">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 text-xs text-warm-500 dark:text-white/60">{Math.round(pct)}% beluisterd</p>
              </div>

              <div className="px-5 sm:px-6 py-4 bg-warm-50/60 dark:bg-warm-950/40 border-t border-warm-100 dark:border-warm-800/60 group-hover:bg-primary-50/30 dark:group-hover:bg-primary-900/15 transition-colors">
                <Link
                  href={`/sermons/${e.slug}`}
                  className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-200 group-hover:text-primary-700 dark:group-hover:text-primary-100 font-semibold text-sm"
                >
                  Verder luisteren
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
