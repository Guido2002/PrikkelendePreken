import Link from 'next/link';
import SermonCard from '@/components/SermonCard';
import { getLatestSermons } from '@/lib/strapi';
import { Sermon } from '@/lib/types';

// Generate static page at build time
export const dynamic = 'force-static';

export default async function HomePage() {
  let sermons: Sermon[] = [];
  
  try {
    const response = await getLatestSermons(6);
    sermons = response.data;
  } catch (error) {
    console.error('Error fetching sermons:', error);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-warm-900 via-primary-900 to-warm-900 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm font-medium text-primary-200 mb-6">
              ✨ Preek Archief
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif leading-tight">
              Welkom bij{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-100">
                Prikkerende Preken
              </span>
            </h1>
            <p className="text-lg md:text-xl text-warm-200 mb-10 leading-relaxed">
              Ontdek inspirerende preken uit ons archief. Luister, lees en laat je 
              raken door Gods Woord.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sermons"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-800 rounded-xl font-semibold hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Bekijk alle preken
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#faf9f7"/>
          </svg>
        </div>
      </section>

      {/* Latest Sermons */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Archief</span>
            <h2 className="text-3xl md:text-4xl font-bold text-warm-900 mt-2 font-serif">Recente Preken</h2>
          </div>
          <Link
            href="/sermons"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold group"
          >
            Bekijk alle preken
            <svg 
              className="w-5 h-5 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {sermons.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sermons.map((sermon) => (
              <SermonCard key={sermon.id} sermon={sermon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-soft border border-warm-100">
            <div className="w-16 h-16 bg-warm-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-warm-600 text-lg font-medium mb-2">
              Er zijn nog geen preken gepubliceerd.
            </p>
            <p className="text-warm-400 text-sm">
              Voeg preken toe via het Strapi admin panel.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
