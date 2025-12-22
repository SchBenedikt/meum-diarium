
const API_BASE = 'http://localhost:3001/api';

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
    return cachedFetch(`${API_BASE}/posts`);
}

export async function fetchPost(author: string, slug: string) {
    return cachedFetch(`${API_BASE}/posts/${author}/${slug}`);
}

export async function createPost(data: any) {
    const res = await fetch(`${API_BASE}/posts`, {
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
    const res = await fetch(`${API_BASE}/posts/${author}/${slug}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete post');
    // Invalidate cache
    requestCache.clear();
    return res.json();
}

export async function fetchAuthors() {
    return cachedFetch(`${API_BASE}/authors`);
}

export async function saveAuthor(data: any) {
    const res = await fetch(`${API_BASE}/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save author');
    requestCache.clear();
    return res.json();
}

export async function deleteAuthor(id: string) {
    const res = await fetch(`${API_BASE}/authors/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete author');
    requestCache.clear();
    return res.json();
}

export async function fetchLexicon() {
    return cachedFetch(`${API_BASE}/lexicon`);
}

export async function fetchLexiconEntry(slug: string) {
    return cachedFetch(`${API_BASE}/lexicon/${slug}`);
}

export async function saveLexiconEntry(data: any) {
    const res = await fetch(`${API_BASE}/lexicon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save lexicon entry');
    requestCache.clear();
    return res.json();
}

export async function deleteLexiconEntry(slug: string) {
    const res = await fetch(`${API_BASE}/lexicon/${slug}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete lexicon entry');
    return res.json();
}

export async function fetchPages() {
    const res = await fetch(`${API_BASE}/pages`);
    if (!res.ok) throw new Error('Failed to fetch pages');
    return res.json();
}

export async function fetchPage(slug: string) {
    const res = await fetch(`${API_BASE}/pages/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch page');
    return res.json();
}

export async function savePage(data: any) {
    const res = await fetch(`${API_BASE}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save page');
    return res.json();
}


export async function deletePage(slug: string) {
    const res = await fetch(`${API_BASE}/pages/${slug}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete page');
    return res.json();
}

// ============ TAGS API ============

export async function fetchTags() {
    const res = await fetch(`${API_BASE}/tags`);
    if (!res.ok) throw new Error('Failed to fetch tags');
    return res.json();
}

export async function renameTag(oldTag: string, newTag: string) {
    const res = await fetch(`${API_BASE}/tags`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldTag, newTag })
    });
    if (!res.ok) throw new Error('Failed to rename tag');
    return res.json();
}

export async function deleteTag(tag: string) {
    const res = await fetch(`${API_BASE}/tags/${tag}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete tag');
    return res.json();
}

// ============ WORKS API ============

export async function fetchWorks() {
    const res = await fetch(`${API_BASE}/works`);
    if (!res.ok) throw new Error('Failed to fetch works');
    return res.json();
}

export async function fetchWork(slug: string) {
    const res = await fetch(`${API_BASE}/works/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch work');
    return res.json();
}

export async function saveWork(data: any) {
    const res = await fetch(`${API_BASE}/works`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save work');
    return res.json();
}

export async function deleteWork(slug: string) {
    const res = await fetch(`${API_BASE}/works/${slug}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete work');
    return res.json();
}

// Work Details (key moments, quotes, etc.)
export async function fetchWorkDetails(slug: string) {
    const res = await fetch(`${API_BASE}/works/${slug}/details`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch work details');
    return res.json();
}

export async function saveWorkDetails(slug: string, details: any) {
    const res = await fetch(`${API_BASE}/works/${slug}/details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
    });
    if (!res.ok) throw new Error('Failed to save work details');
    return res.json();
}

export async function deleteWorkDetails(slug: string) {
    const res = await fetch(`${API_BASE}/works/${slug}/details`, { method: 'DELETE' });
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
