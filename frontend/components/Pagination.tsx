'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

type Ellipsis = 'ellipsis-left' | 'ellipsis-right';

export default function Pagination({ currentPage, totalPages }: Readonly<PaginationProps>) {
  if (totalPages <= 1) return null;

  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const withQuery = (path: string) => (queryString ? `${path}?${queryString}` : path);

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages: (number | Ellipsis)[] = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis-left');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis-right');
      }

      // Always show last page
      pages.push(totalPages);

      return pages;
    }

    // Show all pages if 7 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16" aria-label="Paginering">
      {/* Page info for mobile */}
      <div className="sm:hidden text-sm text-warm-500 dark:text-warm-300">
        Pagina {currentPage} van {totalPages}
      </div>

      <div className="flex items-center gap-2">
        {/* Previous button */}
        {currentPage > 1 ? (
          <Link
            href={withQuery(currentPage === 2 ? '/sermons' : `/sermons/page/${currentPage - 1}`)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 rounded-xl text-warm-700 dark:text-warm-100 hover:bg-warm-50 dark:hover:bg-warm-900/30 hover:border-primary-300 dark:hover:border-primary-400/40 hover:text-primary-700 dark:hover:text-primary-200 transition-all font-medium shadow-sm group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Vorige</span>
          </Link>
        ) : (
          <span className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-warm-50 dark:bg-warm-900/20 border border-warm-100 dark:border-warm-800 rounded-xl text-warm-400 dark:text-warm-500 font-medium cursor-not-allowed">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Vorige</span>
          </span>
        )}

        {/* Page numbers */}
        <div className="hidden sm:flex items-center gap-1.5">
          {pages.map((page) => (
            page === 'ellipsis-left' || page === 'ellipsis-right' ? (
              <span key={page} className="w-10 h-11 flex items-center justify-center text-warm-400 dark:text-warm-500">
                •••
              </span>
            ) : (
              <Link
                key={page}
                href={withQuery(page === 1 ? '/sermons' : `/sermons/page/${page}`)}
                className={`min-w-[44px] h-11 flex items-center justify-center rounded-xl font-semibold transition-all ${
                  page === currentPage
                    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-md shadow-primary-600/25'
                    : 'bg-white dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 text-warm-700 dark:text-warm-100 hover:bg-warm-50 dark:hover:bg-warm-900/30 hover:border-primary-300 dark:hover:border-primary-400/40 hover:text-primary-700 dark:hover:text-primary-200 shadow-sm'
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
            href={withQuery(`/sermons/page/${currentPage + 1}`)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-warm-950/40 border border-warm-200 dark:border-warm-800 rounded-xl text-warm-700 dark:text-warm-100 hover:bg-warm-50 dark:hover:bg-warm-900/30 hover:border-primary-300 dark:hover:border-primary-400/40 hover:text-primary-700 dark:hover:text-primary-200 transition-all font-medium shadow-sm group"
          >
            <span className="hidden sm:inline">Volgende</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-warm-50 dark:bg-warm-900/20 border border-warm-100 dark:border-warm-800 rounded-xl text-warm-400 dark:text-warm-500 font-medium cursor-not-allowed">
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
