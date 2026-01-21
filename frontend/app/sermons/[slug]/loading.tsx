import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <div>
      <div className="relative bg-gradient-to-b from-warm-100 via-warm-50 to-warm-50 dark:from-warm-950 dark:via-warm-950 dark:to-warm-950 border-b border-warm-200 dark:border-warm-900/60 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Skeleton className="h-5 w-60 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-8" />
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-44" />
            <Skeleton className="h-10 w-44" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-12">
          <div className="bg-gradient-to-br from-warm-900 via-primary-900 to-warm-900 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-5 w-1/3 bg-white/20" />
              <Skeleton className="h-9 w-24 bg-white/20" />
            </div>
            <Skeleton className="h-3 w-full bg-white/20" />
            <div className="flex items-center justify-between mt-4">
              <Skeleton className="h-4 w-16 bg-white/20" />
              <Skeleton className="h-4 w-16 bg-white/20" />
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <Skeleton className="h-12 w-12 rounded-xl bg-white/20" />
              <Skeleton className="h-16 w-16 rounded-full bg-white/20" />
              <Skeleton className="h-12 w-12 rounded-xl bg-white/20" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-warm-900/40 rounded-2xl border border-warm-100 dark:border-warm-800/60 p-6 sm:p-8 mb-12">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-3 mt-5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </div>
        </div>

        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-9/12" />
          <Skeleton className="h-4 w-11/12" />
        </div>
      </article>
    </div>
  );
}
