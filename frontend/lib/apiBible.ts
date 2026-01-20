export interface ApiBibleChapterResponse {
  id: string;
  reference: string | null;
  content: string;
  copyright: string | null;
}

function getStrapiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
}

export async function fetchChapter(params: {
  bibleId: string;
  chapterId: string;
  signal?: AbortSignal;
}): Promise<ApiBibleChapterResponse> {
  const base = getStrapiBaseUrl();
  const url = new URL('/api/bible/chapter', base);
  url.searchParams.set('bibleId', params.bibleId);
  url.searchParams.set('chapterId', params.chapterId);

  const res = await fetch(url.toString(), {
    signal: params.signal,
    cache: 'no-store',
  });

  const data = (await res.json().catch(() => null)) as any;

  if (!res.ok) {
    const message = data?.error || `Failed to fetch chapter (${res.status})`;
    throw new Error(message);
  }

  return data as ApiBibleChapterResponse;
}
