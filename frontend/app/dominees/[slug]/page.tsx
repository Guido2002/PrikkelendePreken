import { Metadata } from 'next';
import Link from 'next/link';
import SermonCard from '@/components/SermonCard';
import { getAllSpeakerSlugs, getSpeakerBySlug, getSermons, getStrapiMediaUrl } from '@/lib/strapi';
import { Sermon } from '@/lib/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Required for static export - only allow slugs from generateStaticParams
export const dynamicParams = false;

// Generate all dominee detail pages at build time
export async function generateStaticParams() {
  try {
    const slugs = await getAllSpeakerSlugs();
    if (!slugs || slugs.length === 0) {
      return [{ slug: 'dominee' }];
    }
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('Error generating speaker static params:', error);
    return [{ slug: 'dominee' }];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const speaker = await getSpeakerBySlug(slug);

  if (!speaker) {
    return {
      title: 'Dominee',
      description: 'Dominee profiel is tijdelijk niet beschikbaar.',
    };
  }

  return {
    title: speaker.name,
    description: speaker.bio || `Bekijk preken van ${speaker.name}.`,
    openGraph: {
      title: speaker.name,
      description: speaker.bio || undefined,
      type: 'profile',
      images: speaker.profilePicture?.url ? [getStrapiMediaUrl(speaker.profilePicture.url)] : undefined,
    },
  };
}

export const dynamic = 'force-static';

export default async function DomineeDetailPage({ params }: Readonly<PageProps>) {
  const { slug } = await params;
  const speaker = await getSpeakerBySlug(slug);

  if (!speaker) {
    return (
      <div className="min-h-screen">
        {/* Error Header */}
        <div className="relative py-16 bg-gradient-to-b from-wood-900/50 to-wood-950">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial from-bronze-600/10 to-transparent rounded-full blur-3xl" />
          
          <div className="relative max-w-4xl mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-cream-400/60">
                <li>
                  <Link href="/" className="hover:text-bronze-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li><span className="mx-2">/</span></li>
                <li>
                  <Link href="/dominees" className="hover:text-bronze-400 transition-colors">
                    Dominees
                  </Link>
                </li>
              </ol>
            </nav>

            <div className="card-70s p-8">
              <h1 className="font-display text-2xl font-semibold text-cream-100 mb-4">
                Dominee tijdelijk niet beschikbaar
              </h1>
              <p className="text-cream-300/70 mb-4">
                We kunnen dit profiel nu niet laden. Probeer het later opnieuw.
              </p>
              <Link href="/dominees" className="btn-70s inline-flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Terug naar alle dominees
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  let sermons: Sermon[] = [];
  let totalSermons = 0;

  try {
    const response = await getSermons({ page: 1, pageSize: 1000, speakerSlug: speaker.slug });
    sermons = response.data;
    totalSermons = response.meta.pagination?.total || sermons.length;
  } catch (error) {
    console.error('Error fetching sermons for speaker:', error);
  }

  return (
    <div>
      {/* Profile Header */}
      <section className="relative py-16 bg-gradient-to-b from-wood-900/50 to-wood-950 overflow-hidden">
        {/* Warm glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-bronze-600/10 to-transparent rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-cream-400/60">
              <li>
                <Link href="/" className="hover:text-bronze-400 transition-colors">
                  Home
                </Link>
              </li>
              <li><span className="mx-2">/</span></li>
              <li>
                <Link href="/dominees" className="hover:text-bronze-400 transition-colors">
                  Dominees
                </Link>
              </li>
              <li><span className="mx-2">/</span></li>
              <li className="text-cream-200 truncate max-w-[200px]">{speaker.name}</li>
            </ol>
          </nav>

          {/* Profile Card */}
          <div className="card-70s p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image */}
              <div className="w-full md:w-56 flex-shrink-0">
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-bronze-800/40">
                  {speaker.profilePicture?.url ? (
                    <img
                      src={getStrapiMediaUrl(speaker.profilePicture.url)}
                      alt={speaker.name}
                      className="w-full h-full object-cover sepia-[0.2]"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-wood-800 to-wood-900 flex items-center justify-center">
                      <svg className="w-24 h-24 text-bronze-600/40" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                  )}
                  {/* Warm overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-wood-950/40 to-transparent" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="font-display text-3xl md:text-4xl font-semibold text-cream-100 mb-4 text-shadow-warm">
                  {speaker.name}
                </h1>

                {speaker.bio ? (
                  <p className="text-cream-200/80 leading-relaxed mb-6 max-w-2xl">
                    {speaker.bio}
                  </p>
                ) : (
                  <p className="text-cream-400/60 italic mb-6">Geen biografie beschikbaar.</p>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-bronze-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                    <span className="font-medium">{totalSermons} preken</span>
                  </div>

                  <a
                    href="#preken"
                    className="btn-70s-primary inline-flex items-center gap-2"
                  >
                    Bekijk preken
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-wood-950 to-transparent" />
      </section>

      {/* Sermons Section */}
      <section id="preken" className="max-w-6xl mx-auto px-4 py-12">
        {sermons.length > 0 ? (
          <>
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="font-display text-2xl text-cream-100">
                Preken van {speaker.name}
              </h2>
              <p className="text-sm text-cream-400/60">
                {sermons.length} van {totalSermons} preken
              </p>
            </div>

            {/* Sermons Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          </>
        ) : (
          <div className="card-70s p-8 max-w-md mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-wood-800/50 flex items-center justify-center">
              <svg className="w-8 h-8 text-bronze-600/60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="font-display text-lg text-cream-200 mb-2">Geen preken gevonden</h3>
            <p className="text-cream-400/60 text-sm">
              Er zijn nog geen preken gekoppeld aan deze dominee.
            </p>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-bronze-800/30">
          <Link 
            href="/dominees" 
            className="inline-flex items-center gap-2 text-bronze-400 hover:text-bronze-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Terug naar alle dominees
          </Link>
        </div>
      </section>
    </div>
  );
}
