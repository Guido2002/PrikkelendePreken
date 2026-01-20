import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-warm-100">
      <div className="window-90s max-w-md w-full">
        <div className="window-90s-titlebar flex items-center justify-between">
          <span>❌ error_404.exe</span>
          <div className="flex gap-1">
            <span className="w-4 h-4 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center">_</span>
            <span className="w-4 h-4 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center">□</span>
            <span className="w-4 h-4 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center">×</span>
          </div>
        </div>
        <div className="window-90s-content text-center">
          {/* Decorative 404 */}
          <div className="mb-6">
            <div className="bevel-inset bg-primary-100 p-4 inline-block">
              <span className="text-6xl md:text-8xl font-bold text-primary-700 font-heading">
                404
              </span>
            </div>
          </div>

          <div className="text-5xl mb-4">😵</div>

          <h1 className="text-xl md:text-2xl font-bold text-warm-900 mb-3 font-heading">
            Pagina niet gevonden!
          </h1>
          <p className="text-warm-600 mb-6 leading-relaxed">
            De pagina die je zoekt bestaat niet of is verplaatst naar een andere locatie.
          </p>
          
          <div className="hr-groove mb-6"></div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="btn-90s-primary">
              🏠 Terug naar home
            </Link>
            <Link href="/sermons" className="btn-90s">
              📂 Bekijk preken
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
