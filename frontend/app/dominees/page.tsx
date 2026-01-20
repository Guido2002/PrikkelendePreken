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
                <li className="text-warm-800 font-bold">📂 Dominees</li>
              </ol>
            </div>
          </nav>

          {/* Title & description - 90s window */}
          <div className="window-90s max-w-2xl">
            <div className="window-90s-titlebar">
              <span>👥 dominees_archief.exe</span>
            </div>
            <div className="window-90s-content">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-warm-900 font-heading mb-3">
                👤 Dominees
              </h1>
              <p className="text-warm-600 leading-relaxed">
                Overzicht van alle dominees/sprekers in ons archief.
                {speakers.length > 0 && (
                  <span className="text-primary-700 font-bold"> [{speakers.length} profielen gevonden]</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {speakers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {speakers.map((speaker) => (
              <Link
                key={speaker.id}
                href={`/dominees/${speaker.slug}`}
                className="window-90s group"
              >
                <div className="window-90s-titlebar flex items-center justify-between">
                  <span className="truncate">👤 {speaker.name.toLowerCase().replace(/\s+/g, '_')}.profile</span>
                  <div className="flex gap-1">
                    <span className="w-3 h-3 bevel-outset bg-warm-200 text-xs flex items-center justify-center">_</span>
                    <span className="w-3 h-3 bevel-outset bg-warm-200 text-xs flex items-center justify-center">□</span>
                    <span className="w-3 h-3 bevel-outset bg-warm-200 text-xs flex items-center justify-center">×</span>
                  </div>
                </div>
                <div className="p-0">
                  {/* Image */}
                  <div className="relative h-40 bg-warm-200">
                    {speaker.profilePicture?.url ? (
                      <img
                        src={getStrapiMediaUrl(speaker.profilePicture.url)}
                        alt={speaker.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-warm-200 text-6xl">
                        👤
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 bevel-inset bg-warm-100 mx-1 mb-1">
                    <h2 className="text-lg font-bold text-warm-900 font-heading mb-2">
                      {speaker.name}
                    </h2>
                    {speaker.bio ? (
                      <p className="text-warm-600 text-sm leading-relaxed line-clamp-2">{speaker.bio}</p>
                    ) : (
                      <p className="text-warm-500 text-sm">Geen bio beschikbaar.</p>
                    )}

                    <div className="mt-4 pt-3 border-t-2 border-warm-300 flex items-center justify-between">
                      <span className="link-90s text-sm font-bold">
                        ➡️ Bekijk profiel
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="window-90s max-w-md mx-auto">
            <div className="window-90s-titlebar">
              <span>⚠️ Melding</span>
            </div>
            <div className="window-90s-content text-center">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-warm-700 font-bold mb-2">Geen dominees gevonden.</p>
              <p className="text-warm-500 text-sm">Er zijn nog geen sprekers gepubliceerd.</p>
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
