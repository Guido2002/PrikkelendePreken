'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { getStrapiMediaUrl } from '@/lib/strapi';

interface AudioPlayerProps {
  url: string;
  title: string;
}

export default function AudioPlayer({ url, title }: Readonly<AudioPlayerProps>) {
  const fullUrl = getStrapiMediaUrl(url);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLButtonElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // "Loading" here means: not enough info/buffer to start/continue smoothly.
  // We flip it off once metadata is available so users can press play sooner on mobile.
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Format time in mm:ss
  const formatTime = (time: number) => {
    if (Number.isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // play() can reject on some browsers; keep UI consistent.
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Handle seeking
  const handleSeek = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const handleSeekKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!audioRef.current) return;
    if (!duration) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Toggle play from the progress bar for keyboard users.
      togglePlay();
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      skip(-10);
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      skip(10);
    }
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
  };

  // Change playback rate
  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 1.75, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  // Setup audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleLoadedMetadata = () => setIsLoading(false);
    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => {
      // Waiting fires during playback when buffer runs dry; show spinner then.
      if (!audio.paused) {
        setIsLoading(true);
      }
    };
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          skip(-10);
          break;
        case 'ArrowRight':
          skip(10);
          break;
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, currentTime, duration]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  let playButtonIcon: React.ReactNode;
  if (isLoading) {
    playButtonIcon = (
      <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    );
  } else if (isPlaying) {
    playButtonIcon = (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
      </svg>
    );
  } else {
    playButtonIcon = (
      <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    );
  }

  return (
    <div className="bg-gradient-to-br from-warm-900 via-primary-900 to-warm-900 rounded-2xl p-4 sm:p-6 shadow-xl">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        preload="metadata"
        aria-label={`Audio: ${title}`}
      >
        <source src={fullUrl} type="audio/mpeg" />
        <source src={fullUrl} type="audio/ogg" />
        <track kind="captions" />
      </audio>

      {/* Player header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/50">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">{title}</p>
          <p className="text-primary-300 text-sm">Luister naar de preek</p>
        </div>
        {/* Playback rate button */}
        <button
          onClick={cyclePlaybackRate}
          className="self-start sm:self-auto px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
          title="Afspeelsnelheid aanpassen"
        >
          {playbackRate}x
        </button>
      </div>

      {/* Progress bar */}
      <button
        type="button"
        ref={progressRef}
        onClick={handleSeek}
        onKeyDown={handleSeekKeyDown}
        className="relative h-2 bg-white/20 rounded-full cursor-pointer group mb-4"
        aria-label="Spring naar een ander tijdstip"
      >
        {/* Buffered indicator would go here */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
        {/* Scrubber handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 8px)` }}
        />
      </button>

      {/* Time display */}
      <div className="flex items-center justify-between text-sm text-primary-200 mb-5">
        <span className="font-mono">{formatTime(currentTime)}</span>
        <span className="font-mono">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        {/* Skip back */}
        <button
          onClick={() => skip(-10)}
          className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          title="10 seconden terug"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          disabled={!url}
          className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 hover:from-primary-400 hover:to-primary-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary-900/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
          aria-label={isPlaying ? 'Pauzeren' : 'Afspelen'}
        >
          {playButtonIcon}
        </button>

        {/* Skip forward */}
        <button
          onClick={() => skip(10)}
          className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          title="10 seconden vooruit"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
          </svg>
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="hidden md:flex mt-5 pt-4 border-t border-white/10 items-center justify-center gap-4 text-xs text-white/40">
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Space</kbd>
          <span>Afspelen/Pauzeren</span>
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded">← →</kbd>
          <span>±10s</span>
        </span>
      </div>
    </div>
  );
}
