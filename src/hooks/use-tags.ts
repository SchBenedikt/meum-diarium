
import { useQuery } from '@tanstack/react-query';
import { fetchTags } from '@/lib/api';

export function useTags() {
    const {
        data: tags = [],
        isLoading,
        error,
        refetch
    } = useQuery<string[]>({
        queryKey: ['tags'],
        queryFn: fetchTags,
    });

    return {
        tags,
        isLoading,
        error,
        refetch
    };
}
