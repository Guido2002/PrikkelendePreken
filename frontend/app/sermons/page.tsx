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
    <div className="bg-warm-100">
      {/* Page Header - 90s style */}
      <section className="bg-warm-200 border-b-4 border-warm-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Breadcrumb - 90s folder style */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <div className="bevel-inset bg-white p-2 inline-block">
              <ol className="flex items-center gap-1 text-sm font-mono">
                <li>
                  <Link href="/" className="link-90s flex items-center gap-1">
                    📁 Home
                  </Link>
                </li>
                <li className="text-warm-600">\</li>
                <li className="text-warm-800 font-bold">📂 Preken</li>
              </ol>
            </div>
          </nav>

          {/* Title & description - 90s window */}
          <div className="window-90s max-w-2xl">
            <div className="window-90s-titlebar">
              <span>📂 preken_archief.exe</span>
            </div>
            <div className="window-90s-content">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-warm-900 font-heading mb-3">
                📖 Alle Preken
              </h1>
              <p className="text-warm-600 leading-relaxed">
                Doorzoek ons complete archief van inspirerende preken.
                {totalSermons > 0 && (
                  <span className="text-primary-700 font-bold"> [{totalSermons} bestanden gevonden]</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sermons Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {sermons.length > 0 ? (
          <>
            {/* Results count - 90s status bar style */}
            <div className="bevel-inset bg-white px-3 py-2 mb-6 inline-block">
              <p className="text-warm-600 text-sm font-mono">
                Toon {sermons.length} van {totalSermons} bestanden
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {sermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>

            <Pagination currentPage={1} totalPages={totalPages} />
          </>
        ) : (
          <div className="window-90s max-w-md mx-auto">
            <div className="window-90s-titlebar">
              <span>⚠️ Melding</span>
            </div>
            <div className="window-90s-content text-center">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-warm-700 font-bold mb-2">Geen preken gevonden.</p>
              <p className="text-warm-500 text-sm">Er zijn nog geen preken gepubliceerd.</p>
              <div className="mt-6">
                <Link href="/" className="btn-90s">
                  ⬅️ Terug naar Home
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
