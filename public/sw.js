const CACHE_NAME = 'meum-diarium-v3';
const RUNTIME_CACHE = 'runtime-cache-v3';
const OFFLINE_CACHE = 'offline-content-v2';
const IMAGES_CACHE = 'images-cache-v1';

// Assets to cache on install (Core UI)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt',
  '/icons/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Hero images for authors
  '/images/caesar-hero.jpg',
  '/images/cicero-hero.jpg',
  '/images/augustus-hero.jpg',
  '/images/seneca-hero.jpg',
  '/images/catilina-hero.jpg',
  // Core learning pages
  '/learn',
  '/learn/grammar',
  '/vocab',
  '/reader',
  '/lexicon'
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
            .filter(name =>
              name !== CACHE_NAME &&
              name !== RUNTIME_CACHE &&
              name !== OFFLINE_CACHE &&
              name !== IMAGES_CACHE
            )
            .map(name => caches.delete(name))
        );
      }),
      self.clients.claim(),
      // Trigger background pre-caching of all content
      triggerDeepPrecache()
    ])
  );
});

// Helper to send progress to all clients
async function reportProgress(progress, status) {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'PRECACHE_PROGRESS',
      payload: { progress, status }
    });
  });
}

// Deep Pre-caching Logic
async function triggerDeepPrecache() {
  console.log('[SW] Starting deep pre-cache...');
  try {
    const offlineCache = await caches.open(OFFLINE_CACHE);
    await reportProgress(5, 'Initialisiere Download...');

    // 1. Fetch Lists
    const endpoints = [
      '/api/posts',
      '/api/authors',
      '/api/lexicon',
      '/api/works',
      '/api/tags'
    ];

    const lists = await Promise.all(endpoints.map(async (url, index) => {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const clone = res.clone();
          await offlineCache.put(url, clone);
          const progress = 5 + Math.round(((index + 1) / endpoints.length) * 15);
          await reportProgress(progress, `Lade Listen... (${index + 1}/${endpoints.length})`);
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

    if (detailTasks.length === 0) {
      await reportProgress(100, 'Alle Inhalte sind aktuell.');
      return;
    }

    // Cache details in chunks to avoid overwhelming the network
    const CHUNK_SIZE = 5;
    let completed = 0;

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
        } finally {
          completed++;
        }
      }));

      const progress = 20 + Math.round((completed / detailTasks.length) * 80);
      await reportProgress(progress, `Speichere Artikel... (${completed}/${detailTasks.length})`);
    }

    await reportProgress(100, 'Alle Inhalte offline verfügbar!');
    console.log(`[SW] Deep pre-cache complete. Cached ${detailTasks.length} detail pages.`);
  } catch (error) {
    console.error('[SW] Deep pre-cache failed', error);
    await reportProgress(-1, 'Fehler beim Herunterladen.');
  }
}

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle cross-origin requests - allow them to pass through
  if (url.origin !== location.origin) {
    // For Cloudflare Insights and other external services, let them pass through
    if (url.hostname.includes('cloudflareinsights.com') || 
        url.hostname.includes('cloudflare.com') ||
        url.pathname.includes('/cdn-cgi/rum')) {
      return; // Don't intercept, let browser handle it
    }
    // For other cross-origin requests, don't intercept
    return;
  }

  // Handle images separately with longer cache duration
  if (request.destination === 'image' || /\.(jpg|jpeg|png|gif|svg|webp|ico)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(IMAGES_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        }).catch(() => {
          // Return placeholder for offline images
          return caches.match('/icons/favicon.svg');
        });
      })
    );
    return;
  }

  // Network first for Everything except static assets
  // This ensures fresh content when online, but falls back to cache when offline
  if (request.mode === 'navigate' || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            // Only cache GET requests - POST, PUT, DELETE will bypass cache
            // Cache API spec only supports GET/HEAD/OPTIONS
            if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS') {
              const cacheType = url.pathname.startsWith('/api/') ? OFFLINE_CACHE : RUNTIME_CACHE;
              caches.open(cacheType).then(cache => {
                cache.put(request, responseClone);
              });
            }
          }
          return response;
        })
        .catch(async () => {
          // Offline fallback
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;

          if (request.mode === 'navigate') {
            const rootCache = await caches.match('/');
            if (rootCache) return rootCache;
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
          // Only cache GET requests - POST, PUT, DELETE will bypass cache
          // Cache API spec only supports GET/HEAD/OPTIONS
          if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS') {
            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
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
