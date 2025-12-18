import { useQuery } from '@tanstack/react-query';
import { fetchPages } from '@/lib/api';
// getPages from cms-store is now deprecated/empty, so we rely on API or empty array fallback

export function usePages() {
    const { data: pages, isLoading } = useQuery({
        queryKey: ['pages'],
        queryFn: async () => {
            try {
                const data = await fetchPages();
                if (data && data.length > 0) return data;
            } catch (e) {
                console.warn('API fetch failed, falling back to empty list');
            }
            return [];
        },
    });

    return { pages: pages || [], isLoading };
}
