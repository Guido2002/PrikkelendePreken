import { Metadata } from 'next';
import Link from 'next/link';
import { getSpeakers, getStrapiMediaUrl } from '@/lib/strapi';
import { Speaker } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Dominees',
  description: 'Bekijk alle dominees/sprekers uit het archief van Prikkelende Preken.',
};

// Generate static page at build time
export const dynamic = 'force-static';

export default async function DomineesPage() {
  let speakers: Speaker[] = [];

  try {
    const response = await getSpeakers();
    speakers = response.data;
  } catch (error) {
    console.error('Error fetching speakers:', error);
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
              <li className="text-cream-200">Dominees</li>
            </ol>
          </nav>

          {/* Title & description */}
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-cream-100 mb-4">
            Dominees
          </h1>
          <p className="text-cream-300/70 text-lg max-w-2xl">
            Overzicht van alle dominees en sprekers in ons archief.
            {speakers.length > 0 && (
              <span className="text-bronze-400"> {speakers.length} profielen beschikbaar.</span>
            )}
          </p>
        </div>
        
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-wood-950 to-transparent" />
      </section>

      {/* Speakers Grid */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        {speakers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {speakers.map((speaker) => (
              <Link
                key={speaker.id}
                href={`/dominees/${speaker.slug}`}
                className="card-70s group overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-48 bg-wood-900">
                  {speaker.profilePicture?.url ? (
                    <img
                      src={getStrapiMediaUrl(speaker.profilePicture.url)}
                      alt={speaker.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-wood-800">
                      <svg className="w-16 h-16 text-cream-500/20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-wood-950 via-wood-950/50 to-transparent" />
                </div>

                {/* Body */}
                <div className="p-5">
                  <h2 className="font-display text-xl text-cream-100 mb-2 group-hover:text-bronze-400 transition-colors">
                    {speaker.name}
                  </h2>
                  {speaker.bio ? (
                    <p className="text-cream-400/70 text-sm leading-relaxed line-clamp-2">{speaker.bio}</p>
                  ) : (
                    <p className="text-cream-500/50 text-sm italic">Geen biografie beschikbaar.</p>
                  )}

                  <div className="mt-4 pt-4 border-t border-bronze-800/20 flex items-center justify-between">
                    <span className="text-sm text-bronze-400 group-hover:text-bronze-300 transition-colors flex items-center gap-2">
                      Bekijk profiel
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card-70s max-w-md mx-auto p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-wood-800/50 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-cream-500/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p className="font-display text-cream-200 text-lg mb-2">Geen dominees gevonden</p>
            <p className="text-cream-400/60 text-sm mb-6">Er zijn nog geen sprekers gepubliceerd.</p>
            <Link href="/" className="btn-70s">
              Terug naar Home
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
