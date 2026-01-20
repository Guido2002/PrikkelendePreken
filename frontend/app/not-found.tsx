import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 relative">
      {/* Warm ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-radial from-bronze-600/10 to-transparent rounded-full blur-3xl" />
      
      <div className="card-70s max-w-md w-full p-8 text-center relative">
        {/* Decorative 404 */}
        <div className="mb-8">
          <div className="relative inline-block">
            <span className="text-7xl md:text-9xl font-display font-bold text-bronze-600/20">
              404
            </span>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:text-5xl font-display font-bold text-cream-200">
              404
            </span>
          </div>
        </div>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-wood-800/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-bronze-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        <h1 className="text-xl md:text-2xl font-display font-semibold text-cream-100 mb-3">
          Pagina niet gevonden
        </h1>
        <p className="text-cream-300/70 mb-8 leading-relaxed">
          De pagina die je zoekt bestaat niet of is verplaatst naar een andere locatie.
        </p>
        
        {/* Divider */}
        <div className="divider-70s mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="btn-70s-primary inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Terug naar home
          </Link>
          <Link href="/sermons" className="btn-70s inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Bekijk preken
          </Link>
        </div>
      </div>
    </div>
  );
}
