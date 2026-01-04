import { TagWithTranslations } from '@/types/blog';
import { Language } from '@/types/blog';

/**
 * Gets the translated tag name based on the current language
 * @param tag - The tag with translations
 * @param language - The current language (de, en, la)
 * @returns The translated tag name
 */
export function getTranslatedTag(tag: TagWithTranslations, language: Language): string {
    const baseLang = language.split('-')[0] as 'de' | 'en' | 'la';
    return tag.translations[baseLang] || tag.translations.de;
}

/**
 * Gets all translated tags for a post based on the current language
 * Handles both legacy string tags and new multilingual tags
 * @param post - The blog post with tags
 * @param language - The current language
 * @returns Array of translated tag names
 */
export function getPostTags(
    post: { tags: string[]; tagsWithTranslations?: TagWithTranslations[] },
    language: Language
): string[] {
    // Prefer multilingual tags if available
    if (post.tagsWithTranslations && post.tagsWithTranslations.length > 0) {
        return post.tagsWithTranslations.map(tag => getTranslatedTag(tag, language));
    }
    
    // Fall back to legacy tags
    return post.tags || [];
}

/**
 * Converts legacy tags to multilingual format
 * @param legacyTags - Array of legacy tag strings
 * @returns Array of multilingual tags
 */
export function migrateLegacyTags(legacyTags: string[]): TagWithTranslations[] {
    return legacyTags.map(tag => ({
        id: tag.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'),
        translations: {
            de: tag,
            en: tag,
            la: tag
        }
    }));
}

/**
 * Merges legacy and multilingual tags, preferring multilingual ones
 * @param legacyTags - Legacy string tags
 * @param multilingualTags - New multilingual tags
 * @returns Combined array of tag names
 */
export function mergeTags(
    legacyTags: string[],
    multilingualTags: TagWithTranslations[] | undefined,
    language: Language
): string[] {
    if (multilingualTags && multilingualTags.length > 0) {
        return multilingualTags.map(tag => getTranslatedTag(tag, language));
    }
    return legacyTags || [];
}
