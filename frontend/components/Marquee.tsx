'use client';

import { useEffect, useRef, useState } from 'react';

export default function Marquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationDuration, setAnimationDuration] = useState(20);

  useEffect(() => {
    // Adjust animation duration based on content width
    if (containerRef.current) {
      const contentWidth = containerRef.current.scrollWidth / 2;
      const duration = Math.max(15, contentWidth / 50);
      setAnimationDuration(duration);
    }
  }, []);

  const messages = [
    { text: '★ WELKOM BIJ PRIKKELENDE PREKEN ★', color: 'text-accent-400' },
    { text: '📖 100+ Preken beschikbaar!', color: 'text-white' },
    { text: '🎧 Luister naar audio preken', color: 'text-primary-300' },
    { text: '✝️ Gods Woord voor iedereen', color: 'text-accent-400' },
    { text: '🔍 Zoek op spreker of thema', color: 'text-white' },
    { text: '★ NIEUW! Bijbelreferenties toegevoegd ★', color: 'text-primary-300' },
  ];

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        ref={containerRef}
        className="inline-block animate-marquee"
        style={{
          animation: `marquee ${animationDuration}s linear infinite`,
        }}
      >
        {/* Duplicate content for seamless loop */}
        {[...messages, ...messages].map((msg, index) => (
          <span key={index} className={`mx-8 font-bold ${msg.color}`}>
            {msg.text}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
