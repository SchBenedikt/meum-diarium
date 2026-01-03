const CACHE_NAME = 'meum-diarium-v2';
const RUNTIME_CACHE = 'runtime-cache-v2';
const OFFLINE_CACHE = 'offline-content-v1';

// Assets to cache on install (Core UI)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt',
  '/favicon.ico',
  '/icons/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - precache essential UI assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches and trigger deep precache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE && name !== OFFLINE_CACHE)
            .map(name => caches.delete(name))
        );
      }),
      self.clients.claim(),
      // Trigger background pre-caching of all content
      triggerDeepPrecache()
    ])
  );
});

// Deep Pre-caching Logic
async function triggerDeepPrecache() {
  console.log('[SW] Starting deep pre-cache...');
  try {
    const offlineCache = await caches.open(OFFLINE_CACHE);

    // 1. Fetch Lists
    const endpoints = [
      '/api/posts',
      '/api/authors',
      '/api/lexicon',
      '/api/works',
      '/api/tags'
    ];

    const lists = await Promise.all(endpoints.map(async url => {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const clone = res.clone();
          await offlineCache.put(url, clone);
          return await res.json();
        }
      } catch (e) {
        console.error(`[SW] Failed to fetch list ${url}`, e);
      }
      return null;
    }));

    const [posts, authors, lexicon, works] = lists;

    // 2. Fetch Details for each item
    const detailTasks = [];

    // Posts
    if (posts && Array.isArray(posts)) {
      posts.forEach(post => {
        detailTasks.push(`/api/posts/${post.author}/${post.slug}`);
      });
    }

    // Lexicon
    if (lexicon && Array.isArray(lexicon)) {
      lexicon.forEach(entry => {
        detailTasks.push(`/api/lexicon/${entry.slug}`);
      });
    }

    // Works
    if (works && Array.isArray(works)) {
      works.forEach(work => {
        detailTasks.push(`/api/works/${work.slug}`);
        detailTasks.push(`/api/works/${work.slug}/details`);
      });
    }

    // Cache details in chunks to avoid overwhelming the network
    const CHUNK_SIZE = 10;
    for (let i = 0; i < detailTasks.length; i += CHUNK_SIZE) {
      const chunk = detailTasks.slice(i, i + CHUNK_SIZE);
      await Promise.all(chunk.map(async url => {
        try {
          const res = await fetch(url);
          if (res.ok) {
            await offlineCache.put(url, res);
          }
        } catch (e) {
          // Ignore failures for individual items
        }
      }));
    }

    console.log(`[SW] Deep pre-cache complete. Cached ${detailTasks.length} detail pages.`);
  } catch (error) {
    console.error('[SW] Deep pre-cache failed', error);
  }
}

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  // Network first for Everything except static assets
  // This ensures fresh content when online, but falls back to cache when offline
  if (request.mode === 'navigate' || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            const cacheType = url.pathname.startsWith('/api/') ? OFFLINE_CACHE : RUNTIME_CACHE;
            caches.open(cacheType).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Offline fallback
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;

          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }

          return new Response(JSON.stringify({ error: 'Offline', offline: true }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // Cache first for static assets
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then(response => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });
    })
  );
});

// Messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'TRIGGER_PRECACHE') {
    event.waitUntil(triggerDeepPrecache());
  }
});
