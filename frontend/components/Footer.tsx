import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-warm-900 to-warm-950 text-warm-300 mt-auto">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand - takes more space */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-900/50">
                PP
              </span>
              <span className="text-xl font-bold text-white">
                Prikkelende Preken
              </span>
            </div>
            <p className="text-warm-400 leading-relaxed mb-6 max-w-sm">
              Ontdek inspirerende preken uit ons archief. 
              Luister, lees en laat je raken door Gods Woord.
            </p>
            {/* Social proof / stats */}
            <div className="flex items-center gap-6 text-sm">
              <div>
                <div className="text-2xl font-bold text-white">100+</div>
                <div className="text-warm-500">Preken</div>
              </div>
              <div className="w-px h-10 bg-warm-800" />
              <div>
                <div className="text-2xl font-bold text-white">20+</div>
                <div className="text-warm-500">Sprekers</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
              Navigatie
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-warm-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <svg className="w-4 h-4 text-warm-600 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/sermons" className="text-warm-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <svg className="w-4 h-4 text-warm-600 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Alle Preken
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div className="md:col-span-4">
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
              Blijf op de hoogte
            </h3>
            <p className="text-warm-400 text-sm mb-4">
              Ontvang een notificatie bij nieuwe preken.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="je@email.nl"
                className="flex-1 px-4 py-2.5 bg-warm-800/50 border border-warm-700 rounded-xl text-sm text-white placeholder-warm-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-primary-900/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-warm-800/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-warm-500 text-sm">
              © {currentYear} Prikkelende Preken. Alle rechten voorbehouden.
            </p>
            <div className="flex items-center gap-1 text-warm-600 text-sm">
              <span>Gemaakt met</span>
              <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>voor Gods Woord</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
