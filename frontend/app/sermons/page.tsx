import { Metadata } from 'next';
import Link from 'next/link';
import SermonCard from '@/components/SermonCard';
import Pagination from '@/components/Pagination';
import { getSermons } from '@/lib/strapi';
import { Sermon } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Alle Preken',
  description: 'Doorzoek ons complete archief van preken. Sorteer op datum en ontdek inspirerende boodschappen.',
};

// Generate static page at build time
export const dynamic = 'force-static';

const PAGE_SIZE = 12;

export default async function SermonsPage() {
  let sermons: Sermon[] = [];
  let totalPages = 1;
  let totalSermons = 0;

  try {
    const response = await getSermons({ page: 1, pageSize: PAGE_SIZE });
    sermons = response.data;
    totalPages = response.meta.pagination?.pageCount || 1;
    totalSermons = response.meta.pagination?.total || 0;
  } catch (error) {
    console.error('Error fetching sermons:', error);
  }

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-b from-warm-100 via-warm-50 to-warm-50 border-b border-warm-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/" className="text-warm-500 hover:text-primary-600 transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-warm-800 font-medium">Preken</li>
            </ol>
          </nav>

          {/* Title & description */}
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-warm-900 font-serif mb-4">Alle Preken</h1>
            <p className="text-warm-600 text-lg leading-relaxed">
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
        {sermons.length > 0 ? (
          <>
            {/* Results count */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-warm-500 text-sm">
                Toon {sermons.length} van {totalSermons} preken
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>

            <Pagination currentPage={1} totalPages={totalPages} />
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-soft border border-warm-100">
            <div className="w-20 h-20 bg-warm-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-warm-700 text-xl font-medium mb-2">Geen preken gevonden.</p>
            <p className="text-warm-500">Er zijn nog geen preken gepubliceerd.</p>
          </div>
        )}
      </section>
    </div>
  );
}
