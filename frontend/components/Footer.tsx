'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto relative">
      {/* Warm glow divider */}
      <div className="divider-70s" />
      
      {/* Smoke/atmosphere overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-wood-950 via-wood-950/98 to-wood-900/95" />
      </div>
      
      <div className="relative max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-12 h-12 rounded-sm bg-gradient-to-br from-bronze-500 to-bronze-700 flex items-center justify-center shadow-lg">
                <span className="font-display text-wood-950 font-bold text-xl">PP</span>
              </span>
              <div>
                <span className="font-display text-xl font-semibold text-cream-100">
                  Prikkelende Preken
                </span>
                <span className="block text-xs text-cream-400/60 tracking-widest uppercase">
                  Preek Archief
                </span>
              </div>
            </div>
            <p className="text-cream-300/80 text-sm leading-relaxed mb-6 max-w-sm">
              Ontdek inspirerende preken uit ons archief. 
              Luister, lees en laat je raken door Gods Woord in de stilte van dit digitale heiligdom.
            </p>
            {/* Decorative vinyl record */}
            <div className="hidden sm:flex items-center gap-4 opacity-60">
              <div className="vinyl-record w-12 h-12" />
              <span className="text-xs text-cream-500 italic font-body">
                "Het Woord dat blijft klinken..."
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="font-display text-bronze-400 mb-4 text-sm tracking-wide">
              Navigatie
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="link-70s text-sm text-cream-300 hover:text-bronze-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/sermons" className="link-70s text-sm text-cream-300 hover:text-bronze-400 transition-colors">
                  Alle Preken
                </Link>
              </li>
              <li>
                <Link href="/dominees" className="link-70s text-sm text-cream-300 hover:text-bronze-400 transition-colors">
                  Dominees
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <h3 className="font-display text-bronze-400 mb-4 text-sm tracking-wide">
              Blijf Op de Hoogte
            </h3>
            <p className="text-cream-300/70 text-sm mb-4 leading-relaxed">
              Ontvang een bericht bij nieuwe preken in het archief.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="je@email.nl"
                className="input-70s w-full text-sm"
              />
              <button
                type="submit"
                className="btn-70s-primary text-sm w-full"
              >
                Aanmelden
              </button>
            </form>
          </div>
        </div>

        {/* Elegant divider */}
        <div className="my-10">
          <div className="divider-ornament text-sm">✦</div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-cream-400/60">
            © {currentYear} Prikkelende Preken
          </p>
          <div className="flex items-center gap-2 text-cream-400/60">
            <span>Gemaakt met</span>
            <span className="text-bronze-500 animate-warm-pulse inline-block">♥</span>
            <span>voor Gods Woord</span>
          </div>
        </div>
      </div>

      {/* Bottom warm glow */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bronze-900/10 to-transparent pointer-events-none" />
    </footer>
  );
}
