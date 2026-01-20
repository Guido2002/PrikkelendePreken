function stripSlashes(value: string): string {
  return value.replace(/^\/+/, '').replace(/\/+$/, '');
}

export function getSiteBaseUrl(): string {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://yourusername.github.io').replace(/\/+$/, '');
  const repoName = stripSlashes(process.env.NEXT_PUBLIC_REPO_NAME || 'PrikkelendePreken');
  return `${siteUrl}/${repoName}`;
}

export function absoluteUrl(pathname: string): string {
  const base = getSiteBaseUrl().replace(/\/+$/, '');
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${base}${p}`;
}
