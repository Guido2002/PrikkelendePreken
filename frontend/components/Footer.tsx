import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-warm-900 text-warm-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                PP
              </span>
              <span className="text-lg font-bold text-white">
                Prikkelende Preken
              </span>
            </div>
            <p className="text-warm-400 text-sm leading-relaxed">
              Ontdek inspirerende preken uit ons archief. 
              Luister, lees en laat je raken door Gods Woord.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigatie</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-warm-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/sermons" className="text-warm-400 hover:text-white transition-colors text-sm">
                  Alle Preken
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <p className="text-warm-400 text-sm">
              Vragen of suggesties? Neem gerust contact met ons op.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-warm-800">
          <p className="text-center text-warm-500 text-sm">
            © {new Date().getFullYear()} Prikkelende Preken. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}
