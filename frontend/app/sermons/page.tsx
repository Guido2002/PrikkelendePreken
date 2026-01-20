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
      <section className="relative py-16 bg-gradient-to-b from-wood-900/50 to-wood-950">
        {/* Warm glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-gradient-radial from-bronze-600/8 to-transparent rounded-full blur-3xl" />
        
        <div className="relative max-w-5xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-cream-400/60">
              <li>
                <Link href="/" className="hover:text-bronze-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-cream-200">Preken</li>
            </ol>
          </nav>

          {/* Title & description */}
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-cream-100 mb-4">
            Alle Preken
          </h1>
          <p className="text-cream-300/70 text-lg max-w-2xl">
            Doorzoek ons complete archief van inspirerende preken.
            {totalSermons > 0 && (
              <span className="text-bronze-400"> {totalSermons} preken beschikbaar.</span>
            )}
          </p>
        </div>
        
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-wood-950 to-transparent" />
      </section>

      {/* Sermons Grid */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        {sermons.length > 0 ? (
          <>
            {/* Results count */}
            <p className="text-cream-400/60 text-sm mb-8">
              Toon {sermons.length} van {totalSermons} preken
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>

            <Pagination currentPage={1} totalPages={totalPages} />
          </>
        ) : (
          <div className="card-70s max-w-md mx-auto p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-wood-800/50 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-cream-500/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="font-display text-cream-200 text-lg mb-2">Geen preken gevonden</p>
            <p className="text-cream-400/60 text-sm mb-6">Er zijn nog geen preken gepubliceerd.</p>
            <Link href="/" className="btn-70s">
              Terug naar Home
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
