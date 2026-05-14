// Posts are served from static JSON files in public/posts/{author}/{slug}.json
// The index is available at public/posts/index.json
// Use the usePosts hook (src/hooks/use-posts.ts) or the fetchPosts API function
// (src/lib/api.ts) to retrieve posts in components.
import { BlogPost } from '@/types/blog';

// This function is kept for backward compatibility.
// Posts are now retrieved via /api/posts -> public/posts/ static files.
export async function getAllPosts(): Promise<BlogPost[]> {
  const res = await fetch('/posts/index.json');
  if (!res.ok) return [];
  const index = await res.json();
  return Array.isArray(index?.posts) ? index.posts : [];
}
