import { Metadata } from 'next';
import SermonCard from '@/components/SermonCard';
import Pagination from '@/components/Pagination';
import { getSermons, getSermonPageCount } from '@/lib/strapi';

export const metadata: Metadata = {
  title: 'Alle Preken',
  description: 'Doorzoek ons complete archief van preken. Sorteer op datum en ontdek inspirerende boodschappen.',
};

// Generate static page at build time
export const dynamic = 'force-static';

const PAGE_SIZE = 12;

export default async function SermonsPage() {
  let sermons = [];
  let totalPages = 1;

  try {
    const response = await getSermons({ page: 1, pageSize: PAGE_SIZE });
    sermons = response.data;
    totalPages = response.meta.pagination?.pageCount || 1;
  } catch (error) {
    console.error('Error fetching sermons:', error);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Alle Preken</h1>

      {sermons.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <SermonCard key={sermon.id} sermon={sermon} />
            ))}
          </div>

          <Pagination currentPage={1} totalPages={totalPages} />
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Geen preken gevonden.</p>
        </div>
      )}
    </div>
  );
}
