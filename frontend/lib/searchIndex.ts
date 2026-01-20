import { SearchDocument } from './search';
import { Sermon } from './types';
import { formatBibleReference } from './strapi';

// Strip HTML tags from content
function stripHtml(html: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Convert Sermon to SearchDocument
export function sermonToSearchDocument(sermon: Sermon): SearchDocument {
  const date = new Date(sermon.date);
  const contentText = stripHtml(sermon.content);
  
  // Use structured bibleReference if available, otherwise fall back to bibleText
  const displayBibleText = formatBibleReference(sermon.bibleReference) || sermon.bibleText;
  
  // Build searchable text from all fields
  const searchableText = [
    sermon.title,
    displayBibleText,
    sermon.summary,
    contentText,
    sermon.speaker?.name,
    ...(sermon.themes?.map(t => t.name) || []),
  ].filter(Boolean).join(' ');

  return {
    id: sermon.id,
    slug: sermon.slug,
    title: sermon.title,
    summary: sermon.summary,
    content: contentText,
    bibleText: displayBibleText,
    date: sermon.date,
    hasAudio: Boolean(sermon.audio?.url),
    speakerName: sermon.speaker?.name || null,
    speakerId: sermon.speaker?.id || null,
    themes: sermon.themes?.map(t => ({ id: t.id, name: t.name })) || [],
    searchableText,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

// Build search index from sermons
export function buildSearchIndex(sermons: Sermon[]): SearchDocument[] {
  return sermons.map(sermonToSearchDocument);
}
