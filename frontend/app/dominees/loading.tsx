import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <div>
      <section className="bg-gradient-to-b from-warm-100 via-warm-50 to-warm-50 border-b border-warm-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Skeleton className="h-6 w-40 mb-6" />
          <Skeleton className="h-10 w-56 mb-4" />
          <Skeleton className="h-6 w-96 max-w-full" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-warm-100 overflow-hidden">
              <Skeleton className="h-44 sm:h-48 w-full rounded-none" />
              <div className="p-6">
                <Skeleton className="h-5 w-2/3" />
                <div className="space-y-2 mt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-10/12" />
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-warm-100">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
