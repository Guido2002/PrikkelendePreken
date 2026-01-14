import Link from 'next/link';
import { Sermon } from '@/lib/types';
import { formatDate } from '@/lib/strapi';

interface SermonCardProps {
  sermon: Sermon;
}

export default function SermonCard({ sermon }: SermonCardProps) {
  const { title, slug, date, summary, bibleText, speaker, audio } = sermon;
  const speakerName = speaker?.name;

  return (
    <article className="group bg-white rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden border border-warm-100 hover:border-primary-200">
      {/* Card Header with accent */}
      <div className="h-2 bg-gradient-to-r from-primary-600 to-primary-400" />
      
      <div className="p-6">
        {/* Meta info */}
        <div className="flex items-center gap-3 text-sm text-warm-500 mb-3">
          <time dateTime={date} className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(date)}
          </time>
          {audio && (
            <span className="flex items-center gap-1 text-primary-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12h.01M12 12h.01M15 12h.01" />
              </svg>
              Audio
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/sermons/${slug}`} className="block mb-3">
          <h2 className="text-xl font-bold text-warm-900 group-hover:text-primary-700 transition-colors line-clamp-2 font-serif">
            {title}
          </h2>
        </Link>

        {/* Speaker & Bible Text */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {speakerName && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-warm-100 text-warm-700 rounded-full text-xs font-medium">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {speakerName}
            </span>
          )}
          {bibleText && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {bibleText}
            </span>
          )}
        </div>

        {/* Summary */}
        {summary && (
          <p className="text-warm-600 text-sm leading-relaxed line-clamp-2 mb-4">
            {summary}
          </p>
        )}

        {/* CTA */}
        <Link
          href={`/sermons/${slug}`}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group/link"
        >
          Lees meer
          <svg 
            className="w-4 h-4 transition-transform group-hover/link:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
