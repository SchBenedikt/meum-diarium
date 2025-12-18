import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/types/blog';
import { getAllPosts } from '@/data/posts';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedPosts } from '@/lib/post-translator';
import { fetchPosts } from '@/lib/api';

export function usePosts() {
  const { language } = useLanguage();

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
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

  // Übersetze die Posts basierend auf der aktuellen Sprache (memoisiert, um Referenz-Stabilität zu gewährleisten)
  const translatedPosts = useMemo(() => {
    return posts ? getTranslatedPosts(posts, language) : [];
  }, [posts, language]);

  return { posts: translatedPosts, isLoading };
}
