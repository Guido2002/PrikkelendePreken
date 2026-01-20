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
    <div className="bg-warm-100">
      {/* Page Header - 90s Window Style */}
      <div className="bg-warm-200 border-b-4 border-warm-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
                <li>
                  <Link href="/sermons" className="link-90s">
                    📂 Preken
                  </Link>
                </li>
                <li className="text-warm-600">\</li>
                <li className="text-warm-800 font-bold truncate max-w-[140px] sm:max-w-[240px]">📄 {title}</li>
              </ol>
            </div>
          </nav>

          {/* Title - 90s style with marquee-like appearance */}
          <div className="window-90s">
            <div className="window-90s-titlebar">
              <span>📖 preek_detail.exe</span>
            </div>
            <div className="window-90s-content">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-warm-900 font-heading mb-4">
                ✝️ {title}
              </h1>

              {/* Metadata - 90s table style */}
              <table className="w-full text-sm border-collapse mb-4">
                <tbody>
                  <tr className="border-b border-warm-300">
                    <td className="py-2 font-bold text-warm-700 w-28">📅 Datum:</td>
                    <td className="py-2">
                      <time dateTime={date} className="text-warm-900">{formatDate(date)}</time>
                    </td>
                  </tr>
                  {speaker && (
                    <tr className="border-b border-warm-300">
                      <td className="py-2 font-bold text-warm-700">👤 Dominee:</td>
                      <td className="py-2">
                        <Link href={`/dominees/${speaker.slug}`} className="link-90s">
                          {speaker.name}
                        </Link>
                      </td>
                    </tr>
                  )}
                  {displayBibleText && (
                    <tr className="border-b border-warm-300">
                      <td className="py-2 font-bold text-warm-700">📜 Bijbeltekst:</td>
                      <td className="py-2 text-primary-700 font-bold">{displayBibleText}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Themes - 90s tag style */}
              {themes && themes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-bold text-warm-700">🏷️ Thema&apos;s:</span>
                  {themes.map((theme) => (
                    <span
                      key={theme.id}
                      className="px-2 py-1 bevel-outset bg-accent-100 text-accent-800 text-xs font-bold"
                    >
                      {theme.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Audio Player */}
        {audio && (
          <div className="mb-8">
            <AudioPlayer
              url={audio.url}
              title={title}
            />
          </div>
        )}

        {/* Summary - 90s window style */}
        {summary && (
          <div className="window-90s mb-8">
            <div className="window-90s-titlebar">
              <span>📝 samenvatting.txt</span>
            </div>
            <div className="window-90s-content">
              <p className="text-warm-700 leading-relaxed">{summary}</p>
            </div>
          </div>
        )}

        {/* Content - 90s document style */}
        {content && (
          <div className="window-90s mb-8">
            <div className="window-90s-titlebar">
              <span>📄 preek_inhoud.doc</span>
            </div>
            <div className="window-90s-content">
              <div
                className="prose prose-warm max-w-none prose-headings:font-heading prose-headings:text-warm-900 prose-p:text-warm-700 prose-a:text-primary-600 prose-strong:text-warm-800"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        )}

        {/* Back link - 90s button style */}
        <div className="mt-12 pt-8 border-t-2 border-warm-300">
          <Link href="/sermons" className="btn-90s inline-flex items-center gap-2">
            ⬅️ Terug naar alle preken
          </Link>
        </div>
      </article>
    </div>
  );
}
