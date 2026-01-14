import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center items-center gap-2 mt-12" aria-label="Paginering">
      {currentPage > 1 && (
        <Link
          href={currentPage === 2 ? '/sermons' : `/sermons/page/${currentPage - 1}`}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-warm-200 rounded-xl text-warm-700 hover:bg-warm-50 hover:border-warm-300 transition-all font-medium shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Vorige
        </Link>
      )}

      <div className="flex gap-1.5">
        {pages.map((page) => (
          <Link
            key={page}
            href={page === 1 ? '/sermons' : `/sermons/page/${page}`}
            className={`min-w-[44px] h-11 flex items-center justify-center rounded-xl font-semibold transition-all ${
              page === currentPage
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md'
                : 'bg-white border border-warm-200 text-warm-700 hover:bg-warm-50 hover:border-warm-300 shadow-sm'
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {currentPage < totalPages && (
        <Link
          href={`/sermons/page/${currentPage + 1}`}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-warm-200 rounded-xl text-warm-700 hover:bg-warm-50 hover:border-warm-300 transition-all font-medium shadow-sm"
        >
          Volgende
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </nav>
  );
}
