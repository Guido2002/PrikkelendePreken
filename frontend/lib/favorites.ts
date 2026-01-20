export type FavoriteSermon = {
  slug: string;
  title: string;
  date?: string;
  speakerName?: string;
  bibleText?: string | null;
};

const STORAGE_KEY = 'pp:favorites:v1';
const CHANGE_EVENT = 'pp:favorites-changed';

function readRaw(): FavoriteSermon[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is FavoriteSermon => {
      return (
        typeof x === 'object' &&
        x !== null &&
        typeof (x as FavoriteSermon).slug === 'string' &&
        typeof (x as FavoriteSermon).title === 'string'
      );
    });
  } catch {
    return [];
  }
}

function writeRaw(favs: FavoriteSermon[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getFavorites(): FavoriteSermon[] {
  return readRaw();
}

export function isFavorite(slug: string): boolean {
  return readRaw().some((f) => f.slug === slug);
}

export function toggleFavorite(item: FavoriteSermon): FavoriteSermon[] {
  const favs = readRaw();
  const exists = favs.some((f) => f.slug === item.slug);
  const next = exists ? favs.filter((f) => f.slug !== item.slug) : [item, ...favs];
  writeRaw(next);
  return next;
}

export function clearFavorites() {
  writeRaw([]);
}

export function subscribeFavorites(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const onChange = () => callback();
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };

  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}
