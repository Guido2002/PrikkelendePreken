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
    <nav className="mt-12" aria-label="Paginering">
      {/* 90s Window-style pagination */}
      <div className="window-90s inline-block mx-auto">
        <div className="window-90s-titlebar text-xs">
          📄 Pagina {currentPage} van {totalPages}
        </div>
        <div className="window-90s-content p-2">
          <div className="flex items-center gap-1">
            {/* Previous button */}
            {currentPage > 1 ? (
              <Link
                href={currentPage === 2 ? '/sermons' : `/sermons/page/${currentPage - 1}`}
                className="btn-90s text-xs px-3 py-1"
              >
                ◄ Vorige
              </Link>
            ) : (
              <span className="btn-90s text-xs px-3 py-1 opacity-50 cursor-not-allowed">
                ◄ Vorige
              </span>
            )}

            {/* Page numbers */}
            <div className="hidden sm:flex items-center gap-1 mx-2">
              {pages.map((page, index) => (
                page === 'ellipsis' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-warm-500 font-mono">
                    ...
                  </span>
                ) : (
                  <Link
                    key={page}
                    href={page === 1 ? '/sermons' : `/sermons/page/${page}`}
                    className={`w-8 h-8 flex items-center justify-center font-bold text-sm ${
                      page === currentPage
                        ? 'bevel-inset bg-primary-600 text-white'
                        : 'btn-90s'
                    }`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </Link>
                )
              ))}
            </div>

            {/* Mobile: Current page display */}
            <div className="sm:hidden mx-2">
              <span className="bevel-inset bg-primary-600 text-white w-8 h-8 flex items-center justify-center font-bold text-sm">
                {currentPage}
              </span>
            </div>

            {/* Next button */}
            {currentPage < totalPages ? (
              <Link
                href={`/sermons/page/${currentPage + 1}`}
                className="btn-90s text-xs px-3 py-1"
              >
                Volgende ►
              </Link>
            ) : (
              <span className="btn-90s text-xs px-3 py-1 opacity-50 cursor-not-allowed">
                Volgende ►
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
