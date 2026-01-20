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
    <article className="card-70s group">
      {/* Card content */}
      <div className="p-5">
        {/* Date & Audio badge row */}
        <div className="flex items-center justify-between mb-4">
          <time dateTime={date} className="text-xs text-cream-400/70 tracking-wide">
            {formatDate(date)}
          </time>
          {audio && (
            <span className="flex items-center gap-1.5 text-xs text-bronze-400">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              Audio
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-display text-xl font-semibold text-cream-100 mb-3 leading-snug line-clamp-2 group-hover:text-bronze-400 transition-colors duration-300">
          <Link href={`/sermons/${slug}`}>
            {title}
          </Link>
        </h2>

        {/* Summary */}
        {summary && (
          <p className="text-cream-300/70 text-sm line-clamp-2 mb-4 leading-relaxed">
            {summary}
          </p>
        )}

        {/* Divider */}
        <div className="divider-70s my-4" />

        {/* Meta info */}
        <div className="space-y-2 mb-5">
          {speakerName && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-cream-400/50 w-16">Spreker</span>
              {speakerSlug ? (
                <Link 
                  href={`/dominees/${speakerSlug}`} 
                  className="text-bronze-400 hover:text-bronze-300 transition-colors"
                >
                  {speakerName}
                </Link>
              ) : (
                <span className="text-cream-300">{speakerName}</span>
              )}
            </div>
          )}
          {displayBibleText && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-cream-400/50 w-16">Tekst</span>
              <span className="text-cream-200 italic">{displayBibleText}</span>
            </div>
          )}
        </div>

        {/* Action link */}
        <Link
          href={`/sermons/${slug}`}
          className="inline-flex items-center gap-2 text-sm text-bronze-400 hover:text-bronze-300 transition-colors group/link"
        >
          <span>Bekijk preek</span>
          <svg 
            className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={1.5} 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
