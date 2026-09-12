// Daybreak: Crimson Tide — Service Worker
// Bump CACHE_VERSION on any deploy where index.html (or other precached
// files) changed, so old clients pick up the new shell instead of a stale
// cached copy.
const CACHE_VERSION = 'crimson-tide-v1';
const PRECACHE = `${CACHE_VERSION}-precache`;
const RUNTIME = `${CACHE_VERSION}-runtime`;

// Only the app shell + icons are precached at install time. Comics,
// portraits, and audio are numerous and heavy, so those are cached
// on-demand as the player actually encounters them (see the fetch handler
// below) rather than all up front.
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './assets/icons/favicon.ico',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png',
  './assets/icons/icon-192x192-maskable.png',
  './assets/icons/icon-512x512-maskable.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== PRECACHE && k !== RUNTIME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Page navigations: try the network first (so players always get the
  // latest build while online), fall back to the cached shell if offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Everything else (assets/*, fonts, etc.): cache-first for speed, then
  // fetch from the network and stash a copy for next time. If both fail
  // (offline + never fetched before), the request just fails as normal.
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(RUNTIME).then(cache => cache.put(req, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
