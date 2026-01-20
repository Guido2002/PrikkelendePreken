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
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isScrubbing, setIsScrubbing] = useState(false);

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
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const getEffectiveDuration = () => {
    const d = audioRef.current?.duration;
    if (typeof d === 'number' && Number.isFinite(d) && d > 0) return d;
    return duration;
  };

  const seekToClientX = (clientX: number) => {
    if (!audioRef.current || !progressRef.current) return;
    const effectiveDuration = getEffectiveDuration();
    if (!effectiveDuration || Number.isNaN(effectiveDuration)) return;

    const rect = progressRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const percent = (clientX - rect.left) / rect.width;
    const clampedPercent = Math.max(0, Math.min(1, percent));

    audioRef.current.currentTime = clampedPercent * effectiveDuration;
  };

  // Handle seeking
  const handleSeek = (e: React.MouseEvent<HTMLButtonElement>) => {
    seekToClientX(e.clientX);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsScrubbing(true);
    progressRef.current?.setPointerCapture(e.pointerId);
    seekToClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isScrubbing) return;
    e.preventDefault();
    seekToClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsScrubbing(false);
    try {
      progressRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // no-op
    }
  };

  const handleSeekKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!audioRef.current) return;
    const effectiveDuration = getEffectiveDuration();
    if (!effectiveDuration) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
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
      return;
    }

    if (e.key === 'Home') {
      e.preventDefault();
      audioRef.current.currentTime = 0;
      return;
    }

    if (e.key === 'End') {
      e.preventDefault();
      audioRef.current.currentTime = effectiveDuration;
      return;
    }
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    const effectiveDuration = getEffectiveDuration();
    const baseTime = audioRef.current.currentTime;
    audioRef.current.currentTime = Math.max(0, Math.min(effectiveDuration || baseTime, baseTime + seconds));
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
    const handleLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
    };
    const handleCanPlay = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
    };
    const handleWaiting = () => {
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

  const effectiveDurationForUi = getEffectiveDuration();
  const progress = effectiveDurationForUi > 0 ? (currentTime / effectiveDurationForUi) * 100 : 0;

  return (
    <div className="audio-player-70s p-6">
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
      <div className="flex items-center gap-4 mb-6">
        {/* Vinyl/disc icon */}
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-wood-800 to-wood-950 flex items-center justify-center shadow-lg ${isPlaying ? 'animate-vinyl-spin' : ''}`}>
          <div className="w-5 h-5 rounded-full bg-bronze-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-cream-100 truncate">{title}</p>
          <p className="text-cream-400/60 text-sm">Luister naar de preek</p>
        </div>
        {/* Playback rate button */}
        <button
          onClick={cyclePlaybackRate}
          className="px-3 py-1.5 text-sm text-cream-300 hover:text-bronze-400 border border-bronze-700/30 rounded hover:border-bronze-600/50 transition-all"
          title="Afspeelsnelheid aanpassen"
        >
          {playbackRate}×
        </button>
      </div>

      {/* Progress bar - warm amber glow */}
      <div className="mb-4">
        <button
          type="button"
          ref={progressRef}
          onClick={handleSeek}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleSeekKeyDown}
          className="relative w-full h-2 bg-wood-900 rounded-full cursor-pointer touch-none overflow-hidden"
          aria-label="Spring naar een ander tijdstip"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={duration || 0}
          aria-valuenow={currentTime}
          aria-valuetext={`${formatTime(currentTime)} van ${formatTime(duration)}`}
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-bronze-900/20 via-bronze-700/10 to-bronze-900/20" />
          
          {/* Progress fill - warm amber */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-bronze-600 to-bronze-400 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          
          {/* Scrubber handle */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-cream-100 to-cream-300 rounded-full shadow-lg transition-transform ${
              isScrubbing ? 'scale-125' : 'scale-100'
            }`}
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        </button>
      </div>

      {/* Time display */}
      <div className="flex items-center justify-between mb-6 text-sm font-mono text-cream-400/70">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Skip back */}
        <button
          onClick={() => skip(-10)}
          className="p-3 text-cream-300 hover:text-bronze-400 transition-colors"
          title="10 seconden terug"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z" />
          </svg>
          <span className="sr-only">10 seconden terug</span>
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          disabled={!url}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-bronze-500 to-bronze-700 text-wood-950 flex items-center justify-center shadow-lg hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isPlaying ? 'Pauzeren' : 'Afspelen'}
        >
          {isLoading ? (
            <svg className="w-7 h-7 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isPlaying ? (
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Skip forward */}
        <button
          onClick={() => skip(10)}
          className="p-3 text-cream-300 hover:text-bronze-400 transition-colors"
          title="10 seconden vooruit"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
          </svg>
          <span className="sr-only">10 seconden vooruit</span>
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="hidden md:flex mt-6 pt-4 border-t border-bronze-800/30 items-center justify-center gap-6 text-xs text-cream-500/50">
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-wood-900 border border-bronze-800/30 rounded text-cream-400">Space</kbd>
          <span>Afspelen</span>
        </span>
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-wood-900 border border-bronze-800/30 rounded text-cream-400">← →</kbd>
          <span>±10s</span>
        </span>
      </div>
    </div>
  );
}
