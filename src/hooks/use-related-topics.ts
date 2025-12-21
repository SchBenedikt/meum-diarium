import { useMemo } from 'react';
import { usePosts } from './use-posts';
import { Author } from '@/types/blog';

interface RelatedTopic {
  title: string;
  slug: string;
  author: string;
  excerpt: string;
  category?: string;
}

// Mapping von Schlüsselwörtern zu Post-Slugs
const keywordMap: Record<string, string[]> = {
  // Kalender-bezogene Schlüsselwörter
  kalender: ['julianischer-kalender'],
  zeitrechnung: ['julianischer-kalender'],
  'julianisch': ['julianischer-kalender'],
  reform: ['julianischer-kalender'],
  
  // Weitere Mappings können hier hinzugefügt werden
  gallien: ['de-bello-gallico'],
  bürgerkrieg: ['de-bello-civili'],
  rubikon: ['de-bello-civili'],
};

export function useRelatedTopics(text: string, author?: Author, maxTopics: number = 3): RelatedTopic[] {
  const { posts } = usePosts();
  
  return useMemo(() => {
    if (!text || !posts) return [];
    
    const lowerText = text.toLowerCase();
    const foundSlugs = new Set<string>();
    
    // Finde alle relevanten Slugs basierend auf Schlüsselwörtern im Text
    Object.entries(keywordMap).forEach(([keyword, slugs]) => {
      if (lowerText.includes(keyword)) {
        slugs.forEach(slug => foundSlugs.add(slug));
      }
    });
    
    // Filtere Posts nach gefundenen Slugs
    const relatedPosts = posts
      .filter(post => {
        // Nur Posts vom gleichen Author (wenn angegeben)
        if (author && post.author !== author) return false;
        return foundSlugs.has(post.slug);
      })
      .slice(0, maxTopics)
      .map(post => ({
        title: post.title,
        slug: post.slug,
        author: post.author,
        excerpt: post.excerpt,
        category: post.tags?.[0],
      }));
    
    return relatedPosts;
  }, [text, posts, author, maxTopics]);
}
