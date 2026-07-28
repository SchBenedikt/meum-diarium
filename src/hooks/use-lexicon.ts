import { useQuery } from '@tanstack/react-query';
import { fetchLexicon } from '@/lib/api';
import { lexicon as localLexicon } from '@/data/lexicon';
export function useLexicon() {
    const { data: lexicon, isLoading, error } = useQuery({
        queryKey: ['lexicon'],
        queryFn: async () => {
            const data = await fetchLexicon();
            const localIds = new Set(localLexicon.map(e => e.slug));
            if (data && data.length > 0) {
                const remoteIds = new Set(data.map((e: any) => e.slug));
                const missingLocals = localLexicon.filter(e => !remoteIds.has(e.slug));
                if (missingLocals.length > 0) {
                    return [...data, ...missingLocals];
                }
                return data;
            }
            return localLexicon;
        },
        retry: 2,
        staleTime: 5 * 60 * 1000,
    });
    return { lexicon: lexicon || [], isLoading, error };
}
