/* Service Worker for PrikkelendePreken
 * - Cache-first for audio so downloaded sermons play offline
 * - Supports messages to cache/uncache audio URLs
 */

const AUDIO_CACHE = 'pp-audio-v1';

function isAudioRequest(request) {
  try {
    if (request.destination === 'audio') return true;
    const url = new URL(request.url);
    return /\.(mp3|m4a|aac|ogg|wav)(\?|$)/i.test(url.pathname);
  } catch {
    return false;
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;
  if (!isAudioRequest(request)) return;

  event.respondWith((async () => {
    const cache = await caches.open(AUDIO_CACHE);
    const cached = await cache.match(request, { ignoreSearch: false });
    if (cached) return cached;

    try {
      const response = await fetch(request);
      // Cache successful responses, and also opaque (cross-origin no-cors) responses.
      if (response && (response.ok || response.type === 'opaque')) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (err) {
      // Offline + not cached => fail as normal.
      throw err;
    }
  })());
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  const { type, url } = data;

  if (type === 'CACHE_AUDIO' && typeof url === 'string') {
    event.waitUntil((async () => {
      const cache = await caches.open(AUDIO_CACHE);
      const request = new Request(url, { mode: 'no-cors' });
      const existing = await cache.match(request, { ignoreSearch: false });
      if (existing) return;
      const response = await fetch(request);
      if (response && (response.ok || response.type === 'opaque')) {
        await cache.put(request, response);
      }
    })());
    return;
  }

  if (type === 'UNCACHE_AUDIO' && typeof url === 'string') {
    event.waitUntil((async () => {
      const cache = await caches.open(AUDIO_CACHE);
      const request = new Request(url, { mode: 'no-cors' });
      await cache.delete(request, { ignoreSearch: false });
    })());
    return;
  }

  if (type === 'CLEAR_AUDIO_CACHE') {
    event.waitUntil(caches.delete(AUDIO_CACHE));
  }
});
