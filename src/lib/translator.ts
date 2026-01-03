import { Language, Author, BlogPost, LexiconEntry, Work, AuthorInfo, TimelineEvent } from '@/types/blog';
import { authors } from '@/data/authors';
import { lexicon as baseLexicon } from '@/data/lexicon';
import { works } from '@/data/works';
import { timelineEvents } from '@/data/timeline';
import { getAllPosts } from '@/data/posts';
import { getPostsWithOverrides } from '@/lib/cms-store';
import { getTranslatedPost as getManuallyTranslatedPost } from '@/lib/post-translator';
import {
    getTranslatedTimelineEvents as getManuallyTranslatedTimelineEvents,
    getTranslatedLexiconEntries as getManuallyTranslatedLexiconEntries,
    getTranslatedLexiconEntry as getManuallyTranslatedLexiconEntry,
    getTranslatedWork as getManuallyTranslatedWork
} from '@/lib/content-translator';
import { getLexiconWithOverrides, getAuthorsWithOverrides } from '@/lib/cms-store';

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
                console.error("Translation API error:", res.status, res.statusText);
                return `[Translation Error: ${res.status}] ${text}`;
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

export async function translatePostInPlace(post: BlogPost, lang: Language): Promise<BlogPost> {
    if (lang.startsWith('de')) return post;

    // Verwende zuerst manuelle Übersetzungen, wenn vorhanden
    const manuallyTranslated = getManuallyTranslatedPost(post, lang);

    // Wenn manuelle Übersetzungen existieren, verwende diese
    if (post.translations) {
        const baseLang = lang.split('-')[0] as 'de' | 'en' | 'la';
        if (post.translations[baseLang]) {
            // Check if title is not empty (sometimes it might be an empty string in the file)
            if (manuallyTranslated.title && manuallyTranslated.title.trim() !== '') {
                return manuallyTranslated;
            }
        }
    }

    // Fallback auf API-Übersetzung für Posts ohne manuelle Übersetzungen
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

export async function getTranslatedPost(lang: Language, authorId: Author, slug: string): Promise<BlogPost | null> {
    const allPosts = getPostsWithOverrides(await getAllPosts());
    const post = allPosts.find(p => p.author === authorId && p.slug === slug);
    if (!post) return null;

    return translatePostInPlace(post, lang);
}

export async function getTranslatedLexicon(lang: Language): Promise<LexiconEntry[]> {
    const lexicon = getLexiconWithOverrides(baseLexicon);
    if (lang.startsWith('de')) return lexicon;

    // Verwende zuerst manuelle Übersetzungen
    const manuallyTranslated = getManuallyTranslatedLexiconEntries(lexicon, lang);

    // Prüfe ob manuelle Übersetzungen vorhanden sind
    const hasManualTranslations = lexicon.some(entry => {
        const baseLang = lang.split('-')[0] as 'de' | 'en' | 'la';
        return entry.translations && entry.translations[baseLang];
    });

    // Wenn manuelle Übersetzungen existieren, verwende gemischten Ansatz
    if (hasManualTranslations) {
        return Promise.all(
            manuallyTranslated.map(async (entry, index) => {
                const original = lexicon[index];
                const baseLang = lang.split('-')[0] as 'de' | 'en' | 'la';

                // Wenn dieser Eintrag manuelle Übersetzungen hat, verwende sie
                if (original.translations && original.translations[baseLang]) {
                    return entry;
                }

                // Sonst verwende API-Übersetzung
                return {
                    ...original,
                    definition: await translateText(original.definition, lang),
                    category: await translateText(original.category, lang),
                };
            })
        );
    }

    // Fallback auf API-Übersetzung für alle Einträge
    return Promise.all(
        lexicon.map(async (entry) => ({
            ...entry,
            definition: await translateText(entry.definition, lang),
            category: await translateText(entry.category, lang),
        }))
    );
}

export async function getTranslatedLexiconEntry(lang: Language, slug: string): Promise<LexiconEntry | null> {
    const lexicon = getLexiconWithOverrides(baseLexicon);
    const entry = lexicon.find(e => e.slug === slug);
    if (!entry) return null;
    if (lang.startsWith('de')) return entry;

    // Verwende zuerst manuelle Übersetzung
    const manuallyTranslated = getManuallyTranslatedLexiconEntry(entry, lang);

    // Wenn manuelle Übersetzung existiert, verwende sie
    const baseLang = lang.split('-')[0] as 'de' | 'en' | 'la';
    if (entry.translations && entry.translations[baseLang]) {
        return manuallyTranslated;
    }

    // Fallback auf API-Übersetzung
    return {
        ...entry,
        definition: await translateText(entry.definition, lang),
        category: await translateText(entry.category, lang),
        etymology: entry.etymology ? await translateText(entry.etymology, lang) : undefined,
    }
}


export async function getTranslatedAuthor(lang: Language, authorId: Author): Promise<AuthorInfo | null> {
    const authorMap = getAuthorsWithOverrides(authors);
    const author = authorMap[authorId];
    if (!author) return null;
    if (lang.startsWith('de')) return author;

    // Autoren-Übersetzungen werden jetzt über die zentrale Übersetzungsfunktion t() abgerufen
    // Diese Funktion ist hauptsächlich für Kompatibilität vorhanden
    return author;
}

export async function getTranslatedAuthors(lang: Language): Promise<Record<string, AuthorInfo>> {
    // Autoren-Übersetzungen werden jetzt über die zentrale Übersetzungsfunktion t() abgerufen
    // Diese Funktion ist hauptsächlich für Kompatibilität vorhanden
    return getAuthorsWithOverrides(authors);
}


export async function getTranslatedWork(lang: Language, slug: string): Promise<Work | null> {
    const work = works[slug];
    if (!work) return null;
    if (lang.startsWith('de')) return work;

    // Verwende zuerst manuelle Übersetzung
    const manuallyTranslated = getManuallyTranslatedWork(work, lang);

    // Wenn manuelle Übersetzung existiert, verwende sie
    const baseLang = lang.split('-')[0] as 'de' | 'en' | 'la';
    if (work.translations && work.translations[baseLang]) {
        return manuallyTranslated;
    }

    // Fallback auf API-Übersetzung
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

    // Verwende zuerst manuelle Übersetzungen
    const manuallyTranslated = getManuallyTranslatedTimelineEvents(timelineEvents, lang);

    // Prüfe ob manuelle Übersetzungen vorhanden sind
    const hasManualTranslations = timelineEvents.some(event => {
        const baseLang = lang.split('-')[0] as 'de' | 'en' | 'la';
        return event.translations && event.translations[baseLang];
    });

    // Wenn manuelle Übersetzungen existieren, verwende gemischten Ansatz
    if (hasManualTranslations) {
        return Promise.all(
            manuallyTranslated.map(async (event, index) => {
                const original = timelineEvents[index];
                const baseLang = lang.split('-')[0] as 'de' | 'en' | 'la';

                // Wenn dieses Event manuelle Übersetzungen hat, verwende sie
                if (original.translations && original.translations[baseLang]) {
                    return event;
                }

                // Sonst verwende API-Übersetzung
                return {
                    ...original,
                    title: await translateText(original.title, lang),
                    description: await translateText(original.description, lang),
                };
            })
        );
    }

    // Fallback auf API-Übersetzung für alle Events
    return Promise.all(
        timelineEvents.map(async (event) => ({
            ...event,
            title: await translateText(event.title, lang),
            description: await translateText(event.description, lang),
        }))
    );
}
