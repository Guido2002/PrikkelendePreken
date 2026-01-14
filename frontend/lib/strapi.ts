import { Sermon, Speaker, Theme, StrapiResponse } from './types';

// Strapi Cloud URL from environment
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Generic fetch wrapper for Strapi REST API
 * All fetches use force-cache for static generation
 */
async function fetchAPI<T>(endpoint: string): Promise<T> {
  const url = `${STRAPI_URL}/api${endpoint}`;
  
  // Build headers - include auth token if available
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (API_TOKEN) {
    headers['Authorization'] = `Bearer ${API_TOKEN}`;
  }
  
  try {
    const res = await fetch(url, {
      headers,
      // Force cache for static build
      cache: 'force-cache',
    });

    if (!res.ok) {
      console.error(`Strapi API error: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch ${endpoint}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

/**
 * Get all sermons with pagination
 */
export async function getSermons(params?: {
  page?: number;
  pageSize?: number;
  speakerSlug?: string;
  themeSlug?: string;
}): Promise<StrapiResponse<Sermon[]>> {
  const { page = 1, pageSize = 12, speakerSlug, themeSlug } = params || {};
  
  const queryParams = new URLSearchParams({
    'populate': '*',
    'sort': 'date:desc',
    'pagination[page]': page.toString(),
    'pagination[pageSize]': pageSize.toString(),
  });

  if (speakerSlug) {
    queryParams.append('filters[speaker][slug][$eq]', speakerSlug);
  }

  if (themeSlug) {
    queryParams.append('filters[themes][slug][$eq]', themeSlug);
  }

  return fetchAPI<StrapiResponse<Sermon[]>>(`/sermons?${queryParams}`);
}

/**
 * Get all sermons (no pagination) for static generation
 */
export async function getAllSermons(): Promise<StrapiResponse<Sermon[]>> {
  const queryParams = new URLSearchParams({
    'populate': '*',
    'sort': 'date:desc',
    'pagination[pageSize]': '1000', // Get all for static build
  });

  return fetchAPI<StrapiResponse<Sermon[]>>(`/sermons?${queryParams}`);
}

/**
 * Get latest sermons for homepage
 */
export async function getLatestSermons(limit = 6): Promise<StrapiResponse<Sermon[]>> {
  const queryParams = new URLSearchParams({
    'populate': '*',
    'sort': 'date:desc',
    'pagination[pageSize]': limit.toString(),
  });

  return fetchAPI<StrapiResponse<Sermon[]>>(`/sermons?${queryParams}`);
}

/**
 * Get a single sermon by slug
 */
export async function getSermonBySlug(slug: string): Promise<Sermon | null> {
  const queryParams = new URLSearchParams({
    'filters[slug][$eq]': slug,
    'populate': '*',
  });

  const response = await fetchAPI<StrapiResponse<Sermon[]>>(`/sermons?${queryParams}`);
  return response.data[0] || null;
}

/**
 * Get all sermon slugs for generateStaticParams
 */
export async function getAllSermonSlugs(): Promise<string[]> {
  const queryParams = new URLSearchParams({
    'fields[0]': 'slug',
    'pagination[pageSize]': '1000',
  });

  const response = await fetchAPI<StrapiResponse<Sermon[]>>(`/sermons?${queryParams}`);
  return response.data.map((sermon) => sermon.slug);
}

/**
 * Get all speakers
 */
export async function getSpeakers(): Promise<StrapiResponse<Speaker[]>> {
  return fetchAPI<StrapiResponse<Speaker[]>>('/speakers?sort=name:asc');
}

/**
 * Get a single speaker by slug
 */
export async function getSpeakerBySlug(slug: string): Promise<Speaker | null> {
  const queryParams = new URLSearchParams({
    'filters[slug][$eq]': slug,
  });

  const response = await fetchAPI<StrapiResponse<Speaker[]>>(`/speakers?${queryParams}`);
  return response.data[0] || null;
}

/**
 * Get all speaker slugs for generateStaticParams
 */
export async function getAllSpeakerSlugs(): Promise<string[]> {
  const queryParams = new URLSearchParams({
    'fields[0]': 'slug',
    'pagination[pageSize]': '100',
  });

  const response = await fetchAPI<StrapiResponse<Speaker[]>>(`/speakers?${queryParams}`);
  return response.data.map((speaker) => speaker.slug);
}

/**
 * Get all themes
 */
export async function getThemes(): Promise<StrapiResponse<Theme[]>> {
  return fetchAPI<StrapiResponse<Theme[]>>('/themes?sort=name:asc');
}

/**
 * Get full URL for Strapi media files
 * Handles both absolute URLs (Strapi Cloud) and relative URLs (local)
 */
export function getStrapiMediaUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) {
    return url;
  }
  return `${STRAPI_URL}${url}`;
}

/**
 * Format date for display (Dutch locale)
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get total number of pages for pagination
 */
export async function getSermonPageCount(pageSize = 12): Promise<number> {
  const response = await getSermons({ page: 1, pageSize });
  return response.meta.pagination?.pageCount || 1;
}
