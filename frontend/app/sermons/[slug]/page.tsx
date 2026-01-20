import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AudioPlayer from '@/components/AudioPlayer';
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
      <div className="relative py-16 bg-gradient-to-b from-wood-900/50 to-wood-950">
        {/* Warm glow */}
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
                <Link href="/sermons" className="hover:text-bronze-400 transition-colors">
                  Preken
                </Link>
              </li>
              <li><span className="mx-2">/</span></li>
              <li className="text-cream-200 truncate max-w-[200px]">{title}</li>
            </ol>
          </nav>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-cream-100 mb-6 text-shadow-warm">
            {title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-cream-300/70">
            <time dateTime={date} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-bronze-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              {formatDate(date)}
            </time>
            
            {speaker && (
              <>
                <span className="text-bronze-600/40">·</span>
                <Link 
                  href={`/dominees/${speaker.slug}`} 
                  className="flex items-center gap-2 text-bronze-400 hover:text-bronze-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  {speaker.name}
                </Link>
              </>
            )}
            
            {displayBibleText && (
              <>
                <span className="text-bronze-600/40">·</span>
                <span className="flex items-center gap-2 text-cream-200 italic">
                  <svg className="w-4 h-4 text-bronze-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                  {displayBibleText}
                </span>
              </>
            )}
          </div>

          {/* Themes */}
          {themes && themes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {themes.map((theme) => (
                <span
                  key={theme.id}
                  className="tag-70s"
                >
                  {theme.name}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-wood-950 to-transparent" />
      </div>

      {/* Content Area */}
      <article className="max-w-4xl mx-auto px-4 py-12">
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
          <div className="card-70s p-6 mb-10">
            <h2 className="font-display text-lg text-bronze-400 mb-3">Samenvatting</h2>
            <p className="text-cream-200/80 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Content */}
        {content && (
          <div className="card-70s p-6 md:p-8">
            <div
              className="prose-70s"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-bronze-800/30">
          <Link 
            href="/sermons" 
            className="inline-flex items-center gap-2 text-bronze-400 hover:text-bronze-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Terug naar alle preken
          </Link>
        </div>
      </article>
    </div>
  );
}
