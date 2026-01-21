import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-warm-900/40 rounded-2xl border border-warm-100 dark:border-warm-800/60 p-6">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-3" />
              <Skeleton className="h-20 w-full mt-5" />
              <div className="flex gap-2 mt-5">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
