import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/types/blog';
import { useLanguage } from '@/context/LanguageContext';
import { fetchPosts } from '@/lib/api';
export function usePosts() {
  const { language } = useLanguage();
  const [translatedPosts, setTranslatedPosts] = useState<BlogPost[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const { data: posts, isLoading: isFetching, error } = useQuery<BlogPost[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const apiStartTime = Date.now();
      const apiPosts = await fetchPosts();
      const normalizedPosts = Array.isArray(apiPosts)
        ? apiPosts.map((post: any) => {
            // Normalize author field (API returns author_id or authorId)
            const authorId = post.author_id ?? post.authorId ?? post.author;
            return {
              ...post,
              author: authorId,
              authorId: authorId, // Ensure both fields are set
            };
          })
        : [];
      const apiFetchTime = Date.now() - apiStartTime;
      if (normalizedPosts.length > 0) {
        console.log(`✅ [usePosts] Loaded ${normalizedPosts.length} posts from D1 database (${apiFetchTime}ms)`);
        return normalizedPosts;
      }
      return [];
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  useEffect(() => {
    async function translateAll() {
      if (!posts) return;
      setIsTranslating(true);
      try {
        const translated = await Promise.all(
          posts.map(post => import('@/lib/translator').then(mod => mod.translatePostInPlace(post, language)))
        );
        setTranslatedPosts(translated);
      } catch (error) {
        console.error("Translation failed", error);
        // Fallback to original posts if translation fails
        setTranslatedPosts(posts);
      } finally {
        setIsTranslating(false);
      }
    }
    translateAll();
  }, [posts, language]);
  return { 
    posts: translatedPosts, 
    isLoading: isFetching || isTranslating,
    error 
  };
}
