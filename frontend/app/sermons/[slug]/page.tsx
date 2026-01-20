import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AudioPlayer from '@/components/AudioPlayer';
import FavoriteButton from '@/components/FavoriteButton';
import { getSermonBySlug, getAllSermonSlugs, formatDate, formatBibleReference } from '@/lib/strapi';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Required for static export - only allow slugs from generateStaticParams
export const dynamicParams = false;

// Generate all sermon detail pages at build time
export async function generateStaticParams() {
  try {
    const slugs = await getAllSermonSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);

  if (!sermon) {
    return { title: 'Preek niet gevonden' };
  }

  const { title, summary, bibleText, date } = sermon;

  return {
    title,
    description: summary || `Preek over ${bibleText || title}`,
    openGraph: {
      title,
      description: summary || undefined,
      type: 'article',
      publishedTime: date,
    },
  };
}

export default async function SermonDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const sermon = await getSermonBySlug(slug);

  if (!sermon) {
    notFound();
  }

  const { title, date, bibleText, bibleReference, content, summary, audio, speaker, themes } = sermon;
  
  // Use structured bibleReference if available, otherwise fall back to bibleText
  const displayBibleText = formatBibleReference(bibleReference) || bibleText;

  return (
    <div>
      {/* Page Header */}
      <div className="relative bg-gradient-to-b from-warm-100 via-warm-50 to-warm-50 border-b border-warm-200 overflow-hidden">
        {/* Decorative background */}
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
                <Link href="/sermons" className="text-warm-500 hover:text-primary-600 transition-colors">
                  Preken
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-warm-800 font-medium truncate max-w-[140px] sm:max-w-[240px]">{title}</li>
            </ol>
          </nav>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-warm-900 mb-8 font-serif leading-tight">
            {title}
          </h1>

          {/* Metadata pills */}
          <div className="flex flex-wrap items-center gap-3">
            <time dateTime={date} className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-warm-200 rounded-xl text-sm font-medium text-warm-700">
              <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(date)}
            </time>

            {speaker && (
              <Link
                href={`/dominees/${speaker.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-warm-200 rounded-xl text-sm font-medium text-warm-700 hover:border-primary-200 hover:bg-primary-50/40 hover:text-primary-700 transition-colors"
              >
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {speaker.name}
              </Link>
            )}

            {displayBibleText && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 shadow-sm border border-primary-200 rounded-xl text-sm font-medium text-primary-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {displayBibleText}
              </span>
            )}

            <FavoriteButton
              item={{
                slug,
                title,
                date,
                speakerName: speaker?.name,
                bibleText: displayBibleText,
              }}
            />
          </div>

          {/* Themes */}
          {themes && themes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {themes.map((theme) => (
                <span
                  key={theme.id}
                  className="px-3 py-1.5 bg-accent-100 text-accent-700 rounded-lg text-sm font-medium"
                >
                  {theme.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Audio Player */}
        {audio && (
          <div className="mb-12">
            <AudioPlayer
              url={audio.url}
              title={title}
              sermonSlug={slug}
              speakerName={speaker?.name ?? undefined}
              date={date}
              bibleText={displayBibleText}
            />
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="relative bg-gradient-to-br from-primary-50 via-warm-50 to-primary-50/30 rounded-2xl p-5 sm:p-8 mb-12 border border-primary-100/50 overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative">
              <h2 className="text-lg font-semibold text-warm-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
                Samenvatting
              </h2>
              <p className="text-warm-700 leading-relaxed text-base sm:text-lg">{summary}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {content && (
          <div
            className="prose prose-warm max-w-none prose-headings:font-serif prose-headings:text-warm-900 prose-p:text-warm-700 prose-a:text-primary-600 prose-strong:text-warm-800 prose-lg"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {/* Back link */}
        <div className="mt-20 pt-10 border-t border-warm-200">
          <Link
            href="/sermons"
            className="inline-flex items-center gap-3 px-6 py-3 bg-warm-100 hover:bg-warm-200 text-warm-700 rounded-xl font-semibold group transition-all"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Terug naar alle preken
          </Link>
        </div>
      </article>
    </div>
  );
}
