// Determine API base URL based on environment
export function getApiBase(): string {
    // Use Cloudflare Workers for all API calls to avoid Access issues
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV) {
        // In development, use relative URL since Vite proxy handles /api routing
        return '';
    }
    // In production, use Cloudflare Workers URL with /api prefix
    return 'https://caesar.schaechner.workers.dev/api';
}

// Specialized function for user-generated content APIs (comments, profile, etc.)
export function getUserApiBase(): string {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV) {
        // In development, use relative URL since Vite proxy handles /api routing
        return '';
    }
    // In production, use Cloudflare Workers URL with /api prefix
    return 'https://caesar.schaechner.workers.dev/api';
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
        // Log data source from response headers
        const dataSource = res.headers.get('X-Data-Source');
        const itemCount = res.headers.get('X-Post-Count') || res.headers.get('X-Entry-Count');
        if (!res.ok) {
            console.error(`❌ [API] HTTP ${res.status}: ${res.statusText} for ${url}`);
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        // Log successful fetch with data source info
        if (dataSource) {
            console.log(`✅ [API] Response from ${dataSource}${itemCount ? ` (${itemCount} items)` : ''}`);
        }
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
    // Smart save: if slug exists, try update first, fallback to create
    if (data.slug) {
        try {
            const res = await fetch(`${getApiBase()}/lexicon/${data.slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                requestCache.clear();
                return res.json();
            }
            if (res.status !== 404) {
                throw new Error('Failed to update entry');
            }
            // 404 = doesn't exist, try create
        } catch (err) {
            // Continue to create
        }
    }
    // Create new
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
    const res = await fetch(`${getApiBase()}/lexicon/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update lexicon entry');
    requestCache.clear();
    return res.json();
}
export async function deleteLexiconEntry(slug: string) {
    const res = await fetch(`${getApiBase()}/lexicon/${slug}`, {
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
export async function simulateAI(persona: string, scenario: string, history: any[], choice?: string): Promise<any> {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV;
    const url = isDev
        ? new URL('https://caesar.schaechner.workers.dev/simulate')
        : new URL('/api/simulate', origin || '');
    const res = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona, scenario, history, choice })
    });
    if (!res.ok) {
        throw new Error(`Simulation failed: ${res.status}`);
    }
    return res.json();
}
