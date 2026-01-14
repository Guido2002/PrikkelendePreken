import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SermonCard from '@/components/SermonCard';
import Pagination from '@/components/Pagination';
import { getSermons, getSermonPageCount } from '@/lib/strapi';
import { Sermon } from '@/lib/types';

const PAGE_SIZE = 12;

interface PageProps {
  params: Promise<{ page: string }>;
}

// Generate all paginated pages at build time
export async function generateStaticParams() {
  try {
    const totalPages = await getSermonPageCount(PAGE_SIZE);
    
    // Generate params for pages 2 onwards (page 1 is /sermons)
    const params = [];
    for (let i = 2; i <= totalPages; i++) {
      params.push({ page: i.toString() });
    }
    
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page } = await params;
  const pageNum = Number.parseInt(page, 10);
  
  return {
    title: `Alle Preken - Pagina ${pageNum}`,
    description: `Doorzoek ons prekenarchief. Pagina ${pageNum} van de collectie.`,
  };
}

export default async function PaginatedSermonsPage({ params }: PageProps) {
  const { page } = await params;
  const pageNum = Number.parseInt(page, 10);
  
  if (Number.isNaN(pageNum) || pageNum < 2) {
    notFound();
  }

  let sermons: Sermon[] = [];
  let totalPages = 1;

  try {
    const response = await getSermons({ page: pageNum, pageSize: PAGE_SIZE });
    sermons = response.data;
    totalPages = response.meta.pagination?.pageCount || 1;
    
    // If page doesn't exist, show 404
    if (pageNum > totalPages) {
      notFound();
    }
  } catch (error) {
    console.error('Error fetching sermons:', error);
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Alle Preken</h1>
      <p className="text-gray-600 mb-8">Pagina {pageNum} van {totalPages}</p>

      {sermons.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <SermonCard key={sermon.id} sermon={sermon} />
            ))}
          </div>

          <Pagination currentPage={pageNum} totalPages={totalPages} />
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Geen preken gevonden.</p>
        </div>
      )}
    </div>
  );
}
