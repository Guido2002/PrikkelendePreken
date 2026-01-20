'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FavoriteSermon } from '@/lib/favorites';
import { getFavorites, subscribeFavorites, toggleFavorite } from '@/lib/favorites';

type Props = {
  item: FavoriteSermon;
  className?: string;
};

export default function FavoriteButton({ item, className }: Readonly<Props>) {
  const [favorites, setFavorites] = useState<FavoriteSermon[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
    return subscribeFavorites(() => setFavorites(getFavorites()));
  }, []);

  const active = useMemo(() => favorites.some((f) => f.slug === item.slug), [favorites, item.slug]);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(item)}
      className={
        className ??
        `inline-flex items-center justify-center w-10 h-10 rounded-xl border transition-colors ${
          active
            ? 'bg-primary-50 border-primary-200 text-primary-700'
            : 'bg-white border-warm-200 text-warm-500 hover:text-primary-700 hover:border-primary-200 hover:bg-primary-50/40'
        }`
      }
      aria-pressed={active}
      aria-label={active ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
      title={active ? 'In favorieten' : 'Bewaar als favoriet'}
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.995 20.25s-7.245-4.397-9.338-8.343C1.17 9.032 2.02 6.44 4.23 5.26c1.68-.9 3.92-.57 5.29.86l2.475 2.575 2.475-2.575c1.37-1.43 3.61-1.76 5.29-.86 2.21 1.18 3.06 3.772 1.573 6.647-2.093 3.946-9.338 8.343-9.338 8.343z"
        />
      </svg>
    </button>
  );
}
