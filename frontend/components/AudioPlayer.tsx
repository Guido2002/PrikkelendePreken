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
      // play() can reject on some browsers; keep UI consistent.
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

  const effectiveDurationForUi = getEffectiveDuration();
  const progress = effectiveDurationForUi > 0 ? (currentTime / effectiveDurationForUi) * 100 : 0;

  let playButtonIcon: React.ReactNode;
  if (isLoading) {
    playButtonIcon = <span className="animate-spin text-xl">⏳</span>;
  } else if (isPlaying) {
    playButtonIcon = <span className="text-2xl">⏸</span>;
  } else {
    playButtonIcon = <span className="text-2xl ml-0.5">▶</span>;
  }

  return (
    <div className="window-90s">
      {/* Title bar */}
      <div className="window-90s-titlebar flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span>🎵</span>
          <span className="truncate">mediaplayer.exe - {title}</span>
        </span>
        <div className="flex gap-1">
          <span className="w-4 h-4 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center">_</span>
          <span className="w-4 h-4 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center">□</span>
          <span className="w-4 h-4 bevel-outset bg-warm-200 text-warm-950 text-xs flex items-center justify-center">×</span>
        </div>
      </div>
      
      {/* Content area */}
      <div className="window-90s-content">
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
        <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-warm-200">
          <div className="w-10 h-10 bevel-outset bg-primary-600 flex items-center justify-center">
            <span className="text-white text-lg">🎧</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-warm-950 truncate text-sm">{title}</p>
            <p className="text-warm-600 text-xs">Luister naar de preek</p>
          </div>
          {/* Playback rate button */}
          <button
            onClick={cyclePlaybackRate}
            className="btn-90s text-xs px-2 py-1"
            title="Afspeelsnelheid aanpassen"
          >
            {playbackRate}x
          </button>
        </div>

        {/* Progress bar - 90s style */}
        <div className="mb-3">
          <button
            type="button"
            ref={progressRef}
            onClick={handleSeek}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={handleSeekKeyDown}
            className="relative w-full h-5 bevel-inset bg-warm-950 cursor-pointer touch-none"
            aria-label="Spring naar een ander tijdstip"
            role="slider"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={currentTime}
            aria-valuetext={`${formatTime(currentTime)} van ${formatTime(duration)}`}
          >
            {/* Progress fill - 90s green LED style */}
            <div
              className="absolute inset-y-0 left-0 bg-green-500"
              style={{ 
                width: `${progress}%`,
                boxShadow: 'inset 0 1px 0 #00ff00, inset 0 -1px 0 #006600'
              }}
            />
            {/* Scrubber handle */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-3 h-6 bevel-outset bg-warm-200 ${
                isScrubbing ? 'bg-warm-100' : ''
              }`}
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </button>
        </div>

        {/* Time display - LED style */}
        <div className="flex items-center justify-between mb-4">
          <div className="bevel-inset bg-black px-2 py-1">
            <span className="hit-counter text-sm">{formatTime(currentTime)}</span>
          </div>
          <div className="bevel-inset bg-black px-2 py-1">
            <span className="hit-counter text-sm">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls - 90s button style */}
        <div className="flex items-center justify-center gap-2">
          {/* Skip back */}
          <button
            onClick={() => skip(-10)}
            className="btn-90s px-3 py-2"
            title="10 seconden terug"
          >
            ⏪ -10s
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            disabled={!url}
            className="btn-90s-primary px-4 py-2 min-w-[80px] disabled:opacity-50"
            aria-label={isPlaying ? 'Pauzeren' : 'Afspelen'}
          >
            {playButtonIcon}
          </button>

          {/* Skip forward */}
          <button
            onClick={() => skip(10)}
            className="btn-90s px-3 py-2"
            title="10 seconden vooruit"
          >
            +10s ⏩
          </button>
        </div>

        {/* Keyboard hints - 90s style */}
        <div className="hidden md:flex mt-4 pt-3 border-t-2 border-warm-200 items-center justify-center gap-4 text-xs text-warm-600">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bevel-outset bg-warm-100 font-mono">Space</kbd>
            <span>Afspelen</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bevel-outset bg-warm-100 font-mono">← →</kbd>
            <span>±10s</span>
          </span>
        </div>
      </div>
    </div>
  );
}
