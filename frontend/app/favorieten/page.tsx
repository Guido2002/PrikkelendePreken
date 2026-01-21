'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { FavoriteSermon } from '@/lib/favorites';
import { clearFavorites, getFavorites, subscribeFavorites } from '@/lib/favorites';

export default function FavorietenPage() {
  const [favorites, setFavorites] = useState<FavoriteSermon[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
    return subscribeFavorites(() => setFavorites(getFavorites()));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Bewaren</span>
          <h1 className="text-3xl md:text-4xl font-bold text-warm-900 dark:text-warm-50 mt-2 font-serif">Favorieten</h1>
          <p className="text-warm-600 dark:text-warm-200 mt-3 max-w-2xl">
            Preken die je bewaard hebt op dit apparaat.
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            type="button"
            onClick={() => clearFavorites()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-warm-200 dark:border-warm-800 bg-white dark:bg-warm-950/40 text-warm-600 dark:text-warm-200 hover:text-primary-700 dark:hover:text-primary-200 hover:border-primary-200 dark:hover:border-primary-400/40 hover:bg-primary-50/40 dark:hover:bg-primary-900/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Wis alles
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-warm-900/40 rounded-2xl shadow-soft border border-warm-100 dark:border-warm-800/60">
          <div className="w-16 h-16 bg-warm-100 dark:bg-warm-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-warm-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.995 20.25s-7.245-4.397-9.338-8.343C1.17 9.032 2.02 6.44 4.23 5.26c1.68-.9 3.92-.57 5.29.86l2.475 2.575 2.475-2.575c1.37-1.43 3.61-1.76 5.29-.86 2.21 1.18 3.06 3.772 1.573 6.647-2.093 3.946-9.338 8.343-9.338 8.343z" />
            </svg>
          </div>
          <p className="text-warm-600 dark:text-warm-100 text-lg font-medium mb-2">Nog geen favorieten</p>
          <p className="text-warm-400 dark:text-warm-400 text-sm mb-8">Klik op het hartje bij een preek om ’m te bewaren.</p>
          <Link
            href="/sermons"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
          >
            Bekijk preken
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {favorites.map((f) => (
            <article
              key={f.slug}
              className="group bg-white dark:bg-warm-900/40 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden border border-warm-100 dark:border-warm-800/60 hover:border-primary-200/60 dark:hover:border-primary-400/40"
            >
              <div className="p-5 sm:p-6">
                <h2 className="text-xl font-bold text-warm-900 dark:text-warm-50 group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors line-clamp-2 font-serif mb-3 leading-snug">
                  <Link href={`/sermons/${f.slug}`} className="hover:underline decoration-primary-300 underline-offset-4">
                    {f.title}
                  </Link>
                </h2>

                {(f.speakerName || f.date) && (
                  <p className="text-warm-600 dark:text-warm-200 text-sm mb-4">
                    {f.speakerName ? f.speakerName : null}
                    {f.speakerName && f.date ? ' · ' : null}
                    {f.date ? new Date(f.date).toLocaleDateString('nl-NL') : null}
                  </p>
                )}

                {f.bibleText && (
                  <p className="text-primary-700 text-sm font-medium">
                    {f.bibleText}
                  </p>
                )}
              </div>

              <div className="px-5 sm:px-6 py-4 bg-warm-50/50 dark:bg-warm-950/30 border-t border-warm-100 dark:border-warm-800/60 group-hover:bg-primary-50/30 dark:group-hover:bg-primary-900/15 transition-colors">
                <Link
                  href={`/sermons/${f.slug}`}
                  className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-200 group-hover:text-primary-700 dark:group-hover:text-primary-100 font-semibold text-sm"
                >
                  Open preek
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
