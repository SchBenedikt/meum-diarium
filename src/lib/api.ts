// Determine API base URL based on environment
export function getApiBase(): string {
    // Use same-origin /api in both dev and production.
    // In dev, Vite proxies /api to the local backend; in production, Cloudflare serves /api.
    return '/api';
}

// Specialized function for user-generated content APIs (comments, profile, etc.)
export function getUserApiBase(): string {
    // Keep user-content APIs on same-origin /api for consistent routing.
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
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            console.error(`❌ [API] HTTP ${res.status}: ${res.statusText} for ${url}`);
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.toLowerCase().includes('application/json')) {
            const raw = await res.text();
            const preview = raw.slice(0, 160).replace(/\s+/g, ' ').trim();
            throw new Error(`Expected JSON but got ${contentType || 'unknown content-type'} for ${url}. Response starts with: ${preview}`);
        }

        const data = await res.json();
        // Cache GET responses
        if (!options || options.method === 'GET' || !options.method) {
            requestCache.set(url, { data, timestamp: Date.now() });
        }
        return data;
    } catch (error) {
        // If we are in the browser, the Service Worker might have a cached version even if this fetch failed.
        // However, if we're here, the request already failed. If it was a GET, we might have it in our local memory cache.
        if (!options || options.method === 'GET' || !options.method) {
            const cached = requestCache.get(url);
            if (cached) return cached.data;
        }
        throw error;
    }
}
export async function fetchPosts() {
    return cachedFetch(`${getApiBase()}/posts`);
}
export async function fetchPost(author: string, slug: string) {
    // Use author/slug route: /api/posts/{author}/{slug}
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
export async function updatePost(author: string, slug: string, data: any) {
    // Use author/slug route: /api/posts/{author}/{slug}
    const res = await fetch(`${getApiBase()}/posts/${author}/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update post');
    // Invalidate cache
    requestCache.clear();
    return res.json();
}
export async function deletePost(author: string, slug: string) {
    // Use author/slug route: /api/posts/{author}/{slug}
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
    // Smart save: if ID exists, try update first, fallback to create
    if (data.id) {
        try {
            const res = await fetch(`${getApiBase()}/authors/${data.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                requestCache.clear();
                return res.json();
            }
            if (res.status !== 404) {
                throw new Error('Failed to update author');
            }
            // 404 = doesn't exist, try create
        } catch (err) {
            // Continue to create
        }
    }
    // Create new
    const res = await fetch(`${getApiBase()}/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save author');
    requestCache.clear();
    return res.json();
}
export async function updateAuthor(id: string, data: any) {
    const res = await fetch(`${getApiBase()}/authors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update author');
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
    return cachedFetch(`${getApiBase()}/lexicon?slug=${slug}`);
}
export async function saveLexiconEntry(data: any) {
    // Create new entry
    const res = await fetch(`${getApiBase()}/lexicon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save lexicon entry');
    requestCache.clear();
    return res.json();
}
export async function updateLexiconEntry(slug: string, data: any) {
    // Use query param so /api/lexicon handler receives it (no dynamic path function exists)
    const res = await fetch(`${getApiBase()}/lexicon?slug=${encodeURIComponent(slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update lexicon entry');
    requestCache.clear();
    return res.json();
}
export async function deleteLexiconEntry(slug: string) {
    // Use query param so /api/lexicon handler receives it (no dynamic path function exists)
    const res = await fetch(`${getApiBase()}/lexicon?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete lexicon entry');
    requestCache.clear();
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
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0 && data[0]?.translations) {
        return data.map((tag: any) => tag.translations?.de || tag.id).filter(Boolean);
    }
    return data;
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
    // Try to fetch from static JSON first (more reliable)
    try {
        const res = await fetch('/api/works.json', { 
            headers: { 'Content-Type': 'application/json' } 
        });
        if (res.ok) {
            return await res.json();
        }
    } catch (err) {
    }
    // Fallback to API if static JSON fails
    try {
        const res = await fetch(`${getApiBase()}/works`);
        if (!res.ok) throw new Error('API returned non-200');
        return await res.json();
    } catch (err) {
        console.error('❌ [API] Failed to fetch works from both sources:', err);
        return [];
    }
}
export async function fetchWork(slug: string) {
    // Try static works.json first
    try {
        const res = await fetch('/api/works.json');
        if (res.ok) {
            const works = await res.json();
            const work = Array.isArray(works) ? works.find((w: any) => w.slug === slug) : null;
            if (work) {
                return work;
            }
        }
    } catch (err) {
    }
    // Fallback to API
    return cachedFetch(`${getApiBase()}/works?slug=${slug}`);
}
export async function saveWork(data: any) {
    // Smart save: if ID exists, try update first, fallback to create
    if (data.id) {
        try {
            const res = await fetch(`${getApiBase()}/works/${data.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                requestCache.clear();
                return res.json();
            }
            if (res.status !== 404) {
                throw new Error('Failed to update work');
            }
            // 404 = doesn't exist, try create
        } catch (err) {
            // Continue to create
        }
    }
    // Create new
    const res = await fetch(`${getApiBase()}/works`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save work');
    requestCache.clear();
    return res.json();
}
export async function updateWork(id: string, data: any) {
    const res = await fetch(`${getApiBase()}/works/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update work');
    requestCache.clear();
    return res.json();
}
export async function deleteWork(slug: string) {
    const res = await fetch(`${getApiBase()}/works/${slug}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete work');
    requestCache.clear();
    return res.json();
}
// Work Details (key moments, quotes, etc.) - Load from static JSON first
export async function fetchWorkDetails(slug: string) {
    // Try static JSON first (static/works-details/{slug}.json)
    try {
        const res = await fetch(`/api/works-details/${slug}.json`, {
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            const data = await res.json();
            // Extract language-specific data if needed
            return data;
        }
    } catch (err) {
    }
    // Fallback to API
    try {
        const res = await fetch(`${getApiBase()}/works/${slug}/details`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error('Failed to fetch work details');
        return res.json();
    } catch (err) {
        console.error(`❌ [API] Failed to fetch work details for "${slug}":`, err);
        return null;
    }
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
export type WorksheetTaskConfig = {
    type: 'readingComprehension' | 'cloze' | 'multipleChoice' | 'translation' | 'interpretation' | 'discussion';
    difficulty: 1 | 2 | 3;
    amount: 1 | 2 | 3;
};

export type WorksheetTask = {
    type: WorksheetTaskConfig['type'];
    title: string;
    instruction: string;
    material?: string;
    difficulty: 1 | 2 | 3;
};

export type WorksheetResponse = {
    worksheet: {
        title: string;
        subtitle: string;
        intro?: string;
        tasks: WorksheetTask[];
    };
    warning?: string;
};

export async function askAI(persona: string, question: string, opts?: { sitemapUrl?: string }): Promise<{ text: string; resources?: AiResource[] }> {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV;
    const primaryUrl = isDev
        ? new URL('/', 'https://caesar.schaechner.workers.dev')
        : new URL('/api/ask', origin || 'http://localhost');
    primaryUrl.searchParams.set('persona', persona);
    primaryUrl.searchParams.set('ask', question);
    const sitemap = opts?.sitemapUrl || (origin ? `${origin}/sitemap.xml` : undefined);
    if (sitemap) primaryUrl.searchParams.set('sitemap', sitemap);

    if (import.meta.env.DEV) console.log(`[Frontend] askAI request: persona=${persona}, question="${question.substring(0, 40)}..."${sitemap ? ', with sitemap' : ''}`);
    let res = await fetch(primaryUrl.toString(), {
        method: 'GET',
        headers: { 'accept': 'application/json' }
    });

    if (!res.ok && (res.status === 404 || res.status >= 500)) {
        if (import.meta.env.DEV) console.warn(`[Frontend] Primary URL failed (${res.status}), trying fallback...`);
        const fallbackUrl = new URL('/', 'https://caesar.schaechner.workers.dev');
        fallbackUrl.searchParams.set('persona', persona);
        fallbackUrl.searchParams.set('ask', question);
        if (sitemap) fallbackUrl.searchParams.set('sitemap', sitemap);
        res = await fetch(fallbackUrl.toString(), {
            method: 'GET',
            headers: { 'accept': 'application/json' }
        });
    }

    if (!res.ok) {
        console.error(`[Frontend] AI request failed: ${res.status} ${res.statusText}`);
        throw new Error(`AI request failed: ${res.status} ${res.statusText}`);
    }
    
    const json = await res.json();
    if (import.meta.env.DEV) console.log(`[Frontend] AI response received:`, {
        hasResponse: !!json?.response,
        hasResources: !!json?.resources,
        resourceCount: json?.resources?.length || 0
    });
    
    // Worker returns shape: { persona, inputs, response: { response: string }, resources?: [] }
    const text = json?.response?.response ?? json?.response ?? JSON.stringify(json);
    const resources: AiResource[] | undefined = json?.resources;
    
    if (import.meta.env.DEV) {
        if (resources && resources.length > 0) {
            console.log(`[Frontend] Resources available:`, resources.map(r => ({ title: r.title, link: r.link, type: r.type })));
        } else {
            console.warn(`[Frontend] No resources returned from worker`);
        }
    }
    
    const finalText = typeof text === 'string' ? text : String(text);
    return { text: finalText, resources };
}

export async function generateWorksheetAI(payload: {
    topic: string;
    includeIntro: boolean;
    teacherNote?: string;
    tasks: WorksheetTaskConfig[];
}): Promise<WorksheetResponse> {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV;

    const primaryUrl = isDev
        ? new URL('/worksheet', 'https://caesar.schaechner.workers.dev')
        : new URL('/api/worksheet', origin || 'http://localhost');

    const fallbackUrl = new URL('/worksheet', 'https://caesar.schaechner.workers.dev');

    let res: Response;
    try {
        res = await fetch(primaryUrl.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok && (res.status === 404 || res.status >= 500)) {
            res = await fetch(fallbackUrl.toString(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
                body: JSON.stringify(payload),
            });
        }
    } catch {
        res = await fetch(fallbackUrl.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
            body: JSON.stringify(payload),
        });
    }

    if (!res.ok) {
        throw new Error(`Worksheet generation failed: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    if (!json?.worksheet || !Array.isArray(json.worksheet.tasks)) {
        throw new Error('Worksheet response is invalid');
    }

    return json as WorksheetResponse;
}

export async function simulateAI(persona: string, scenario: string, history: any[], choice?: string): Promise<any> {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV;
    const payload = { persona, scenario, history, choice };
    const primaryUrl = isDev
        ? new URL('/simulate', 'https://caesar.schaechner.workers.dev')
        : new URL('/api/simulate', origin || 'http://localhost');
    let res = await fetch(primaryUrl.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!res.ok && (res.status === 404 || res.status >= 500)) {
        const fallbackUrl = new URL('/simulate', 'https://caesar.schaechner.workers.dev');
        res = await fetch(fallbackUrl.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    if (!res.ok) {
        throw new Error(`Simulation failed: ${res.status}`);
    }
    return res.json();
}
