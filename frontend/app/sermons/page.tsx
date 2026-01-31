import { Metadata } from 'next';
import Link from 'next/link';
import SermonsArchiveClient from '@/components/SermonsArchiveClient';
import { getSermons, getSpeakers, getThemes } from '@/lib/strapi';
import { Sermon, Speaker, Theme } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Alle Preken',
  description: 'Doorzoek ons complete archief van preken. Sorteer op datum en ontdek inspirerende boodschappen.',
  alternates: {
    canonical: '/sermons',
  },
};

// Generate static page at build time
export const dynamic = 'force-static';

const PAGE_SIZE = 15;

export default async function SermonsPage() {
  let sermons: Sermon[] = [];
  let speakers: Speaker[] = [];
  let themes: Theme[] = [];
  let totalPages = 1;
  let totalSermons = 0;

  try {
    const [sermonsResponse, speakersResponse, themesResponse] = await Promise.all([
      getSermons({ page: 1, pageSize: PAGE_SIZE }),
      getSpeakers(),
      getThemes(),
    ]);

    sermons = sermonsResponse.data;
    totalPages = sermonsResponse.meta.pagination?.pageCount || 1;
    totalSermons = sermonsResponse.meta.pagination?.total || 0;
    speakers = speakersResponse.data;
    themes = themesResponse.data;
  } catch (error) {
    console.error('Error fetching sermons:', error);
  }

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-b from-warm-100 via-warm-50 to-warm-50 dark:from-warm-950 dark:via-warm-950 dark:to-warm-950 border-b border-warm-200 dark:border-warm-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                  <Link href="/" className="text-warm-500 dark:text-warm-300 hover:text-primary-600 dark:hover:text-primary-200 transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-warm-400 dark:text-warm-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-warm-800 dark:text-warm-100 font-medium">Preken</li>
            </ol>
          </nav>

          {/* Title & description */}
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-warm-900 dark:text-warm-50 font-serif mb-4">Alle Preken</h1>
            <p className="text-warm-600 dark:text-warm-200 text-lg leading-relaxed">
              Doorzoek ons complete archief van inspirerende preken. 
              {totalSermons > 0 && (
                <span className="text-primary-600 font-medium"> {totalSermons} preken beschikbaar.</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Sermons Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <SermonsArchiveClient
          initialSermons={sermons}
          initialPagination={{ page: 1, pageCount: totalPages, total: totalSermons }}
          speakers={speakers}
          themes={themes}
          pageSize={PAGE_SIZE}
        />
      </section>
    </div>
  );
}
