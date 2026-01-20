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
    // For `output: 'export'`, returning an empty array causes the export to fail for dynamic routes.
    // If Strapi is down and no fallback is configured, we still return a single placeholder page.
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
    // Avoid failing static export when Strapi is temporarily unavailable.
    // We show a friendly message instead of a hard 404.
    return (
      <div className="bg-warm-100 min-h-screen">
        <section className="bg-warm-200 border-b-4 border-warm-400">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <nav className="mb-6" aria-label="Breadcrumb">
              <div className="bevel-inset bg-white p-2 inline-block">
                <ol className="flex items-center gap-1 text-sm font-mono">
                  <li>
                    <Link href="/" className="link-90s">
                      📁 Home
                    </Link>
                  </li>
                  <li className="text-warm-600">\</li>
                  <li>
                    <Link href="/dominees" className="link-90s">
                      📂 Dominees
                    </Link>
                  </li>
                </ol>
              </div>
            </nav>

            <div className="window-90s">
              <div className="window-90s-titlebar">
                <span>⚠️ error.exe</span>
              </div>
              <div className="window-90s-content">
                <h1 className="text-2xl font-bold text-warm-900 font-heading mb-4">❌ Dominee tijdelijk niet beschikbaar</h1>
                <p className="text-warm-600 leading-relaxed">
                  We kunnen dit dominee-profiel nu niet laden (Strapi is tijdelijk onbereikbaar). Probeer het later opnieuw.
                </p>
                <p className="text-warm-500 text-sm mt-3 font-mono">Bestand: {slug}.profile</p>

                <div className="mt-6">
                  <Link href="/dominees" className="btn-90s">
                    ⬅️ Terug naar alle dominees
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
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
    <div className="bg-warm-100">
      {/* Hero - 90s style with image */}
      <section className="relative border-b-4 border-warm-400 overflow-hidden bg-warm-200">
        {/* Background image area */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <div className="bevel-inset bg-white p-2 inline-block">
              <ol className="flex items-center gap-1 text-sm font-mono">
                <li>
                  <Link href="/" className="link-90s flex items-center gap-1">
                    📁 Home
                  </Link>
                </li>
                <li className="text-warm-600">\</li>
                <li>
                  <Link href="/dominees" className="link-90s">
                    📂 Dominees
                  </Link>
                </li>
                <li className="text-warm-600">\</li>
                <li className="text-warm-800 font-bold truncate max-w-[200px]">👤 {speaker.name}</li>
              </ol>
            </div>
          </nav>

          {/* Profile window */}
          <div className="window-90s">
            <div className="window-90s-titlebar flex items-center justify-between">
              <span>👤 {speaker.name.toLowerCase().replace(/\s+/g, '_')}.profile</span>
              <div className="flex gap-1">
                <span className="w-4 h-4 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center">_</span>
                <span className="w-4 h-4 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center">□</span>
                <span className="w-4 h-4 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center">×</span>
              </div>
            </div>
            <div className="window-90s-content">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile image */}
                <div className="w-full md:w-48 flex-shrink-0">
                  <div className="bevel-inset p-1 bg-warm-950">
                    {speaker.profilePicture?.url ? (
                      <img
                        src={getStrapiMediaUrl(speaker.profilePicture.url)}
                        alt={speaker.name}
                        className="w-full h-48 md:h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 md:h-48 bg-warm-200 flex items-center justify-center text-7xl">
                        👤
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile info */}
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-warm-900 font-heading mb-4">
                    {speaker.name}
                  </h1>

                  {speaker.bio ? (
                    <p className="text-warm-700 leading-relaxed mb-4">
                      {speaker.bio}
                    </p>
                  ) : (
                    <p className="text-warm-500 mb-4">Geen bio beschikbaar.</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bevel-inset bg-warm-100 px-3 py-1 text-sm font-mono">
                      🎙️ {totalSermons} preken
                    </span>

                    <a
                      href="#preken"
                      className="btn-90s-primary inline-flex items-center gap-2"
                    >
                      ⬇️ Bekijk preken
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sermons */}
      <section id="preken" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {sermons.length > 0 ? (
          <>
            <div className="bevel-inset bg-white px-3 py-2 mb-6 inline-flex items-center justify-between w-full">
              <p className="text-warm-600 text-sm font-mono">Toon {sermons.length} van {totalSermons} preken</p>
              <Link
                href="/sermons"
                className="link-90s text-sm font-bold"
              >
                📂 Bekijk alle preken
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {sermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          </>
        ) : (
          <div className="window-90s max-w-md mx-auto">
            <div className="window-90s-titlebar">
              <span>⚠️ Melding</span>
            </div>
            <div className="window-90s-content text-center">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-warm-700 font-bold mb-2">Geen preken gevonden.</p>
              <p className="text-warm-500 text-sm">Er zijn (nog) geen preken gekoppeld aan deze dominee.</p>
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t-2 border-warm-300">
          <Link href="/dominees" className="btn-90s inline-flex items-center gap-2">
            ⬅️ Terug naar alle dominees
          </Link>
        </div>
      </section>
    </div>
  );
}
