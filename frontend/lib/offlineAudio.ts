const AUDIO_CACHE = 'pp-audio-v1';

export async function isAudioCached(url: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!('caches' in window)) return false;

  try {
    const cache = await caches.open(AUDIO_CACHE);
    // Use a Request to align with how SW caches cross-origin (opaque) requests.
    const req = new Request(url, { mode: 'no-cors' });
    const match = await cache.match(req, { ignoreSearch: false });
    return Boolean(match);
  } catch {
    return false;
  }
}

export function canUseOfflineAudio(): boolean {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator && 'caches' in window;
}

function postToServiceWorker(message: unknown) {
  if (typeof window === 'undefined') return;
  const controller = navigator.serviceWorker?.controller;
  if (controller) {
    controller.postMessage(message);
  } else {
    // If controller isn't ready yet (first load after registration),
    // try to send it to the active worker.
    navigator.serviceWorker?.ready
      .then((reg) => {
        reg.active?.postMessage(message);
      })
      .catch(() => {
        // ignore
      });
  }
}

export async function cacheAudio(url: string): Promise<void> {
  if (!canUseOfflineAudio()) throw new Error('Offline audio not supported');
  postToServiceWorker({ type: 'CACHE_AUDIO', url });
}

export async function uncacheAudio(url: string): Promise<void> {
  if (!canUseOfflineAudio()) throw new Error('Offline audio not supported');
  postToServiceWorker({ type: 'UNCACHE_AUDIO', url });
}
