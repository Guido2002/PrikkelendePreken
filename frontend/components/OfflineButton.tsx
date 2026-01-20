'use client';

import { useEffect, useState } from 'react';
import { cacheAudio, canUseOfflineAudio, isAudioCached, uncacheAudio } from '@/lib/offlineAudio';

export default function OfflineButton({ url }: { url: string }) {
  const [supported, setSupported] = useState(false);
  const [cached, setCached] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSupported(canUseOfflineAudio());
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      if (!url) return;
      const ok = await isAudioCached(url);
      if (!cancelled) setCached(ok);
    }

    refresh();

    const onOnline = () => refresh();
    window.addEventListener('online', onOnline);
    return () => {
      cancelled = true;
      window.removeEventListener('online', onOnline);
    };
  }, [url]);

  if (!supported || !url) return null;

  const onToggle = async () => {
    setBusy(true);
    try {
      if (cached) {
        await uncacheAudio(url);
      } else {
        await cacheAudio(url);
      }

      // Give the SW a moment to complete the work, then re-check.
      setTimeout(async () => {
        const ok = await isAudioCached(url);
        setCached(ok);
        setBusy(false);
      }, 400);
    } catch {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={busy}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
        cached
          ? 'bg-emerald-500/15 text-emerald-100 border-emerald-400/30 hover:bg-emerald-500/20'
          : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
      } ${busy ? 'opacity-70 cursor-wait' : ''}`}
      title={cached ? 'Verwijder offline audio' : 'Bewaar audio offline'}
    >
      {cached ? 'Offline opgeslagen' : 'Offline bewaren'}
    </button>
  );
}
