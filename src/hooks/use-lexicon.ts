import { useQuery } from '@tanstack/react-query';
import { fetchLexicon } from '@/lib/api';
import { lexicon as staticLexicon } from '@/data/lexicon';

export function useLexicon() {
    const { data: lexicon, isLoading } = useQuery({
        queryKey: ['lexicon'],
        queryFn: async () => {
            console.log('🔄 [useLexicon] Fetching lexicon entries...');
            
            try {
                const startTime = Date.now();
                const data = await fetchLexicon();
                const fetchTime = Date.now() - startTime;
                
                if (data && data.length > 0) {
                    console.log(`✅ [useLexicon] Loaded ${data.length} entries from D1 database (${fetchTime}ms)`);
                    console.log('   Data source: Cloudflare D1 via API');
                    return data;
                } else {
                    console.warn('⚠️ [useLexicon] API returned empty result, falling back to static content');
                }
            } catch (e) {
                console.error('❌ [useLexicon] API fetch failed:', e);
                console.warn('   Falling back to static file content');
            }
            
            console.log('📁 [useLexicon] Loading lexicon from static files...');
            console.log(`✅ [useLexicon] Loaded ${staticLexicon.length} entries from files`);
            console.log('   Data source: TypeScript files in src/data/lexicon.ts');
            
            return staticLexicon;
        },
    });

    return { lexicon: lexicon || staticLexicon, isLoading };
}
