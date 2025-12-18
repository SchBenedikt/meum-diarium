import { useQuery } from '@tanstack/react-query';
import { fetchLexicon } from '@/lib/api';
import { lexicon as staticLexicon } from '@/data/lexicon';

export function useLexicon() {
    const { data: lexicon, isLoading } = useQuery({
        queryKey: ['lexicon'],
        queryFn: async () => {
            try {
                const data = await fetchLexicon();
                if (data && data.length > 0) return data;
            } catch (e) {
                console.warn('API fetch failed, falling back to static content');
            }
            return staticLexicon;
        },
    });

    return { lexicon: lexicon || staticLexicon, isLoading };
}
