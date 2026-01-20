'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    // Log for diagnostics; users see friendly UI.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full bg-white border border-warm-100 rounded-2xl shadow-soft p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-warm-900 font-serif">Er ging iets mis</h1>
        <p className="mt-3 text-warm-600">
          Probeer het opnieuw, of ga terug naar de homepagina.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30"
          >
            Opnieuw proberen
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-warm-100 hover:bg-warm-200 text-warm-800 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20"
          >
            Naar home
          </Link>
        </div>
      </div>
    </div>
  );
}
