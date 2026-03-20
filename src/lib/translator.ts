import { BlogPost, TimelineEvent, LexiconEntry, Work, Author, AuthorInfo } from '@/types/blog';
import { authors } from '@/data/authors';
import { lexicon as baseLexicon } from '@/data/lexicon';
import { works } from '@/data/works';
import { timelineEvents } from '@/data/timeline';
import { getAllPosts } from '@/data/posts';
import { getPostsWithOverrides } from '@/lib/cms-store';
import { getLexiconWithOverrides, getAuthorsWithOverrides } from '@/lib/cms-store';

export async function translatePostInPlace(post: BlogPost): Promise<BlogPost> {
    return post;
}

export async function getTranslatedPost(_lang: string, authorId: Author, slug: string): Promise<BlogPost | null> {
    const allPosts = getPostsWithOverrides(await getAllPosts());
    return allPosts.find(p => p.author === authorId && p.slug === slug) ?? null;
}

export async function getTranslatedLexicon(): Promise<LexiconEntry[]> {
    return getLexiconWithOverrides(baseLexicon);
}

export async function getTranslatedLexiconEntry(_lang: string, slug: string): Promise<LexiconEntry | null> {
    const lexicon = getLexiconWithOverrides(baseLexicon);
    return lexicon.find(e => e.slug === slug) ?? null;
}

export async function getTranslatedAuthor(_lang: string, authorId: Author): Promise<AuthorInfo | null> {
    const authorMap = getAuthorsWithOverrides(authors);
    return authorMap[authorId] ?? null;
}

export async function getTranslatedAuthors(): Promise<Record<string, AuthorInfo>> {
    return getAuthorsWithOverrides(authors);
}

export async function getTranslatedWork(_lang: string, slug: string): Promise<Work | null> {
    return works[slug] ?? null;
}

export async function getTranslatedTimeline(): Promise<TimelineEvent[]> {
    return timelineEvents;
}
