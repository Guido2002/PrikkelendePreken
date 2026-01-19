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
      <section className="bg-gradient-to-b from-warm-100 via-warm-50 to-warm-50 border-b border-warm-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link href="/" className="text-warm-500 hover:text-primary-600 transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-warm-800 font-medium">Dominees</li>
            </ol>
          </nav>

          {/* Title & description */}
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-warm-900 font-serif mb-4">Dominees</h1>
            <p className="text-warm-600 text-lg leading-relaxed">
              Overzicht van alle dominees/sprekers in ons archief.
              {speakers.length > 0 && (
                <span className="text-primary-600 font-medium"> {speakers.length} dominees beschikbaar.</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {speakers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {speakers.map((speaker) => (
              <Link
                key={speaker.id}
                href={`/dominees/${speaker.slug}`}
                className="group relative bg-white rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden border border-warm-100 hover:border-primary-200/60"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-100/0 group-hover:from-primary-50/30 group-hover:to-primary-100/20 transition-all duration-500 pointer-events-none" />
                {/* Image */}
                <div className="relative h-44 sm:h-48">
                  {speaker.profilePicture?.url ? (
                    <img
                      src={getStrapiMediaUrl(speaker.profilePicture.url)}
                      alt={speaker.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-200/40 via-warm-100 to-primary-100" />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-950/70 via-warm-950/10 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="text-xl font-bold text-white font-serif leading-snug truncate drop-shadow-sm">
                      {speaker.name}
                    </h2>
                    <p className="text-white/80 text-sm">Bekijk profiel</p>
                  </div>
                </div>

                {/* Body */}
                <div className="relative p-6 pt-5">
                  {speaker.bio ? (
                    <p className="text-warm-600 text-sm leading-relaxed line-clamp-3">{speaker.bio}</p>
                  ) : (
                    <p className="text-warm-500 text-sm leading-relaxed">Geen bio beschikbaar.</p>
                  )}

                  <div className="mt-5 pt-4 border-t border-warm-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-primary-600 group-hover:text-primary-700 font-semibold text-sm">
                      Naar dominee
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    <span className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-soft border border-warm-100">
            <div className="w-20 h-20 bg-warm-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-warm-700 text-xl font-medium mb-2">Geen dominees gevonden.</p>
            <p className="text-warm-500">Er zijn nog geen sprekers gepubliceerd.</p>
          </div>
        )}
      </section>
    </div>
  );
}
