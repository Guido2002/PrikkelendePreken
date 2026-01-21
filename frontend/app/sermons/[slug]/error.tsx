'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function SermonDetailError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white dark:bg-warm-900/40 border border-warm-100 dark:border-warm-800/60 rounded-2xl shadow-soft p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-warm-900 dark:text-warm-50 font-serif">Deze preek kon niet geladen worden</h1>
        <p className="mt-3 text-warm-600 dark:text-warm-200">Probeer opnieuw, of ga terug naar het overzicht.</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30"
          >
            Opnieuw proberen
          </button>
          <Link
            href="/sermons"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-warm-100 hover:bg-warm-200 dark:bg-warm-900/50 dark:hover:bg-warm-900/70 text-warm-800 dark:text-warm-100 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20"
          >
            Terug naar preken
          </Link>
        </div>
      </div>
    </div>
  );
}
