import { useQuery } from '@tanstack/react-query';
import { fetchAuthors } from '@/lib/api';
export function useAuthors() {
    const { data: authorsData, isLoading, error } = useQuery({
        queryKey: ['authors'],
        queryFn: async () => {
            const data = await fetchAuthors();
            // Convert array response to object keyed by ID
            const authorsMap: Record<string, any> = {};
            if (Array.isArray(data)) {
                data.forEach(author => {
                    authorsMap[author.id] = author;
                });
                if (data.length > 0) {
                }
            } else if (data && typeof data === 'object') {
                Object.assign(authorsMap, data);
                console.log(`✅ [useAuthors] Loaded ${Object.keys(authorsMap).length} authors from D1`);
            }
            if (Object.keys(authorsMap).length === 0) {
            }
            return authorsMap;
        },
        retry: 2,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
    return { authors: authorsData || {}, isLoading, error };
}
