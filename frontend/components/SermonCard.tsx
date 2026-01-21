import Link from 'next/link';
import { Sermon } from '@/lib/types';
import { formatDate, formatBibleReference } from '@/lib/strapi';
import FavoriteButton from '@/components/FavoriteButton';

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
    <article className="group relative bg-white dark:bg-warm-900/40 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden border border-warm-100 dark:border-warm-800/60 hover:border-primary-200/60 dark:hover:border-primary-400/40 flex flex-col">
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-100/0 group-hover:from-primary-50/30 group-hover:to-primary-100/20 transition-all duration-500 pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="p-5 sm:p-6">
          {/* Top row: Date & Audio badge */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <time dateTime={date} className="flex items-center gap-1.5 text-sm text-warm-500 dark:text-warm-300">
              <svg className="w-4 h-4 text-warm-400 dark:text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(date)}
            </time>
            <div className="flex items-center gap-2">
              {audio && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
                  </span>
                  Audio
                </span>
              )}
              <FavoriteButton
                item={{
                  slug,
                  title,
                  date,
                  speakerName,
                  bibleText: displayBibleText,
                }}
                className="w-9 h-9 rounded-xl border border-warm-200 dark:border-warm-800 bg-white dark:bg-warm-950/40 text-warm-500 dark:text-warm-300 hover:text-primary-700 dark:hover:text-primary-200 hover:border-primary-200 dark:hover:border-primary-400/40 hover:bg-primary-50/40 dark:hover:bg-primary-900/20 transition-colors inline-flex items-center justify-center"
              />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-warm-900 dark:text-warm-50 group-hover:text-primary-700 dark:group-hover:text-primary-200 transition-colors line-clamp-2 font-serif mb-4 leading-snug">
            <Link href={`/sermons/${slug}`} className="hover:underline decoration-primary-300 underline-offset-4">
              {title}
            </Link>
          </h2>

          {/* Summary */}
          {summary && (
            <p className="text-warm-600 dark:text-warm-200 text-sm leading-relaxed line-clamp-2 mb-5">
              {summary}
            </p>
          )}

          {/* Meta tags */}
          <div className="flex flex-wrap items-center gap-2">
            {speakerName && speakerSlug ? (
              <Link
                href={`/dominees/${speakerSlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warm-50 dark:bg-warm-950/30 text-warm-700 dark:text-warm-100 rounded-lg text-sm font-medium border border-warm-100 dark:border-warm-800 hover:border-primary-200 dark:hover:border-primary-400/40 hover:bg-primary-50/40 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-200 transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-warm-400 dark:text-warm-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {speakerName}
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warm-50 dark:bg-warm-950/30 text-warm-400 dark:text-warm-400 rounded-lg text-sm border border-warm-100 dark:border-warm-800">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Onbekend
              </span>
            )}
            {displayBibleText && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-200 rounded-lg text-sm font-medium border border-primary-100 dark:border-primary-800/40">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {displayBibleText}
              </span>
            )}
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="mt-auto px-5 sm:px-6 py-4 bg-warm-50/50 dark:bg-warm-950/30 border-t border-warm-100 dark:border-warm-800/60 group-hover:bg-primary-50/30 dark:group-hover:bg-primary-900/15 transition-colors">
          <Link
            href={`/sermons/${slug}`}
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-200 group-hover:text-primary-700 dark:group-hover:text-primary-100 font-semibold text-sm"
          >
            Bekijk preek
            <svg 
              className="w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
