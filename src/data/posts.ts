// This file is kept for type exports only
// Actual posts are fetched from D1 database via usePosts hook
import { BlogPost } from '@/types/blog';
// This function is no longer used - posts come from D1 database
// Kept for backward compatibility during migration
export async function getAllPosts(): Promise<BlogPost[]> {
  console.warn('getAllPosts() called but posts should come from D1 database');
  return [];
}
