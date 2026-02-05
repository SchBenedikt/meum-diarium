import { useQuery } from '@tanstack/react-query';
import { fetchLexicon } from '@/lib/api';
export function useLexicon() {
    const { data: lexicon, isLoading, error } = useQuery({
        queryKey: ['lexicon'],
        queryFn: async () => {
            const startTime = Date.now();
            const data = await fetchLexicon();
            const fetchTime = Date.now() - startTime;
            if (data && data.length > 0) {
                console.log(`✅ [useLexicon] Loaded ${data.length} entries from D1 database (${fetchTime}ms)`);
                return data;
            }
            return [];
        },
        retry: 2,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
    return { lexicon: lexicon || [], isLoading, error };
}
