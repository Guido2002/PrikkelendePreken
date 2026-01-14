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
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm" aria-label="Breadcrumb">
        <ol className="flex gap-2 text-gray-500">
          <li>
            <Link href="/" className="hover:text-primary-600">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/sermons" className="hover:text-primary-600">
              Preken
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 truncate max-w-[200px]">{title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {title}
        </h1>

        <div className="flex flex-wrap gap-4 text-gray-600">
          <time dateTime={date} className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(date)}
          </time>

          {speaker && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {speaker.name}
            </span>
          )}

          {bibleText && (
            <span className="flex items-center gap-1 italic">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {bibleText}
            </span>
          )}
        </div>

        {/* Themes */}
        {themes && themes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {themes.map((theme) => (
              <span
                key={theme.id}
                className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
              >
                {theme.name}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Audio Player */}
      {audio && (
        <div className="mb-8">
          <AudioPlayer
            url={audio.url}
            title={title}
          />
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Samenvatting</h2>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}

      {/* Content */}
      {content && (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}

      {/* Back link */}
      <div className="mt-12 pt-8 border-t">
        <Link
          href="/sermons"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Terug naar alle preken
        </Link>
      </div>
    </article>
  );
}
