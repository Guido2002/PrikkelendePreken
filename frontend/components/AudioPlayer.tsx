'use client';

import { getStrapiMediaUrl } from '@/lib/strapi';

interface AudioPlayerProps {
  url: string;
  title: string;
}

export default function AudioPlayer({ url, title }: AudioPlayerProps) {
  const fullUrl = getStrapiMediaUrl(url);

  return (
    <div className="bg-gradient-to-r from-primary-50 to-warm-100 rounded-2xl p-6 border border-primary-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/25">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12h.01M12 12h.01M15 12h.01" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-warm-900">Luister naar de preek</p>
          <p className="text-xs text-warm-500">Audio beschikbaar</p>
        </div>
      </div>
      <audio
        controls
        className="w-full h-12 rounded-lg"
        preload="metadata"
        aria-label={`Audio: ${title}`}
        style={{
          filter: 'sepia(20%) saturate(70%) grayscale(1) contrast(99%) invert(12%)',
        }}
      >
        <source src={fullUrl} type="audio/mpeg" />
        <source src={fullUrl} type="audio/ogg" />
        <track kind="captions" />
        Je browser ondersteunt geen audio-element.
      </audio>
    </div>
  );
}
