'use strict';

async function apiBibleFetch(path, { apiKey, baseUrl, query } = {}) {
  const url = new URL(path, baseUrl);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      'api-key': apiKey,
      'accept': 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    const err = new Error(`API.Bible error: ${res.status} ${res.statusText}`);
    err.details = body;
    throw err;
  }

  return res.json();
}

function normalizeApiBibleBaseUrl(input) {
  const raw = (input || '').toString().trim();
  const fallback = 'https://api.scripture.api.bible/v1/';
  if (!raw) return fallback;

  // Ensure trailing slash
  let url = raw.endsWith('/') ? raw : `${raw}/`;

  // If user points at the host root (e.g. https://rest.api.bible), append v1/
  // If user points at .../v1, normalize to .../v1/
  if (url.endsWith('/v1/')) return url;
  if (url.endsWith('/v1')) return `${url}/`;

  // If it already contains /v1/ somewhere later, keep as-is.
  if (url.includes('/v1/')) return url;

  return `${url}v1/`;
}

module.exports = ({ strapi }) => ({
  async fetchChapter({ bibleId, chapterId }) {
    const apiKey = process.env.API_BIBLE_KEY;
    const baseUrl = normalizeApiBibleBaseUrl(process.env.API_BIBLE_BASE_URL);

    if (!apiKey) {
      const err = new Error('API_BIBLE_KEY is not configured');
      err.status = 500;
      throw err;
    }

    if (!bibleId || !chapterId) {
      const err = new Error('Missing bibleId or chapterId');
      err.status = 400;
      throw err;
    }

    const data = await apiBibleFetch(`bibles/${encodeURIComponent(bibleId)}/chapters/${encodeURIComponent(chapterId)}`, {
      apiKey,
      baseUrl,
      query: {
        // Keep it calm and readable; preserve verse numbers.
        'content-type': 'text',
        'include-verse-numbers': 'true',
        'include-chapter-numbers': 'false',
        'include-titles': 'false',
        'include-notes': 'false',
        'include-verse-spans': 'false',
      },
    });

    // Shape we return to the frontend.
    const chapter = data?.data || null;
    return {
      id: chapter?.id || chapterId,
      reference: chapter?.reference || null,
      content: chapter?.content || '',
      copyright: chapter?.copyright || data?.meta?.copyright || null,
    };
  },
});
