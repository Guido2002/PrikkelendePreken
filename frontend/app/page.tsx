import Link from 'next/link';
import SermonCard from '@/components/SermonCard';
import SearchTrigger from '@/components/SearchTrigger';
import ContinueListening from '@/components/ContinueListening';
import { getContentCounts, getLatestSermons } from '@/lib/strapi';
import { Sermon } from '@/lib/types';

// Generate static page at build time
export const dynamic = 'force-static';

export default async function HomePage() {
  let sermons: Sermon[] = [];
  let counts: { sermons: number | null; speakers: number | null; themes: number | null } = {
    sermons: null,
    speakers: null,
    themes: null,
  };
  
  try {
    const [sermonsResponse, countsResponse] = await Promise.all([
      getLatestSermons(6),
      getContentCounts(),
    ]);
    sermons = sermonsResponse.data;
    counts = countsResponse;
  } catch (error) {
    console.error('Error fetching sermons:', error);
  }

  const formatCount = (value: number | null) => (typeof value === 'number' ? value.toLocaleString('nl-NL') : '—');

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-warm-900 via-primary-900 to-warm-900 text-white overflow-hidden min-h-[85vh] flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-primary-800/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-primary-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        </div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-primary-200 mb-8 border border-white/10">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              Preek Archief
            </div>
            
            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-serif leading-[1.1] tracking-tight">
              <span className="block text-white/90">Welkom bij</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200">
                Prikkelende Preken
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-warm-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              Ontdek inspirerende preken uit ons archief. Luister, lees en laat je 
              raken door de kracht van Gods Woord.
            </p>
            
            {/* Search bar */}
            <div className="mb-10">
              <SearchTrigger />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sermons"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary-800 dark:bg-white/10 dark:text-white dark:border dark:border-white/15 rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-white/15 transition-all shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-0.5"
              >
                Bekijk alle preken
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-14 pt-10 border-t border-white/10">
              <div className="inline-flex flex-col items-center gap-3">
                <dl className="inline-flex items-center justify-center gap-6 sm:gap-8 rounded-2xl bg-white/[0.06] border border-white/10 px-5 py-4 backdrop-blur-sm shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                  <div className="text-center min-w-[84px]">
                    <dt className="text-[11px] sm:text-xs text-primary-200/90 font-medium tracking-wide">Preken</dt>
                    <dd className="mt-1 text-2xl sm:text-3xl font-bold text-white tabular-nums leading-none">
                      {formatCount(counts.sermons)}
                    </dd>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="text-center min-w-[84px]">
                    <dt className="text-[11px] sm:text-xs text-primary-200/90 font-medium tracking-wide">Sprekers</dt>
                    <dd className="mt-1 text-2xl sm:text-3xl font-bold text-white tabular-nums leading-none">
                      {formatCount(counts.speakers)}
                    </dd>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="text-center min-w-[84px]">
                    <dt className="text-[11px] sm:text-xs text-primary-200/90 font-medium tracking-wide">Thema&apos;s</dt>
                    <dd className="mt-1 text-2xl sm:text-3xl font-bold text-white tabular-nums leading-none">
                      {formatCount(counts.themes)}
                    </dd>
                  </div>
                </dl>

                {(counts.sermons === null || counts.speakers === null || counts.themes === null) && (
                  <p className="text-xs text-primary-200/80 text-center">
                    Statistieken tijdelijk niet beschikbaar.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

      </section>

      <ContinueListening />

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid sm:grid-cols-3 gap-6 md:gap-8">
          <div className="group p-6 bg-white dark:bg-warm-900/40 rounded-2xl border border-warm-100 dark:border-warm-800/60 hover:border-primary-200 dark:hover:border-primary-400/40 hover:shadow-soft transition-all">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12h.01M12 12h.01M15 12h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-warm-900 dark:text-warm-50 mb-2">Audio & Tekst</h3>
            <p className="text-warm-600 dark:text-warm-200 text-sm leading-relaxed">Luister naar preken of lees de transcripties op je eigen tempo.</p>
          </div>
          
          <div className="group p-6 bg-white dark:bg-warm-900/40 rounded-2xl border border-warm-100 dark:border-warm-800/60 hover:border-primary-200 dark:hover:border-primary-400/40 hover:shadow-soft transition-all">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-warm-900 dark:text-warm-50 mb-2">Slim Zoeken</h3>
            <p className="text-warm-600 dark:text-warm-200 text-sm leading-relaxed">Vind snel de preek die je zoekt via spreker, thema of bijbeltekst.</p>
          </div>
          
          <div className="group p-6 bg-white dark:bg-warm-900/40 rounded-2xl border border-warm-100 dark:border-warm-800/60 hover:border-primary-200 dark:hover:border-primary-400/40 hover:shadow-soft transition-all">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-warm-900 dark:text-warm-50 mb-2">Bijbelreferenties</h3>
            <p className="text-warm-600 dark:text-warm-200 text-sm leading-relaxed">Elke preek met duidelijke bijbeltekst voor diepere studie.</p>
          </div>
        </div>
      </section>

      {/* Latest Sermons */}
      <section className="bg-warm-100/50 dark:bg-warm-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">
                <span className="w-8 h-px bg-primary-600" />
                Archief
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-warm-900 font-serif">Recente Preken</h2>
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
            <div className="text-center py-20 bg-white dark:bg-warm-900/40 rounded-2xl shadow-soft border border-warm-100 dark:border-warm-800/60">
              <div className="w-20 h-20 bg-warm-100 dark:bg-warm-900/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <p className="text-warm-700 dark:text-warm-100 text-xl font-medium mb-2">
                Er zijn nog geen preken gepubliceerd.
              </p>
              <p className="text-warm-500 dark:text-warm-300">
                Voeg preken toe via het Strapi admin panel.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/20 rounded-full blur-2xl" />
          
          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 font-serif">
              Klaar om geïnspireerd te worden?
            </h2>
            <p className="text-primary-100 mb-8 text-lg">
              Doorzoek ons complete archief en ontdek preken die je raken.
            </p>
            <Link
              href="/sermons"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary-700 dark:bg-white/10 dark:text-white dark:border dark:border-white/15 rounded-xl font-semibold hover:bg-primary-50 dark:hover:bg-white/15 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Start met verkennen
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
