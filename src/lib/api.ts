// Determine API base URL based on environment
function getApiBase(): string {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV) {
        return 'http://localhost:3001/api';
    }
    if (typeof window !== 'undefined') {
        return `${window.location.origin}/api`;
    }
    return '/api';
}

// Add request cache for GET requests to avoid redundant network calls
const requestCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function cachedFetch(url: string, options?: RequestInit) {
    // Only cache GET requests
    if (!options || options.method === 'GET' || !options.method) {
        const cached = requestCache.get(url);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return Promise.resolve(cached.data);
        }
    }
    
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const data = await res.json();
    
    // Cache GET responses
    if (!options || options.method === 'GET' || !options.method) {
        requestCache.set(url, { data, timestamp: Date.now() });
    }
    
    return data;
}

export async function fetchPosts() {
    return cachedFetch(`${getApiBase()}/posts`);
}

export async function fetchPost(author: string, slug: string) {
    return cachedFetch(`${getApiBase()}/posts/${author}/${slug}`);
}

export async function createPost(data: any) {
    const res = await fetch(`${getApiBase()}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create post');
    // Invalidate cache
    requestCache.clear();
    return res.json();
}

export async function deletePost(author: string, slug: string) {
    const res = await fetch(`${getApiBase()}/posts/${author}/${slug}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete post');
    // Invalidate cache
    requestCache.clear();
    return res.json();
}

export async function fetchAuthors() {
    return cachedFetch(`${getApiBase()}/authors`);
}

export async function saveAuthor(data: any) {
    const res = await fetch(`${getApiBase()}/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save author');
    requestCache.clear();
    return res.json();
}

export async function deleteAuthor(id: string) {
    const res = await fetch(`${getApiBase()}/authors/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete author');
    requestCache.clear();
    return res.json();
}

export async function fetchLexicon() {
    return cachedFetch(`${getApiBase()}/lexicon`);
}

export async function fetchLexiconEntry(slug: string) {
    return cachedFetch(`${getApiBase()}/lexicon/${slug}`);
}

export async function saveLexiconEntry(data: any) {
    const res = await fetch(`${getApiBase()}/lexicon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save lexicon entry');
    requestCache.clear();
    return res.json();
}

export async function deleteLexiconEntry(slug: string) {
    const res = await fetch(`${getApiBase()}/lexicon/${slug}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete lexicon entry');
    return res.json();
}

export async function fetchPages() {
    const res = await fetch(`${getApiBase()}/pages`);
    if (!res.ok) throw new Error('Failed to fetch pages');
    return res.json();
}

export async function fetchPage(slug: string) {
    const res = await fetch(`${getApiBase()}/pages/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch page');
    return res.json();
}

export async function savePage(data: any) {
    const res = await fetch(`${getApiBase()}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save page');
    return res.json();
}


export async function deletePage(slug: string) {
    const res = await fetch(`${getApiBase()}/pages/${slug}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete page');
    return res.json();
}

// ============ TAGS API ============

export async function fetchTags() {
    const res = await fetch(`${getApiBase()}/tags`);
    if (!res.ok) throw new Error('Failed to fetch tags');
    return res.json();
}

export async function renameTag(oldTag: string, newTag: string) {
    const res = await fetch(`${getApiBase()}/tags`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldTag, newTag })
    });
    if (!res.ok) throw new Error('Failed to rename tag');
    return res.json();
}

export async function deleteTag(tag: string) {
    const res = await fetch(`${getApiBase()}/tags/${tag}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete tag');
    return res.json();
}

// ============ WORKS API ============

export async function fetchWorks() {
    const res = await fetch(`${getApiBase()}/works`);
    if (!res.ok) throw new Error('Failed to fetch works');
    return res.json();
}

export async function fetchWork(slug: string) {
    const res = await fetch(`${getApiBase()}/works/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch work');
    return res.json();
}

export async function saveWork(data: any) {
    const res = await fetch(`${getApiBase()}/works`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save work');
    return res.json();
}

export async function deleteWork(slug: string) {
    const res = await fetch(`${getApiBase()}/works/${slug}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete work');
    return res.json();
}

// Work Details (key moments, quotes, etc.)
export async function fetchWorkDetails(slug: string) {
    const res = await fetch(`${getApiBase()}/works/${slug}/details`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch work details');
    return res.json();
}

export async function saveWorkDetails(slug: string, details: any) {
    const res = await fetch(`${getApiBase()}/works/${slug}/details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
    });
    if (!res.ok) throw new Error('Failed to save work details');
    return res.json();
}

export async function deleteWorkDetails(slug: string) {
    const res = await fetch(`${getApiBase()}/works/${slug}/details`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete work details');
    return res.json();
}

// ============ AI (Cloudflare Worker) ============

type AiResource = { title: string; type: 'map' | 'text' | 'lexicon'; description?: string; link: string };
export async function askAI(persona: string, question: string, opts?: { sitemapUrl?: string }): Promise<{ text: string; resources?: AiResource[] }> {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV;
    const url = isDev
        ? new URL('https://caesar.schaechner.workers.dev/')
        : new URL('/api/ask', origin || '');
    url.searchParams.set('persona', persona);
    url.searchParams.set('ask', question);
    const sitemap = opts?.sitemapUrl || (origin ? `${origin}/sitemap.xml` : undefined);
    if (sitemap) url.searchParams.set('sitemap', sitemap);

    const res = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'accept': 'application/json' }
    });
    if (!res.ok) {
        throw new Error(`AI request failed: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    // Worker returns shape: { persona, inputs, response: { response: string }, resources?: [] }
    const text = json?.response?.response ?? json?.response ?? JSON.stringify(json);
    const resources: AiResource[] | undefined = json?.resources;
    const finalText = typeof text === 'string' ? text : String(text);
    return { text: finalText, resources };
}
