import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/types/blog';
import { getAllPosts } from '@/data/posts';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedPosts } from '@/lib/post-translator';
import { fetchPosts } from '@/lib/api';

export function usePosts() {
  const { language } = useLanguage();
  const [translatedPosts, setTranslatedPosts] = useState<BlogPost[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);

  const { data: posts, isLoading: isFetching } = useQuery<BlogPost[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const apiPosts = await fetchPosts();
        if (apiPosts && apiPosts.length > 0) return apiPosts;
      } catch (e) {
        console.warn('API fetch failed, falling back to static content', e);
      }
      return await getAllPosts();
    },
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

  return { posts: translatedPosts, isLoading: isFetching || isTranslating };
}
