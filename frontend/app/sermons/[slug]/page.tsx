import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AudioPlayer from '@/components/AudioPlayer';
import { getSermonBySlug, getAllSermonSlugs, formatDate } from '@/lib/strapi';

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

  const { title, date, bibleText, content, summary, audio, speaker, themes } = sermon;

  return (
    <div>
      {/* Page Header */}
      <div className="bg-gradient-to-b from-warm-100 to-warm-50 border-b border-warm-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-warm-500">
              <li>
                <Link href="/" className="hover:text-primary-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <Link href="/sermons" className="hover:text-primary-600 transition-colors">
                  Preken
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-warm-700 font-medium truncate max-w-[200px]">{title}</li>
            </ol>
          </nav>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-warm-900 mb-6 font-serif leading-tight">
            {title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-warm-600">
            <time dateTime={date} className="flex items-center gap-2 bg-white/60 backdrop-blur px-3 py-1.5 rounded-full text-sm font-medium">
              <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(date)}
            </time>

            {speaker && (
              <span className="flex items-center gap-2 bg-white/60 backdrop-blur px-3 py-1.5 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {speaker.name}
              </span>
            )}

            {bibleText && (
              <span className="flex items-center gap-2 bg-primary-100/60 backdrop-blur px-3 py-1.5 rounded-full text-sm font-medium text-primary-700 italic">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {bibleText}
              </span>
            )}
          </div>

          {/* Themes */}
          {themes && themes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {themes.map((theme) => (
                <span
                  key={theme.id}
                  className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium"
                >
                  {theme.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Audio Player */}
        {audio && (
          <div className="mb-10">
            <AudioPlayer
              url={audio.url}
              title={title}
            />
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="bg-gradient-to-r from-primary-50 to-warm-50 rounded-2xl p-6 md:p-8 mb-10 border border-primary-100">
            <h2 className="text-lg font-semibold text-warm-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Samenvatting
            </h2>
            <p className="text-warm-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Content */}
        {content && (
          <div
            className="prose prose-warm max-w-none prose-headings:font-serif prose-headings:text-warm-900 prose-p:text-warm-700 prose-a:text-primary-600 prose-strong:text-warm-800"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-warm-200">
          <Link
            href="/sermons"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold group transition-colors"
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
