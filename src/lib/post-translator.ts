import { BlogPost, BlogPostTranslations, Language } from '@/types/blog';

/**
 * Gibt die übersetzten Inhalte eines Blog-Posts für die gewählte Sprache zurück
 */
export function getTranslatedPost(post: BlogPost, language: Language): BlogPost {
  const baseLang = language.split('-')[0] as 'de' | 'en' | 'la';
  
  // Wenn keine Übersetzungen vorhanden sind oder die Sprache Deutsch ist, gib den Original-Post zurück
  if (!post.translations || baseLang === 'de') {
    return post;
  }
  
  const translation = post.translations[baseLang];
  
  // Wenn keine Übersetzung für diese Sprache existiert, gib den Original-Post zurück
  if (!translation) {
    return post;
  }
  
  // Erstelle einen neuen Post mit übersetzten Inhalten
  return {
    ...post,
    title: translation.title,
    excerpt: translation.excerpt,
    content: translation.content,
    tags: translation.tags || post.tags,
  };
}

/**
 * Übersetzt ein Array von Posts
 */
export function getTranslatedPosts(posts: BlogPost[], language: Language): BlogPost[] {
  return posts.map(post => getTranslatedPost(post, language));
}

/**
 * Hilfsfunktion zum Erstellen von Übersetzungen für einen Post
 */
export function createPostTranslations(
  de: BlogPostTranslations,
  en: BlogPostTranslations,
  la: BlogPostTranslations
) {
  return { de, en, la };
}
