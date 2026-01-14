import Link from 'next/link';
import { Sermon } from '@/lib/types';
import { formatDate } from '@/lib/strapi';

interface SermonCardProps {
  sermon: Sermon;
}

export default function SermonCard({ sermon }: SermonCardProps) {
  const { title, slug, date, summary, bibleText, speaker } = sermon;
  const speakerName = speaker?.name;

  return (
    <article className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <Link href={`/sermons/${slug}`}>
        <h2 className="text-xl font-semibold text-gray-900 hover:text-primary-600 mb-2">
          {title}
        </h2>
      </Link>
      
      <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-3">
        <time dateTime={date}>{formatDate(date)}</time>
        {speakerName && (
          <>
            <span>•</span>
            <span>{speakerName}</span>
          </>
        )}
        {bibleText && (
          <>
            <span>•</span>
            <span className="italic">{bibleText}</span>
          </>
        )}
      </div>

      {summary && (
        <p className="text-gray-600 line-clamp-2">{summary}</p>
      )}

      <Link
        href={`/sermons/${slug}`}
        className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
      >
        Lees meer →
      </Link>
    </article>
  );
}
