import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-primary-600">
            Prikkerende Preken
          </Link>
          <ul className="flex gap-6">
            <li>
              <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/sermons" className="text-gray-600 hover:text-primary-600 transition-colors">
                Preken
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
