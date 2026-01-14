import { Metadata } from 'next';
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

  try {
    const response = await getSermons({ page: 1, pageSize: PAGE_SIZE });
    sermons = response.data;
    totalPages = response.meta.pagination?.pageCount || 1;
  } catch (error) {
    console.error('Error fetching sermons:', error);
  }

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-b from-warm-100 to-warm-50 border-b border-warm-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-warm-500">
              <li>
                <a href="/" className="hover:text-primary-600 transition-colors">Home</a>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-warm-700 font-medium">Preken</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-warm-900 font-serif">Alle Preken</h1>
          <p className="text-warm-600 mt-2">Doorzoek ons complete archief van inspirerende preken.</p>
        </div>
      </section>

      {/* Sermons Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {sermons.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>

            <Pagination currentPage={1} totalPages={totalPages} />
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft border border-warm-100">
            <div className="w-16 h-16 bg-warm-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-warm-600 text-lg">Geen preken gevonden.</p>
          </div>
        )}
      </section>
    </div>
  );
}
