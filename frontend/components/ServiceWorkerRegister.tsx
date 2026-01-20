'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const repoName = process.env.NEXT_PUBLIC_REPO_NAME || 'PrikkelendePreken';
    const basePath = process.env.NODE_ENV === 'production' ? `/${repoName}` : '';
    const swUrl = `${basePath}/sw.js`;

    navigator.serviceWorker
      .register(swUrl)
      .then(() => {
        // no-op
      })
      .catch(() => {
        // no-op
      });
  }, []);

  return null;
}
