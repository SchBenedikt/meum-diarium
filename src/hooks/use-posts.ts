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
      console.log('🔄 [usePosts] Fetching posts...');
      
      try {
        const apiStartTime = Date.now();
        const apiPosts = await fetchPosts();
        const apiFetchTime = Date.now() - apiStartTime;
        
        if (apiPosts && apiPosts.length > 0) {
          console.log(`✅ [usePosts] Loaded ${apiPosts.length} posts from D1 database (${apiFetchTime}ms)`);
          console.log('   Data source: Cloudflare D1 via API');
          return apiPosts;
        } else {
          console.warn('⚠️ [usePosts] API returned empty result, falling back to static files');
        }
      } catch (e) {
        console.error('❌ [usePosts] API fetch failed:', e);
        console.warn('   Falling back to static file content');
      }
      
      console.log('📁 [usePosts] Loading posts from static files...');
      const fileStartTime = Date.now();
      const filePosts = await getAllPosts();
      const fileLoadTime = Date.now() - fileStartTime;
      console.log(`✅ [usePosts] Loaded ${filePosts.length} posts from files (${fileLoadTime}ms)`);
      console.log('   Data source: TypeScript files in src/content/posts/');
      
      return filePosts;
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
