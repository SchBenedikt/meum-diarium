import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Work } from '@/types/blog';
/**
 * Hook to load works from static JSON (public/api/works.json)
 * Falls back to local data if API fails
 */
export function useWorks() {
  const { data: works, isLoading: isFetching, error } = useQuery<Work[]>({
    queryKey: ['works'],
    queryFn: async () => {
      try {
        const apiStartTime = Date.now();
        const response = await fetch('/api/works.json');
        if (!response.ok) {
          return [];
        }
        const works = await response.json();
        const apiFetchTime = Date.now() - apiStartTime;
        console.log(`✅ [useWorks] Loaded ${works.length} works (${apiFetchTime}ms)`);
        return Array.isArray(works) ? works : [];
      } catch (error) {
        console.error('❌ [useWorks] Error loading works:', error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - static data doesn't change often
  });
  return { 
    works: works || [], 
    isLoading: isFetching,
    error
  };
}
/**
 * Hook to load work details from static JSON (public/api/works-details/{slug}.json)
 * Transforms language-organized data into the expected component structure
 */
export function useWorkDetails(slug: string | undefined) {
  const [details, setDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    if (!slug) {
      setDetails(null);
      return;
    }
    const loadDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiStartTime = Date.now();
        const response = await fetch(`/api/works-details/${slug}.json`);
        if (!response.ok) {
          setDetails(null);
          setIsLoading(false);
          return;
        }
        const rawData = await response.json();
        const apiFetchTime = Date.now() - apiStartTime;
        // Transform language-organized data into component structure
        // If data has language keys (de, en, etc.), use the default language (de)
        const langData = rawData.de || rawData;
        const transformedDetails = {
          context: langData.contextTitle ? {
            title: langData.contextTitle,
            paragraphs: langData.contextParagraphs || [],
            timeline: langData.contextTimeline || []
          } : null,
          bookChapters: langData.bookChapters || [],
          sections: langData.sections || [],
          literaryFeatures: langData.literaryFeatures || [],
          keyMoments: langData.keyMoments || [],
          quotes: langData.quotes || [],
          impact: langData.impact ? {
            title: langData.impact.title || 'Wirkung und Erbe',
            paragraphs: langData.impact.paragraphs || [],
            highlights: langData.impact.highlights || []
          } : null
        };
        console.log(`✅ [useWorkDetails] Loaded details for "${slug}" (${apiFetchTime}ms)`);
        setDetails(transformedDetails);
      } catch (err) {
        console.error(`❌ [useWorkDetails] Error loading details for "${slug}":`, err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setDetails(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [slug]);
  return { 
    details, 
    isLoading,
    error
  };
}
