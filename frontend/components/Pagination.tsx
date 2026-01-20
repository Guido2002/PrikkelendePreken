import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="mt-12 flex justify-center" aria-label="Paginering">
      <div className="inline-flex items-center gap-2">
        {/* Previous button */}
        {currentPage > 1 ? (
          <Link
            href={currentPage === 2 ? '/sermons' : `/sermons/page/${currentPage - 1}`}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-cream-300 hover:text-bronze-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span className="hidden sm:inline">Vorige</span>
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 px-4 py-2 text-sm text-cream-500/40 cursor-not-allowed">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span className="hidden sm:inline">Vorige</span>
          </span>
        )}

        {/* Divider */}
        <div className="w-px h-6 bg-gradient-to-b from-transparent via-bronze-600/30 to-transparent mx-1" />

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pages.map((page, index) => (
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-cream-500/50">
                ···
              </span>
            ) : (
              <Link
                key={page}
                href={page === 1 ? '/sermons' : `/sermons/page/${page}`}
                className={`w-10 h-10 flex items-center justify-center text-sm rounded transition-all duration-300 ${
                  page === currentPage
                    ? 'bg-gradient-to-br from-bronze-500 to-bronze-700 text-wood-950 font-semibold shadow-glow'
                    : 'text-cream-300 hover:text-bronze-400 hover:bg-wood-800/50'
                }`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            )
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gradient-to-b from-transparent via-bronze-600/30 to-transparent mx-1" />

        {/* Next button */}
        {currentPage < totalPages ? (
          <Link
            href={`/sermons/page/${currentPage + 1}`}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-cream-300 hover:text-bronze-400 transition-colors"
          >
            <span className="hidden sm:inline">Volgende</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 px-4 py-2 text-sm text-cream-500/40 cursor-not-allowed">
            <span className="hidden sm:inline">Volgende</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        )}
      </div>

      {/* Page indicator for accessibility */}
      <span className="sr-only">
        Pagina {currentPage} van {totalPages}
      </span>
    </nav>
  );
}
