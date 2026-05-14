import { useQuery } from '@tanstack/react-query';
import { fetchLexicon } from '@/lib/api';
export function useLexicon() {
    const { data: lexicon, isLoading, error } = useQuery({
        queryKey: ['lexicon'],
        queryFn: async () => {
            const data = await fetchLexicon();
            if (data && data.length > 0) {
                return data;
            }
            return [];
        },
        retry: 2,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
    return { lexicon: lexicon || [], isLoading, error };
}
