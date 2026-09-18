import { useQuery } from '@tanstack/react-query';
import { fetchLexicon } from '@/lib/api';
import { lexicon as localLexicon } from '@/data/lexicon';
export function useLexicon() {
    const { data: lexicon, isLoading, error } = useQuery({
        queryKey: ['lexicon'],
        queryFn: async () => {
            try {
                const data = await fetchLexicon();
                const remoteIds = new Set((data || []).map((e: any) => e.slug));
                const missingLocals = localLexicon.filter(e => !remoteIds.has(e.slug));
                if (data && data.length > 0) {
                    return [...data, ...missingLocals];
                }
                return localLexicon;
            } catch (err) {
                console.warn('Lexicon API failed, using local data:', err);
                return localLexicon;
            }
        },
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });
    return { lexicon: lexicon || [], isLoading, error };
}
