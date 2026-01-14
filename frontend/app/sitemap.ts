import { MetadataRoute } from 'next';
import { getAllSermons } from '@/lib/strapi';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourusername.github.io';
const repoName = process.env.NEXT_PUBLIC_REPO_NAME || 'PrikkelendePreken';
const baseUrl = `${siteUrl}/${repoName}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/sermons`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Dynamic sermon pages
  let sermonPages: MetadataRoute.Sitemap = [];
  
  try {
    const response = await getAllSermons();
    sermonPages = response.data.map((sermon) => ({
      url: `${baseUrl}/sermons/${sermon.attributes.slug}`,
      lastModified: new Date(sermon.attributes.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return [...staticPages, ...sermonPages];
}
