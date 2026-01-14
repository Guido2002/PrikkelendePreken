import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourusername.github.io';
const repoName = process.env.NEXT_PUBLIC_REPO_NAME || 'PrikkelendePreken';
const baseUrl = `${siteUrl}/${repoName}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
