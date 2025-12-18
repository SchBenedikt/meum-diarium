import { useQuery } from '@tanstack/react-query';
import { fetchAuthors } from '@/lib/api';
import { authors as staticAuthors } from '@/data/authors';

export function useAuthors() {
    const { data: authors, isLoading } = useQuery({
        queryKey: ['authors'],
        queryFn: async () => {
            try {
                const data = await fetchAuthors();
                if (data && Object.keys(data).length > 0) return data;
            } catch (e) {
                console.warn('API fetch failed, falling back to static content');
            }
            return staticAuthors;
        },
    });

    return { authors: authors || staticAuthors, isLoading };
}
