'use client';

import { getStrapiMediaUrl } from '@/lib/strapi';

interface AudioPlayerProps {
  url: string;
  title: string;
}

export default function AudioPlayer({ url, title }: AudioPlayerProps) {
  // Get absolute URL for Strapi Cloud media
  const fullUrl = getStrapiMediaUrl(url);

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <p className="text-sm text-gray-600 mb-2">🎧 Luister naar de preek:</p>
      <audio
        controls
        className="w-full"
        preload="metadata"
        aria-label={`Audio: ${title}`}
      >
        <source src={fullUrl} type="audio/mpeg" />
        <source src={fullUrl} type="audio/ogg" />
        Je browser ondersteunt geen audio-element.
      </audio>
    </div>
  );
}
