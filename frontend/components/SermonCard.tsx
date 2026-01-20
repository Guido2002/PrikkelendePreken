import Link from 'next/link';
import { Sermon } from '@/lib/types';
import { formatDate, formatBibleReference } from '@/lib/strapi';

interface SermonCardProps {
  sermon: Sermon;
}

export default function SermonCard({ sermon }: SermonCardProps) {
  const { title, slug, date, summary, bibleText, bibleReference, speaker, audio } = sermon;
  const speakerName = speaker?.name;
  const speakerSlug = speaker?.slug;
  
  // Use structured bibleReference if available, otherwise fall back to bibleText
  const displayBibleText = formatBibleReference(bibleReference) || bibleText;

  return (
    <article className="window-90s">
      {/* Title bar - Windows 95 style */}
      <div className="window-90s-titlebar flex items-center justify-between text-sm">
        <span className="truncate flex items-center gap-1">
          📄 {title.substring(0, 30)}{title.length > 30 ? '...' : ''}.txt
        </span>
        <div className="flex gap-1 flex-shrink-0">
          {audio && (
            <span className="w-4 h-4 bevel-outset bg-green-500 text-white text-xs flex items-center justify-center" title="Audio beschikbaar">
              🔊
            </span>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="window-90s-content">
        {/* Date & Audio badge row */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-warm-200">
          <time dateTime={date} className="font-mono text-xs text-warm-600">
            📅 {formatDate(date)}
          </time>
          {audio && (
            <span className="bevel-outset bg-accent-400 text-warm-950 px-2 py-0.5 text-xs font-bold uppercase animate-pulse-glow">
              ★ Audio
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-bold text-warm-950 text-lg mb-3 leading-snug line-clamp-2">
          <Link href={`/sermons/${slug}`} className="link-90s hover:text-primary-500">
            {title}
          </Link>
        </h2>

        {/* Summary */}
        {summary && (
          <p className="text-warm-700 text-sm line-clamp-2 mb-4 leading-relaxed">
            {summary}
          </p>
        )}

        {/* Meta tags - table-like layout */}
        <div className="bevel-inset bg-warm-50 p-2 mb-3">
          <table className="w-full text-sm">
            <tbody>
              {speakerName && (
                <tr className="border-b border-warm-200">
                  <td className="py-1 text-warm-600 font-bold w-20">Spreker:</td>
                  <td className="py-1">
                    {speakerSlug ? (
                      <Link href={`/dominees/${speakerSlug}`} className="link-90s">
                        {speakerName}
                      </Link>
                    ) : (
                      <span className="text-warm-500">{speakerName}</span>
                    )}
                  </td>
                </tr>
              )}
              {displayBibleText && (
                <tr>
                  <td className="py-1 text-warm-600 font-bold">Tekst:</td>
                  <td className="py-1 text-primary-700 font-bold">{displayBibleText}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Action button */}
        <Link
          href={`/sermons/${slug}`}
          className="btn-90s-primary w-full text-center text-sm"
        >
          ▶ Bekijk preek
        </Link>
      </div>
    </article>
  );
}
