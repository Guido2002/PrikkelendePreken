// TypeScript types for Strapi API responses

export interface StrapiMedia {
  id: number;
  attributes: {
    name: string;
    url: string;
    mime: string;
    size: number;
    formats?: {
      thumbnail?: { url: string };
    };
  };
}

export interface Speaker {
  id: number;
  attributes: {
    name: string;
    slug: string;
    bio: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Theme {
  id: number;
  attributes: {
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Sermon {
  id: number;
  attributes: {
    title: string;
    slug: string;
    summary: string | null;
    content: string | null;
    date: string;
    bibleText: string | null;
    audio: {
      data: StrapiMedia | null;
    };
    speaker: {
      data: Speaker | null;
    };
    themes: {
      data: Theme[];
    };
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
  };
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
