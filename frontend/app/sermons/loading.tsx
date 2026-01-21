import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <div>
      <section className="bg-gradient-to-b from-warm-100 via-warm-50 to-warm-50 dark:from-warm-950 dark:via-warm-950 dark:to-warm-950 border-b border-warm-200 dark:border-warm-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Skeleton className="h-6 w-40 mb-6" />
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96 max-w-full" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <article key={i} className="bg-white dark:bg-warm-900/40 rounded-2xl border border-warm-100 dark:border-warm-800/60 p-6">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-3" />
              <Skeleton className="h-4 w-2/3 mt-2" />
              <Skeleton className="h-24 w-full mt-5" />
              <div className="flex items-center justify-between mt-6">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-10" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
