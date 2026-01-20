import Link from 'next/link';
import SermonCard from '@/components/SermonCard';
import SearchTrigger from '@/components/SearchTrigger';
import { getLatestSermons, getSermons, getSpeakers, getThemes } from '@/lib/strapi';
import { Sermon } from '@/lib/types';

// Generate static page at build time
export const dynamic = 'force-static';

export default async function HomePage() {
  let sermons: Sermon[] = [];
  let totalSermons = 0;
  let totalSpeakers = 0;
  let totalThemes = 0;
  
  try {
    const [sermonsResponse, allSermonsResponse, speakersResponse, themesResponse] = await Promise.all([
      getLatestSermons(6),
      getSermons({ page: 1, pageSize: 1 }), // Just to get total count
      getSpeakers(),
      getThemes(),
    ]);
    sermons = sermonsResponse.data;
    totalSermons = allSermonsResponse.meta.pagination?.total || 0;
    totalSpeakers = speakersResponse.data.length;
    totalThemes = themesResponse.data.length;
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return (
    <div className="smoke-overlay">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center py-20 overflow-hidden">
        {/* Atmospheric background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-wood-950 via-wood-900/95 to-wood-950" />
        
        {/* Subtle warm light from above */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-bronze-600/10 to-transparent rounded-full blur-3xl" />
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Ornamental top element */}
          <div className="divider-ornament mb-10 text-bronze-500/60">
            <span className="text-lg">✦</span>
          </div>
          
          {/* Main heading */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-cream-100 mb-6 text-shadow-warm tracking-tight animate-flicker">
            Prikkelende Preken
          </h1>
          
          {/* Subtitle */}
          <p className="font-body text-xl md:text-2xl text-cream-300/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Ontdek inspirerende preken uit ons archief. Luister, lees en laat je 
            raken door de kracht van Gods Woord.
          </p>
          
          {/* Search bar */}
          <div className="flex justify-center mb-10">
            <SearchTrigger />
          </div>

          {/* CTA Button */}
          <Link
            href="/sermons"
            className="btn-70s-primary inline-flex items-center gap-3 text-lg"
          >
            Bekijk alle preken
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-wood-950 to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="relative py-16 bg-wood-950">
        {/* Warm glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-bronze-900/5 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="font-display text-4xl md:text-5xl font-bold text-bronze-400 mb-2 text-shadow-glow">
                {totalSermons}
              </div>
              <div className="text-sm text-cream-400/60 tracking-widest uppercase">Preken</div>
            </div>
            
            <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-bronze-600/40 to-transparent" />
            
            <div className="text-center">
              <div className="font-display text-4xl md:text-5xl font-bold text-bronze-400 mb-2 text-shadow-glow">
                {totalSpeakers}
              </div>
              <div className="text-sm text-cream-400/60 tracking-widest uppercase">Sprekers</div>
            </div>
            
            <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-bronze-600/40 to-transparent" />
            
            <div className="text-center">
              <div className="font-display text-4xl md:text-5xl font-bold text-bronze-400 mb-2 text-shadow-glow">
                {totalThemes}
              </div>
              <div className="text-sm text-cream-400/60 tracking-widest uppercase">Thema&apos;s</div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider-70s" />

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-wood-950 via-wood-900/50 to-wood-950">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-cream-100 mb-4">
              Het Archief Ontdekken
            </h2>
            <div className="divider-ornament text-bronze-500/40">
              <span>◆</span>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="card-70s p-6 text-center group">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-bronze-600/30 to-bronze-800/30 flex items-center justify-center mx-auto mb-5 group-hover:shadow-glow transition-shadow duration-500">
                <svg className="w-7 h-7 text-bronze-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
              </div>
              <h3 className="font-display text-lg text-cream-100 mb-3">Audio & Tekst</h3>
              <p className="text-cream-400/70 text-sm leading-relaxed">
                Luister naar preken of lees de transcripties op je eigen tempo.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card-70s p-6 text-center group">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-bronze-600/30 to-bronze-800/30 flex items-center justify-center mx-auto mb-5 group-hover:shadow-glow transition-shadow duration-500">
                <svg className="w-7 h-7 text-bronze-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-display text-lg text-cream-100 mb-3">Slim Zoeken</h3>
              <p className="text-cream-400/70 text-sm leading-relaxed">
                Vind snel de preek die je zoekt via spreker, thema of bijbeltekst.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card-70s p-6 text-center group">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-bronze-600/30 to-bronze-800/30 flex items-center justify-center mx-auto mb-5 group-hover:shadow-glow transition-shadow duration-500">
                <svg className="w-7 h-7 text-bronze-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="font-display text-lg text-cream-100 mb-3">Bijbelreferenties</h3>
              <p className="text-cream-400/70 text-sm leading-relaxed">
                Elke preek met duidelijke bijbeltekst voor diepere studie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider-70s" />

      {/* Latest Sermons */}
      <section className="py-20 bg-gradient-to-b from-wood-950 to-wood-900/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-cream-100 mb-2">
                Recente Preken
              </h2>
              <p className="text-cream-400/60">De nieuwste toevoegingen aan het archief</p>
            </div>
            <Link
              href="/sermons"
              className="inline-flex items-center gap-2 text-bronze-400 hover:text-bronze-300 transition-colors group"
            >
              <span>Bekijk alle preken</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {sermons.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          ) : (
            <div className="card-70s p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-wood-800/50 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-cream-500/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </div>
              <p className="font-display text-cream-200 text-lg mb-2">
                Er zijn nog geen preken gepubliceerd
              </p>
              <p className="text-cream-400/60 text-sm">
                Voeg preken toe via het Strapi admin panel.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="divider-70s" />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-wood-900/50 to-wood-950 relative">
        {/* Warm glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] bg-gradient-radial from-bronze-600/8 to-transparent rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-cream-100 mb-4">
            Klaar om geïnspireerd te worden?
          </h2>
          <p className="text-cream-300/70 text-lg mb-8 max-w-xl mx-auto">
            Doorzoek ons complete archief en ontdek preken die je raken.
          </p>
          <Link
            href="/sermons"
            className="btn-70s-primary inline-flex items-center gap-3 text-lg"
          >
            Start met verkennen
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
