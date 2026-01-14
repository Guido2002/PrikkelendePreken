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
    <nav className="flex justify-center gap-2 mt-8" aria-label="Paginering">
      {currentPage > 1 && (
        <Link
          href={currentPage === 2 ? '/sermons' : `/sermons/page/${currentPage - 1}`}
          className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
        >
          ← Vorige
        </Link>
      )}

      <div className="flex gap-1">
        {pages.map((page) => (
          <Link
            key={page}
            href={page === 1 ? '/sermons' : `/sermons/page/${page}`}
            className={`px-4 py-2 border rounded-md transition-colors ${
              page === currentPage
                ? 'bg-primary-600 text-white border-primary-600'
                : 'hover:bg-gray-50'
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {currentPage < totalPages && (
        <Link
          href={`/sermons/page/${currentPage + 1}`}
          className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
        >
          Volgende →
        </Link>
      )}
    </nav>
  );
}
