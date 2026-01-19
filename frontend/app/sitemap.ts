import { MetadataRoute } from 'next';
import { getAllSermons, getSpeakers } from '@/lib/strapi';

// Required for static export
export const dynamic = 'force-static';

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
    {
      url: `${baseUrl}/dominees`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Dynamic sermon pages
  let sermonPages: MetadataRoute.Sitemap = [];
  
  try {
    const response = await getAllSermons();
    sermonPages = response.data.map((sermon) => ({
      url: `${baseUrl}/sermons/${sermon.slug}`,
      lastModified: new Date(sermon.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  // Dynamic dominee pages
  let speakerPages: MetadataRoute.Sitemap = [];

  try {
    const response = await getSpeakers();
    speakerPages = response.data.map((speaker) => ({
      url: `${baseUrl}/dominees/${speaker.slug}`,
      lastModified: new Date(speaker.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error generating speaker pages for sitemap:', error);
  }

  return [...staticPages, ...sermonPages, ...speakerPages];
}
