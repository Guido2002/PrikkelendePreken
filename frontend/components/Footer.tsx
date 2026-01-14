export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} Prikkerende Preken. Alle rechten voorbehouden.
        </p>
      </div>
    </footer>
  );
}
