import { Language, Author, BlogPost, LexiconEntry, Work, AuthorInfo, TimelineEvent } from '@/types/blog';
import { authors } from '@/data/authors';
import { lexicon } from '@/data/lexicon';
import { works } from '@/data/works';
import { timelineEvents } from '@/data/timeline';
import { getAllPosts } from '@/data/posts';

// Simple in-memory cache to avoid re-translating the same text within a session.
const translationCache = new Map<string, string>();

async function translateText(text: string, to: Language): Promise<string> {
    if (to.startsWith('de') || !text) return text;

    const cacheKey = `${to}:${text}`;
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey)!;
    }

    if (to.startsWith('en')) {
        try {
            const res = await fetch("https://libretranslate.com/translate", {
                method: "POST",
                body: JSON.stringify({
                    q: text,
                    source: "de",
                    target: "en",
                    format: "text",
                }),
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
                console.error("Translation API error:", res.statusText);
                return `[Translation Error] ${text}`;
            }

            const data = await res.json();
            const translated = data.translatedText;
            
            translationCache.set(cacheKey, translated);
            return translated;
        } catch (error) {
            console.error("Failed to fetch translation:", error);
            return `[Network Error] ${text}`;
        }
    }
    
    if (to === 'la') {
        return `[LA] ${text}`;
    }
    return text;
}

async function translateArray(arr: string[], to: Language): Promise<string[]> {
    return Promise.all(arr.map(item => translateText(item, to)));
}

export async function getTranslatedPost(lang: Language, authorId: Author, slug: string): Promise<BlogPost | null> {
    const allPosts = await getAllPosts();
    const post = allPosts.find(p => p.author === authorId && p.slug === slug);
    if (!post) return null;
    if (lang.startsWith('de')) return post;

    return {
        ...post,
        title: await translateText(post.title, lang),
        excerpt: await translateText(post.excerpt, lang),
        tags: await translateArray(post.tags, lang),
        content: {
            diary: await translateText(post.content.diary, lang),
            scientific: await translateText(post.content.scientific, lang),
        },
    };
}

export async function getTranslatedLexicon(lang: Language): Promise<LexiconEntry[]> {
    if (lang.startsWith('de')) return lexicon;
    return Promise.all(
        lexicon.map(async (entry) => ({
            ...entry,
            definition: await translateText(entry.definition, lang),
            category: await translateText(entry.category, lang),
        }))
    );
}

export async function getTranslatedLexiconEntry(lang: Language, slug: string): Promise<LexiconEntry | null> {
    const entry = lexicon.find(e => e.slug === slug);
    if (!entry) return null;
    if (lang.startsWith('de')) return entry;
    
    return {
        ...entry,
        definition: await translateText(entry.definition, lang),
        category: await translateText(entry.category, lang),
        etymology: entry.etymology ? await translateText(entry.etymology, lang) : undefined,
    }
}


export async function getTranslatedAuthor(lang: Language, authorId: Author): Promise<AuthorInfo | null> {
    const author = authors[authorId];
    if (!author) return null;
    if (lang.startsWith('de')) return author;

    return {
        ...author,
        name: await translateText(author.name, lang),
        title: await translateText(author.title, lang),
        description: await translateText(author.description, lang),
    };
}

export async function getTranslatedAuthors(lang: Language): Promise<Record<string, AuthorInfo>> {
    if (lang.startsWith('de')) return authors;

    const translated: Record<string, AuthorInfo> = {};
    for (const key in authors) {
        const author = authors[key];
        translated[key] = {
            ...author,
            name: await translateText(author.name, lang),
            title: await translateText(author.title, lang),
            description: await translateText(author.description, lang),
        };
    }
    return translated;
}


export async function getTranslatedWork(lang: Language, slug: string): Promise<Work | null> {
    const work = works[slug];
    if (!work) return null;
    if (lang.startsWith('de')) return work;

    return {
        ...work,
        summary: await translateText(work.summary, lang),
        takeaway: await translateText(work.takeaway, lang),
        structure: await Promise.all(work.structure.map(async (part) => ({
            title: await translateText(part.title, lang),
            content: await translateText(part.content, lang),
        }))),
    };
}


export async function getTranslatedTimeline(lang: Language): Promise<TimelineEvent[]> {
    if (lang.startsWith('de')) return timelineEvents;

    return Promise.all(
        timelineEvents.map(async (event) => ({
            ...event,
            title: await translateText(event.title, lang),
            description: await translateText(event.description, lang),
        }))
    );
}
