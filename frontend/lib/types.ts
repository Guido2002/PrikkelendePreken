// TypeScript types for Strapi v5 API responses
// Note: Strapi v5 returns flat objects without the "attributes" wrapper

export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  url: string;
  mime: string;
  size: number;
  formats?: {
    thumbnail?: { url: string };
  };
}

export interface Speaker {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Theme {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sermon {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  date: string;
  bibleText: string | null;
  audio: StrapiMedia | null;
  speaker: Speaker | null;
  themes: Theme[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
