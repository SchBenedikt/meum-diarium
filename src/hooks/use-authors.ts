import { useQuery } from '@tanstack/react-query';
import { fetchAuthors } from '@/lib/api';

export function useAuthors() {
    const { data: authors, isLoading, error } = useQuery({
        queryKey: ['authors'],
        queryFn: async () => {
            console.log('🔄 [useAuthors] Fetching authors from D1 database...');
            const data = await fetchAuthors();
            if (data && Object.keys(data).length > 0) {
                console.log(`✅ [useAuthors] Loaded ${Object.keys(data).length} authors from D1`);
                return data;
            }
            console.warn('⚠️ [useAuthors] D1 database returned empty result');
            return {};
        },
        retry: 2,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return { authors: authors || {}, isLoading, error };
}
