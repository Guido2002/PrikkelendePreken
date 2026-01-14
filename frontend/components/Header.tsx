import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-warm-200/50 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center gap-2"
          >
            <span className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:shadow-md transition-shadow">
              PP
            </span>
            <span className="text-lg font-bold text-warm-900 group-hover:text-primary-700 transition-colors hidden sm:block">
              Prikkerende Preken
            </span>
          </Link>

          {/* Navigation */}
          <ul className="flex items-center gap-1">
            <li>
              <Link 
                href="/" 
                className="px-4 py-2 text-warm-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg font-medium transition-all"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/sermons" 
                className="px-4 py-2 text-warm-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg font-medium transition-all"
              >
                Preken
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
