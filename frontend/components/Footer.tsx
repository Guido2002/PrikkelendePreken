'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-warm-950 mt-auto">
      {/* Decorative top border - 90s style */}
      <div className="h-2 bg-construction" />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Main footer window */}
        <div className="window-90s">
          <div className="window-90s-titlebar flex items-center justify-between">
            <span>📧 footer.exe</span>
            <div className="flex gap-1">
              <span className="w-4 h-4 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center font-bold">_</span>
              <span className="w-4 h-4 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center font-bold">□</span>
              <span className="w-4 h-4 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center font-bold">×</span>
            </div>
          </div>
          <div className="window-90s-content">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Brand */}
              <div className="md:col-span-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-10 h-10 bevel-outset bg-primary-600 flex items-center justify-center text-white font-bold">
                    PP
                  </span>
                  <span className="text-lg font-bold text-warm-950">
                    Prikkelende Preken
                  </span>
                </div>
                <p className="text-warm-700 text-sm mb-4">
                  Ontdek inspirerende preken uit ons archief. 
                  Luister, lees en laat je raken door Gods Woord.
                </p>
                {/* Hit counter */}
                <div className="bevel-inset bg-black p-2 inline-block">
                  <div className="hit-counter px-3 py-1 text-sm">
                    👁️ Bezoekers: <span className="font-bold">001,337</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="md:col-span-3">
                <h3 className="font-bold text-warm-950 mb-3 uppercase text-sm border-b-2 border-warm-300 pb-1">
                  📁 Navigatie
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/" className="link-90s text-sm flex items-center gap-1">
                      ▶ Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/sermons" className="link-90s text-sm flex items-center gap-1">
                      ▶ Alle Preken
                    </Link>
                  </li>
                  <li>
                    <Link href="/dominees" className="link-90s text-sm flex items-center gap-1">
                      ▶ Dominees
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div className="md:col-span-4">
                <h3 className="font-bold text-warm-950 mb-3 uppercase text-sm border-b-2 border-warm-300 pb-1">
                  📬 Nieuwsbrief
                </h3>
                <p className="text-warm-700 text-sm mb-3">
                  Ontvang een notificatie bij nieuwe preken.
                </p>
                <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="je@email.nl"
                    className="input-90s w-full text-sm"
                  />
                  <button
                    type="submit"
                    className="btn-90s-primary text-xs w-full"
                  >
                    📧 Aanmelden
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-4 bevel-inset bg-warm-100 p-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
            <p className="text-warm-700">
              © {currentYear} Prikkelende Preken. Alle rechten voorbehouden.
            </p>
            <div className="flex items-center gap-1 text-warm-600">
              <span>Gemaakt met</span>
              <span className="text-primary-600 animate-pulse">❤</span>
              <span>voor Gods Woord</span>
            </div>
          </div>
        </div>

        {/* 90s decorative elements */}
        <div className="flex justify-center mt-4 gap-2">
          <div className="bevel-outset bg-warm-200 px-2 py-1 text-xs font-mono">
            🌐 Best viewed with Netscape Navigator 4.0
          </div>
        </div>

        {/* Decorative color bar */}
        <div className="flex justify-center mt-4">
          <div className="flex">
            <div className="w-8 h-2 bg-red-600" />
            <div className="w-8 h-2 bg-orange-500" />
            <div className="w-8 h-2 bg-yellow-400" />
            <div className="w-8 h-2 bg-green-500" />
            <div className="w-8 h-2 bg-blue-600" />
            <div className="w-8 h-2 bg-purple-600" />
          </div>
        </div>
      </div>
    </footer>
  );
}
