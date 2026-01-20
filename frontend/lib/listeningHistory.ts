export type ListeningEntry = {
  slug: string;
  title: string;
  speakerName?: string;
  date?: string;
  bibleText?: string | null;
  positionSec: number;
  durationSec: number;
  updatedAt: number; // epoch ms
};

const STORAGE_KEY = 'pp:listening-history:v1';
const CHANGE_EVENT = 'pp:listening-history-changed';

function safeParse(raw: string | null): ListeningEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is ListeningEntry => {
      if (typeof x !== 'object' || x === null) return false;
      const entry = x as ListeningEntry;
      return (
        typeof entry.slug === 'string' &&
        typeof entry.title === 'string' &&
        typeof entry.positionSec === 'number' &&
        typeof entry.durationSec === 'number' &&
        typeof entry.updatedAt === 'number'
      );
    });
  } catch {
    return [];
  }
}

function readRaw(): ListeningEntry[] {
  if (typeof window === 'undefined') return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

function writeRaw(entries: ListeningEntry[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getListeningHistory(): ListeningEntry[] {
  return readRaw().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getListeningEntry(slug: string): ListeningEntry | undefined {
  return readRaw().find((e) => e.slug === slug);
}

export function clearListeningEntry(slug: string) {
  const next = readRaw().filter((e) => e.slug !== slug);
  writeRaw(next);
}

export function clearListeningHistory() {
  writeRaw([]);
}

export function upsertListeningEntry(
  partial: Omit<ListeningEntry, 'updatedAt'> & { updatedAt?: number },
): ListeningEntry[] {
  const now = partial.updatedAt ?? Date.now();
  const entries = readRaw();
  const idx = entries.findIndex((e) => e.slug === partial.slug);
  const nextEntry: ListeningEntry = {
    ...entries[idx],
    ...partial,
    updatedAt: now,
  } as ListeningEntry;

  const next = idx >= 0 ? [...entries.slice(0, idx), nextEntry, ...entries.slice(idx + 1)] : [nextEntry, ...entries];
  // cap list size to avoid unbounded growth
  writeRaw(next.slice(0, 200));
  return next;
}

export function subscribeListeningHistory(callback: () => void): () => void {
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

export function computeProgressPercent(entry: ListeningEntry): number {
  if (!entry.durationSec || entry.durationSec <= 0) return 0;
  return Math.max(0, Math.min(100, (entry.positionSec / entry.durationSec) * 100));
}

export function shouldShowContinue(entry: ListeningEntry): boolean {
  // Hide if essentially finished
  if (!entry.durationSec || entry.durationSec <= 0) return false;
  const ratio = entry.positionSec / entry.durationSec;
  return ratio > 0.01 && ratio < 0.98;
}
