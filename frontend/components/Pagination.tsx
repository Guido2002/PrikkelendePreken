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
    <nav className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16" aria-label="Paginering">
      {/* Page info for mobile */}
      <div className="sm:hidden text-sm text-warm-500">
        Pagina {currentPage} van {totalPages}
      </div>

      <div className="flex items-center gap-2">
        {/* Previous button */}
        {currentPage > 1 ? (
          <Link
            href={currentPage === 2 ? '/sermons' : `/sermons/page/${currentPage - 1}`}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-warm-200 rounded-xl text-warm-700 hover:bg-warm-50 hover:border-primary-300 hover:text-primary-700 transition-all font-medium shadow-sm group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Vorige</span>
          </Link>
        ) : (
          <span className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-warm-50 border border-warm-100 rounded-xl text-warm-400 font-medium cursor-not-allowed">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Vorige</span>
          </span>
        )}

        {/* Page numbers */}
        <div className="hidden sm:flex items-center gap-1.5">
          {pages.map((page, index) => (
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="w-10 h-11 flex items-center justify-center text-warm-400">
                •••
              </span>
            ) : (
              <Link
                key={page}
                href={page === 1 ? '/sermons' : `/sermons/page/${page}`}
                className={`min-w-[44px] h-11 flex items-center justify-center rounded-xl font-semibold transition-all ${
                  page === currentPage
                    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-md shadow-primary-600/25'
                    : 'bg-white border border-warm-200 text-warm-700 hover:bg-warm-50 hover:border-primary-300 hover:text-primary-700 shadow-sm'
                }`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            )
          ))}
        </div>

        {/* Current page indicator for mobile */}
        <div className="sm:hidden flex items-center gap-1">
          <span className="min-w-[44px] h-11 flex items-center justify-center rounded-xl font-semibold bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-md">
            {currentPage}
          </span>
        </div>

        {/* Next button */}
        {currentPage < totalPages ? (
          <Link
            href={`/sermons/page/${currentPage + 1}`}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-warm-200 rounded-xl text-warm-700 hover:bg-warm-50 hover:border-primary-300 hover:text-primary-700 transition-all font-medium shadow-sm group"
          >
            <span className="hidden sm:inline">Volgende</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-warm-50 border border-warm-100 rounded-xl text-warm-400 font-medium cursor-not-allowed">
            <span className="hidden sm:inline">Volgende</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </nav>
  );
}
