import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BlogPost } from '@/types/blog';
import { getAllPosts } from '@/data/posts';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedPosts } from '@/lib/post-translator';

export function usePosts() {
  const { language } = useLanguage();
  
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['posts'],
    queryFn: getAllPosts,
  });

  // Übersetze die Posts basierend auf der aktuellen Sprache (memoisiert, um Referenz-Stabilität zu gewährleisten)
  const translatedPosts = useMemo(() => {
    return posts ? getTranslatedPosts(posts, language) : [];
  }, [posts, language]);

  return { posts: translatedPosts, isLoading };
}
