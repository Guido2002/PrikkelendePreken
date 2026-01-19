import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SermonCard from '@/components/SermonCard';
import { getAllSpeakerSlugs, getSpeakerBySlug, getSermons } from '@/lib/strapi';
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
    },
  };
}

export const dynamic = 'force-static';

export default async function DomineeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const speaker = await getSpeakerBySlug(slug);

  if (!speaker) {
    // Avoid failing static export when Strapi is temporarily unavailable.
    // We show a friendly message instead of a hard 404.
    return (
      <div>
        <section className="bg-gradient-to-b from-warm-100 via-warm-50 to-warm-50 border-b border-warm-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm">
                <li>
                  <Link href="/" className="text-warm-500 hover:text-primary-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <svg className="w-4 h-4 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li>
                  <Link href="/dominees" className="text-warm-500 hover:text-primary-600 transition-colors">
                    Dominees
                  </Link>
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl md:text-4xl font-bold text-warm-900 font-serif mb-4">Dominee tijdelijk niet beschikbaar</h1>
            <p className="text-warm-600 text-lg leading-relaxed">
              We kunnen dit dominee-profiel nu niet laden (Strapi is tijdelijk onbereikbaar). Probeer het later opnieuw.
            </p>
            <p className="text-warm-500 text-sm mt-3">Slug: {slug}</p>

            <div className="mt-8">
              <Link
                href="/dominees"
                className="inline-flex items-center gap-3 px-6 py-3 bg-warm-100 hover:bg-warm-200 text-warm-700 rounded-xl font-semibold group transition-all"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Terug naar alle dominees
              </Link>
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
    <div>
      {/* Page Header */}
      <section className="relative bg-gradient-to-b from-warm-100 via-warm-50 to-warm-50 border-b border-warm-200 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
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
              <li>
                <Link href="/dominees" className="text-warm-500 hover:text-primary-600 transition-colors">
                  Dominees
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-warm-800 font-medium truncate max-w-[200px]">{speaker.name}</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-warm-900 mb-6 font-serif leading-tight">{speaker.name}</h1>

          {speaker.bio && (
            <p className="text-warm-700 text-lg leading-relaxed">{speaker.bio}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-warm-200 rounded-xl text-sm font-medium text-warm-700">
              <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              {totalSermons} preken
            </span>
          </div>
        </div>
      </section>

      {/* Sermons */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {sermons.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-warm-500 text-sm">Toon {sermons.length} van {totalSermons} preken</p>
              <Link
                href="/sermons"
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Bekijk alle preken
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sermons.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-soft border border-warm-100">
            <div className="w-20 h-20 bg-warm-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-warm-700 text-xl font-medium mb-2">Geen preken gevonden.</p>
            <p className="text-warm-500">Er zijn (nog) geen preken gekoppeld aan deze dominee.</p>
          </div>
        )}

        {/* Back link */}
        <div className="mt-20 pt-10 border-t border-warm-200">
          <Link
            href="/dominees"
            className="inline-flex items-center gap-3 px-6 py-3 bg-warm-100 hover:bg-warm-200 text-warm-700 rounded-xl font-semibold group transition-all"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Terug naar alle dominees
          </Link>
        </div>
      </section>
    </div>
  );
}
