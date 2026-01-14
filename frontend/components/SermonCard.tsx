import Link from 'next/link';
import { Sermon } from '@/lib/types';
import { formatDate, formatBibleReference } from '@/lib/strapi';

interface SermonCardProps {
  sermon: Sermon;
}

export default function SermonCard({ sermon }: SermonCardProps) {
  const { title, slug, date, summary, bibleText, bibleReference, speaker, audio } = sermon;
  const speakerName = speaker?.name;
  
  // Use structured bibleReference if available, otherwise fall back to bibleText
  const displayBibleText = formatBibleReference(bibleReference) || bibleText;

  return (
    <article className="group relative bg-white rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden border border-warm-100 hover:border-primary-200/60">
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-100/0 group-hover:from-primary-50/30 group-hover:to-primary-100/20 transition-all duration-500 pointer-events-none" />
      
      <Link href={`/sermons/${slug}`} className="block relative">
        <div className="p-6">
          {/* Top row: Date & Audio badge */}
          <div className="flex items-center justify-between mb-4">
            <time dateTime={date} className="flex items-center gap-1.5 text-sm text-warm-500">
              <svg className="w-4 h-4 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(date)}
            </time>
            {audio && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
                </span>
                Audio
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-warm-900 group-hover:text-primary-700 transition-colors line-clamp-2 font-serif mb-4 leading-snug">
            {title}
          </h2>

          {/* Summary */}
          {summary && (
            <p className="text-warm-600 text-sm leading-relaxed line-clamp-2 mb-5">
              {summary}
            </p>
          )}

          {/* Meta tags */}
          <div className="flex flex-wrap items-center gap-2">
            {speakerName ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warm-50 text-warm-700 rounded-lg text-sm font-medium border border-warm-100">
                <svg className="w-3.5 h-3.5 text-warm-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {speakerName}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warm-50 text-warm-400 rounded-lg text-sm border border-warm-100">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Onbekend
              </span>
            )}
            {displayBibleText && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium border border-primary-100">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {displayBibleText}
              </span>
            )}
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="px-6 py-4 bg-warm-50/50 border-t border-warm-100 group-hover:bg-primary-50/30 transition-colors">
          <span className="inline-flex items-center gap-2 text-primary-600 group-hover:text-primary-700 font-semibold text-sm">
            Bekijk preek
            <svg 
              className="w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}
