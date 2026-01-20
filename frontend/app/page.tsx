import Link from 'next/link';
import SermonCard from '@/components/SermonCard';
import SearchTrigger from '@/components/SearchTrigger';
import { getLatestSermons } from '@/lib/strapi';
import { Sermon } from '@/lib/types';
import Marquee from '@/components/Marquee';

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
      {/* 90s Marquee Banner */}
      <div className="bg-primary-900 py-2 bevel-inset">
        <Marquee />
      </div>

      {/* Hero Section - 90s Style */}
      <section className="relative bg-warm-300 overflow-hidden">
        {/* 90s decorative border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-accent-400 to-primary-600" />
        
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          {/* Window-style container */}
          <div className="window-90s">
            {/* Title bar */}
            <div className="window-90s-titlebar flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-sm">📖</span>
                <span>welkom.exe</span>
              </span>
              <div className="flex gap-1">
                <span className="w-4 h-4 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center font-bold">_</span>
                <span className="w-4 h-4 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center font-bold">□</span>
                <span className="w-4 h-4 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center font-bold">×</span>
              </div>
            </div>
            
            {/* Content area */}
            <div className="window-90s-content text-center py-8 md:py-12">
              {/* Badge with pulse */}
              <div className="inline-block mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent-400 text-warm-950 font-bold uppercase text-sm bevel-outset animate-pulse-glow">
                  <span className="animate-blink">★</span>
                  NIEUW! Preek Archief Online
                  <span className="animate-blink">★</span>
                </span>
              </div>
              
              {/* Main heading with rainbow animation */}
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 uppercase text-shadow-3d">
                <span className="block text-warm-950">Welkom bij</span>
                <span className="block mt-2 text-rainbow">
                  Prikkelende Preken
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg md:text-xl text-warm-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                Ontdek inspirerende preken uit ons archief. Luister, lees en laat je 
                raken door de kracht van Gods Woord.
              </p>
              
              {/* Search bar */}
              <div className="mb-8">
                <SearchTrigger />
              </div>

              {/* CTA Button */}
              <Link
                href="/sermons"
                className="btn-90s-primary inline-flex items-center gap-3 px-8 py-4 text-lg"
              >
                ▶ Bekijk alle preken
              </Link>
            </div>
          </div>

          {/* Hit Counter Style Stats */}
          <div className="mt-8 bevel-outset bg-warm-950 p-4">
            <div className="bevel-inset bg-black p-4">
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-center">
                <div className="hit-counter px-4 py-2 bevel-inset">
                  <div className="text-2xl md:text-3xl font-mono font-bold">100+</div>
                  <div className="text-xs uppercase tracking-wider text-green-400">Preken</div>
                </div>
                <div className="text-accent-400 text-2xl">|</div>
                <div className="hit-counter px-4 py-2 bevel-inset">
                  <div className="text-2xl md:text-3xl font-mono font-bold">020+</div>
                  <div className="text-xs uppercase tracking-wider text-green-400">Sprekers</div>
                </div>
                <div className="text-accent-400 text-2xl">|</div>
                <div className="hit-counter px-4 py-2 bevel-inset">
                  <div className="text-2xl md:text-3xl font-mono font-bold">050+</div>
                  <div className="text-xs uppercase tracking-wider text-green-400">Thema&apos;s</div>
                </div>
              </div>
              <p className="text-center text-warm-500 text-xs font-mono mt-3">
                U bent bezoeker #001337 | Online sinds 1997
              </p>
            </div>
          </div>
        </div>

        {/* 3D groove divider */}
        <div className="hr-groove" />
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-black text-warm-950 uppercase text-shadow-3d mb-2">
            ✦ Mogelijkheden ✦
          </h2>
        </div>
        
        <div className="grid sm:grid-cols-3 gap-4">
          {/* Feature 1 */}
          <div className="window-90s">
            <div className="window-90s-titlebar text-sm">
              <span>🔊 audio.exe</span>
            </div>
            <div className="window-90s-content">
              <div className="w-12 h-12 bevel-outset bg-primary-600 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12h.01M12 12h.01M15 12h.01" />
                </svg>
              </div>
              <h3 className="font-bold text-warm-950 mb-2 uppercase">Audio & Tekst</h3>
              <p className="text-warm-700 text-sm">Luister naar preken of lees de transcripties op je eigen tempo.</p>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="window-90s">
            <div className="window-90s-titlebar text-sm">
              <span>🔍 search.exe</span>
            </div>
            <div className="window-90s-content">
              <div className="w-12 h-12 bevel-outset bg-accent-500 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-warm-950" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-warm-950 mb-2 uppercase">Slim Zoeken</h3>
              <p className="text-warm-700 text-sm">Vind snel de preek die je zoekt via spreker, thema of bijbeltekst.</p>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="window-90s">
            <div className="window-90s-titlebar text-sm">
              <span>📖 bible.exe</span>
            </div>
            <div className="window-90s-content">
              <div className="w-12 h-12 bevel-outset bg-green-600 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-warm-950 mb-2 uppercase">Bijbelreferenties</h3>
              <p className="text-warm-700 text-sm">Elke preek met duidelijke bijbeltekst voor diepere studie.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D groove divider */}
      <div className="hr-groove" />

      {/* Latest Sermons */}
      <section className="bg-warm-100">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-black text-warm-950 uppercase text-shadow-3d">
                📼 Recente Preken
              </h2>
            </div>
            <Link
              href="/sermons"
              className="btn-90s inline-flex items-center gap-2"
            >
              Bekijk alle preken →
            </Link>
          </div>

          {sermons.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          ) : (
            <div className="window-90s">
              <div className="window-90s-titlebar">
                <span>⚠️ Melding</span>
              </div>
              <div className="window-90s-content text-center py-12">
                <div className="w-16 h-16 bevel-outset bg-warm-200 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-warm-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <p className="text-warm-700 text-lg font-bold mb-2">
                  Er zijn nog geen preken gepubliceerd.
                </p>
                <p className="text-warm-500">
                  Voeg preken toe via het Strapi admin panel.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3D groove divider */}
      <div className="hr-groove" />

      {/* CTA Section with Construction Stripes */}
      <section className="bg-construction py-4">
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
          <div className="window-90s">
            <div className="window-90s-titlebar">
              <span>🚧 ACTIE VEREIST! 🚧</span>
            </div>
            <div className="window-90s-content text-center py-8">
              <h2 className="font-heading text-2xl md:text-3xl font-black text-warm-950 uppercase text-shadow-3d mb-4">
                Klaar om geïnspireerd te worden?
              </h2>
              <p className="text-warm-700 mb-6 text-lg max-w-xl mx-auto">
                Doorzoek ons complete archief en ontdek preken die je raken.
              </p>
              <Link
                href="/sermons"
                className="btn-90s-primary inline-flex items-center gap-3 px-8 py-4 text-lg"
              >
                ▶ Start met verkennen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Color Squares - 90s excess! */}
      <div className="flex justify-center py-4 bg-warm-300">
        <div className="flex gap-1">
          <div className="w-6 h-6 bevel-outset bg-red-600" />
          <div className="w-6 h-6 bevel-outset bg-yellow-400" />
          <div className="w-6 h-6 bevel-outset bg-green-500" />
          <div className="w-6 h-6 bevel-outset bg-blue-600" />
          <div className="w-6 h-6 bevel-outset bg-purple-600" />
          <div className="w-6 h-6 bevel-outset bg-pink-500" />
          <div className="w-6 h-6 bevel-outset bg-primary-600" />
        </div>
      </div>
    </div>
  );
}
