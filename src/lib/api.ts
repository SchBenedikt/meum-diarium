
const API_BASE = 'http://localhost:3001/api';

export async function fetchPosts() {
    const res = await fetch(`${API_BASE}/posts`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
}

export async function fetchPost(author: string, slug: string) {
    const res = await fetch(`${API_BASE}/posts/${author}/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch post');
    return res.json();
}

export async function createPost(data: any) {
    const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
}

export async function deletePost(author: string, slug: string) {
    const res = await fetch(`${API_BASE}/posts/${author}/${slug}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete post');
    return res.json();
}

export async function fetchAuthors() {
    const res = await fetch(`${API_BASE}/authors`);
    if (!res.ok) throw new Error('Failed to fetch authors');
    return res.json();
}

export async function saveAuthor(data: any) {
    const res = await fetch(`${API_BASE}/authors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save author');
    return res.json();
}

export async function deleteAuthor(id: string) {
    const res = await fetch(`${API_BASE}/authors/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete author');
    return res.json();
}

export async function fetchLexicon() {
    const res = await fetch(`${API_BASE}/lexicon`);
    if (!res.ok) throw new Error('Failed to fetch lexicon');
    return res.json();
}

export async function fetchLexiconEntry(slug: string) {
    const res = await fetch(`${API_BASE}/lexicon/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch lexicon entry');
    return res.json();
}

export async function saveLexiconEntry(data: any) {
    const res = await fetch(`${API_BASE}/lexicon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to save lexicon entry');
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
