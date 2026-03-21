import { useQuery } from '@tanstack/react-query';
import { fetchAuthors } from '@/lib/api';
import { authors as fallbackAuthors } from '@/data/authors';

export function useAuthors() {
    const { data: authorsData, isLoading, error } = useQuery({
        queryKey: ['authors'],
        queryFn: async () => {
            // Start with complete fallback data so all authors are always available
            const authorsMap: Record<string, any> = {};
            // Deep-clone fallback data to avoid mutation
            Object.keys(fallbackAuthors).forEach(key => {
                authorsMap[key] = structuredClone(fallbackAuthors[key as keyof typeof fallbackAuthors]);
            });

            try {
                const data = await fetchAuthors();
                // Convert array response to object keyed by ID
                if (Array.isArray(data)) {
                    data.forEach((author: any) => {
                        if (author.id) {
                            const fallback = authorsMap[author.id] || {};
                            // DB data takes priority, but preserve fallback fields missing from DB
                            authorsMap[author.id] = {
                                ...fallback,
                                ...author,
                                // Preserve rich fallback data when DB doesn't provide it
                                highlights: author.highlights ?? fallback.highlights,
                                translations: author.translations ?? fallback.translations,
                            };
                        }
                    });
                    if (data.length > 0) {
                        console.log(`✅ [useAuthors] Loaded ${data.length} authors from D1`);
                    }
                } else if (data && typeof data === 'object') {
                    Object.keys(data).forEach(key => {
                        const fallback = authorsMap[key] || {};
                        authorsMap[key] = {
                            ...fallback,
                            ...data[key],
                            highlights: data[key].highlights ?? fallback.highlights,
                            translations: data[key].translations ?? fallback.translations,
                        };
                    });
                    console.log(`✅ [useAuthors] Loaded ${Object.keys(data).length} authors from D1`);
                }
            } catch (err) {
                console.warn('⚠️ [useAuthors] Could not fetch authors from DB, using fallback data:', err);
            }

            return authorsMap;
        },
        retry: 2,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
    // Always return at least the fallback data while loading
    return { authors: authorsData || fallbackAuthors, isLoading, error };
}
