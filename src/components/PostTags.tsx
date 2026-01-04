import { Badge } from '@/components/ui/badge';
import { Hash } from 'lucide-react';
import { TagWithTranslations, Language } from '@/types/blog';
import { getTranslatedTag } from '@/lib/tag-utils';
import { useLanguage } from '@/context/LanguageContext';

interface PostTagsProps {
    tags: string[]; // Legacy tags
    tagsWithTranslations?: TagWithTranslations[]; // New multilingual tags
    className?: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

/**
 * Component to display post tags with multilingual support
 * Automatically shows tags in the user's current language
 */
export function PostTags({ 
    tags, 
    tagsWithTranslations, 
    className = '',
    variant = 'secondary' 
}: PostTagsProps) {
    const { language } = useLanguage();

    // Use multilingual tags if available, otherwise fall back to legacy tags
    const displayTags = tagsWithTranslations && tagsWithTranslations.length > 0
        ? tagsWithTranslations.map(tag => getTranslatedTag(tag, language as Language))
        : tags;

    if (!displayTags || displayTags.length === 0) {
        return null;
    }

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {displayTags.map((tag, index) => (
                <Badge 
                    key={`${tag}-${index}`} 
                    variant={variant}
                    className="gap-1.5 px-2.5 py-1"
                >
                    <Hash className="h-3 w-3" />
                    {tag}
                </Badge>
            ))}
        </div>
    );
}
