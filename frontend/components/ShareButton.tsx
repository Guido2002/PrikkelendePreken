'use client';

import { useEffect, useMemo, useState } from 'react';

function getBasePath(): string {
  const repoName = process.env.NEXT_PUBLIC_REPO_NAME || 'PrikkelendePreken';
  const isProd = process.env.NODE_ENV === 'production';
  return isProd ? `/${repoName}` : '';
}

function buildShareUrl(pathname: string): string {
  if (typeof window === 'undefined') return pathname;
  const origin = window.location.origin;
  const basePath = getBasePath();
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${origin}${basePath}${normalizedPath}`;
}

export default function ShareButton({
  title,
  pathname,
}: Readonly<{
  title: string;
  pathname?: string;
}>) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const path = pathname || window.location.pathname.replace(getBasePath(), '') || '/';
    return buildShareUrl(path);
  }, [pathname]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  const shareText = `${title}`;

  const canNativeShare = typeof navigator !== 'undefined' && typeof (navigator as any).share === 'function';

  const onShare = async () => {
    if (!url) return;

    if (canNativeShare) {
      try {
        await (navigator as any).share({ title, text: shareText, url });
        return;
      } catch {
        // fall back to menu
      }
    }

    setOpen(v => !v);
  };

  const onCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // older browsers
      try {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopied(true);
      } catch {
        // ignore
      }
    }
  };

  const encoded = encodeURIComponent(`${shareText}\n${url}`);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onShare}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-warm-200 rounded-xl text-sm font-medium text-warm-700 hover:border-primary-200 hover:bg-primary-50/40 hover:text-primary-700 transition-colors"
        title="Delen"
      >
        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.486 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 9.316a3 3 0 11-5.367 1.684m5.367-1.684a3 3 0 100-3.368m0 3.368l-6.632 3.316" />
        </svg>
        Delen
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-warm-200 rounded-xl shadow-xl overflow-hidden z-10">
          <button
            type="button"
            onClick={onCopy}
            className="w-full text-left px-4 py-3 text-sm text-warm-800 hover:bg-warm-50 transition-colors"
          >
            {copied ? 'Link gekopieerd' : 'Kopieer link'}
          </button>
          <a
            href={`https://wa.me/?text=${encoded}`}
            target="_blank"
            rel="noreferrer"
            className="block px-4 py-3 text-sm text-warm-800 hover:bg-warm-50 transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${encoded}`}
            className="block px-4 py-3 text-sm text-warm-800 hover:bg-warm-50 transition-colors"
          >
            E-mail
          </a>
          <a
            href={`https://x.com/intent/tweet?text=${encoded}`}
            target="_blank"
            rel="noreferrer"
            className="block px-4 py-3 text-sm text-warm-800 hover:bg-warm-50 transition-colors"
          >
            X (Twitter)
          </a>
        </div>
      )}
    </div>
  );
}
