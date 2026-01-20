import React from 'react';

export default function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-warm-200/70 ${className}`} />;
}
