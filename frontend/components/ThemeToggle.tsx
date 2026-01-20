'use client';

import { useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

function readStoredTheme(): Theme | null {
  try {
    const raw = localStorage.getItem('theme');
    return raw === 'dark' || raw === 'light' ? raw : null;
  } catch {
    return null;
  }
}

function storeTheme(theme: Theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // ignore
  }
}

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const initial = readStoredTheme() ?? getSystemTheme();
    setTheme(initial);
    applyTheme(initial);

    const mql = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mql) return;

    const onChange = () => {
      // Only follow system if user hasn't explicitly chosen.
      if (readStoredTheme() !== null) return;
      const next = getSystemTheme();
      setTheme(next);
      applyTheme(next);
    };

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }

    // Safari fallback
    (mql as unknown as { addListener: (cb: () => void) => void }).addListener(onChange);
    return () => (mql as unknown as { removeListener: (cb: () => void) => void }).removeListener(onChange);
  }, []);

  const nextTheme = useMemo<Theme>(() => (theme === 'dark' ? 'light' : 'dark'), [theme]);

  const label = theme === 'dark' ? 'Schakel naar lichte modus' : 'Schakel naar donkere modus';

  return (
    <button
      type="button"
      className={
        `inline-flex items-center justify-center h-10 w-10 rounded-xl border transition-all btn-press ` +
        `border-warm-200/60 bg-warm-50 text-warm-600 hover:bg-warm-100 hover:text-primary-700 ` +
        `dark:border-warm-800/70 dark:bg-warm-900/40 dark:text-warm-200 dark:hover:bg-warm-800/60 ` +
        className
      }
      aria-label={label}
      title={label}
      onClick={() => {
        const current = theme ?? (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
        applyTheme(next);
        storeTheme(next);
      }}
    >
      {/* Moon (for light -> dark) / Sun (for dark -> light) */}
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0-1.414-1.414M7.05 7.05 5.636 5.636"
          />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
          />
        </svg>
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}
