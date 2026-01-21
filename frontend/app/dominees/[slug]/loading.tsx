import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <Skeleton className="h-6 w-60 mb-8" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-warm-900/40 rounded-2xl border border-warm-100 dark:border-warm-800/60 overflow-hidden">
            <Skeleton className="h-72 w-full rounded-none" />
            <div className="p-6">
              <Skeleton className="h-8 w-2/3" />
              <div className="space-y-2 mt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-10/12" />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-warm-900/40 rounded-2xl border border-warm-100 dark:border-warm-800/60 p-6 sm:p-8">
            <Skeleton className="h-7 w-48" />
            <div className="space-y-3 mt-5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-9/12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
