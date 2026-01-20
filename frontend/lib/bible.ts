import { BibleReference } from '@/lib/types';

export type BibleTranslation = 'SV' | 'HSV';

export function formatReference(ref: BibleReference | null, fallback?: string | null): string | null {
  if (ref) {
    const verseStart = ref.verseStart;
    const verseEnd = ref.verseEnd;

    let result = `${ref.book} ${ref.chapter}`;
    if (verseStart) {
      result += `:${verseStart}`;
      if (verseEnd && verseEnd !== verseStart) {
        result += `-${verseEnd}`;
      }
    }
    return result;
  }

  return fallback?.trim() ? fallback.trim() : null;
}

export function getBibleLinkTemplate(translation: BibleTranslation): string | null {
  // User-configurable templates; avoids hardcoding or scraping third-party sites.
  // Example: https://example.com/read?ref={ref}&tr=SV
  const key = translation === 'SV'
    ? 'NEXT_PUBLIC_BIBLE_SV_URL_TEMPLATE'
    : 'NEXT_PUBLIC_BIBLE_HSV_URL_TEMPLATE';

  const t = (process.env as any)[key] as string | undefined;
  return t?.trim() ? t.trim() : null;
}

export function buildBibleLink(refText: string, translation: BibleTranslation): string | null {
  const template = getBibleLinkTemplate(translation);
  if (!template) return null;
  return template.replaceAll('{ref}', encodeURIComponent(refText));
}

export function getBibleApiBaseUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_BIBLE_TEXT_API_URL;
  return url?.trim() ? url.trim() : null;
}

export async function fetchBiblePassage(params: {
  refText: string;
  translation: BibleTranslation;
  signal?: AbortSignal;
}): Promise<{ text: string } | null> {
  const api = getBibleApiBaseUrl();
  if (!api) return null;

  const url = new URL(api);
  url.searchParams.set('ref', params.refText);
  url.searchParams.set('translation', params.translation);

  const res = await fetch(url.toString(), { signal: params.signal });
  if (!res.ok) return null;

  const data = (await res.json()) as any;
  if (!data || typeof data.text !== 'string') return null;

  return { text: data.text };
}
