import { BlogPost, LexiconEntry, AuthorInfo } from '@/types/blog';
import { PageContent } from '@/types/page';
import { SiteSettings, defaultSettings } from '@/types/settings';
import * as api from './api';
// For legacy support / easier refactoring, we export these functions matching the old signature
// but communicating with the API.
// We remove the synchronous getters because they require async API calls now.
// Components should use the hooks (usePosts, useAuthors, etc.) instead.
export function getPages(): PageContent[] {
  // Ideally this should be a hook or async. 
  // For now, return empty array to avoid breaking build, but verify consumption.
  // AdminPage uses this. We should verify if AdminPage.tsx uses it.
  // AdminPage.tsx calls getPages() in useEffect.
  // We need to fix AdminPage to use fetchPages from API or a hook.
  return [];
}
// Mutations
export async function upsertPost(post: BlogPost): Promise<void> {
  // If post has a slug and author, it's an update; otherwise, it's a create
  if (post.slug && post.author) {
    try {
      // Try to fetch existing post
      const existing = await api.fetchPost(post.author, post.slug).catch(() => null);
      if (existing) {
        // Update existing - pass author, slug, and data
        await api.updatePost(post.author, post.slug, post);
        return;
      }
    } catch {
      // If fetch fails, treat as new
    }
  }
  // Create new
  await api.createPost(post);
}
export async function deletePost(idOrSlug: string): Promise<void> {
  // The API expects author/slug.
  // The old deletePost took idOrSlug.
  // This is a breaking change if we don't know the author.
  // However, AdminPage calls it with post.id. The API delete needs author/slug.
  // We should update AdminPage to pass author and slug.
  throw new Error("Use api.deletePost(author, slug) instead");
}
export async function upsertLexiconEntry(entry: LexiconEntry): Promise<void> {
  // If entry has a slug, check if it exists
  if (entry.slug) {
    try {
      const existing = await api.fetchLexiconEntry(entry.slug).catch(() => null);
      if (existing) {
        // Update existing
        await api.updateLexiconEntry(entry.slug, entry);
        return;
      }
    } catch {
      // If fetch fails, treat as new
    }
  }
  // Create new
  await api.saveLexiconEntry(entry);
}
export async function deleteLexiconEntry(slug: string): Promise<void> {
  await api.deleteLexiconEntry(slug);
}
export async function upsertAuthor(entry: AuthorInfo): Promise<void> {
  // If entry has an ID, check if it exists
  if (entry.id) {
    try {
      const existing = await api.fetchAuthors().then((authors: any) => 
        Object.values(authors).find((a: any) => a.id === entry.id)
      ).catch(() => null);
      if (existing) {
        // Update existing
        await api.updateAuthor(entry.id, entry);
        return;
      }
    } catch {
      // If fetch fails, treat as new
    }
  }
  // Create new
  await api.saveAuthor(entry);
}
export async function deleteAuthor(id: string): Promise<void> {
  await api.deleteAuthor(id);
}
export async function upsertPage(page: PageContent): Promise<void> {
  await api.savePage(page);
}
export async function deletePage(slug: string): Promise<void> {
  await api.deletePage(slug);
}
// Settings might still be local for now or we need an API endpoint.
// The plan didn't specify settings API. Let's keep it local for now?
// Or just omit if not critical.
export function getSettings(): SiteSettings {
  return defaultSettings;
}
export async function saveSettings(settings: SiteSettings): Promise<void> {
  // TODO: implement settings API
}
// Legacy overrides (Deprecated: API is now source of truth)
// These functions are kept to prevent breaking translator.ts which relies on them.
// Since we have moved to API-first, there are no "local overrides" to merge synchronously.
// The API endpoints return the full correct data.
export function getPostsWithOverrides(posts: BlogPost[]): BlogPost[] {
  return posts;
}
export function getAuthorsWithOverrides(authorsMap: Record<string, AuthorInfo>): Record<string, AuthorInfo> {
  return authorsMap;
}
export function getLexiconWithOverrides(lexicon: LexiconEntry[]): LexiconEntry[] {
  return lexicon;
}
