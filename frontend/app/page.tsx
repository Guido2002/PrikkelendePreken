import Link from 'next/link';
import SermonCard from '@/components/SermonCard';
import { getLatestSermons } from '@/lib/strapi';

// Generate static page at build time
export const dynamic = 'force-static';

export default async function HomePage() {
  let sermons = [];
  
  try {
    const response = await getLatestSermons(6);
    sermons = response.data;
  } catch (error) {
    console.error('Error fetching sermons:', error);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welkom bij Prikkerende Preken
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ontdek inspirerende preken uit ons archief. Luister, lees en laat je 
          raken door Gods Woord.
        </p>
      </section>

      {/* Latest Sermons */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Recente Preken</h2>
          <Link
            href="/sermons"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Bekijk alle preken →
          </Link>
        </div>

        {sermons.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <SermonCard key={sermon.id} sermon={sermon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">
              Er zijn nog geen preken gepubliceerd.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Voeg preken toe via het Strapi admin panel.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
