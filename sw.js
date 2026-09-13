// Daybreak: Crimson Tide — Service Worker
// Bump CACHE_VERSION whenever index.html or any other PRECACHE_URLS file
// changes — that's the only way returning clients pick up a new app shell.
// NOTE: this does NOT cover runtime-cached assets like portraits/comics/
// audio (see below) — those now self-update via stale-while-revalidate,
// so swapping a portrait file no longer requires a version bump at all.
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

  // Everything else (assets/*, fonts, etc.): images (portraits, comics,
  // icons) use stale-while-revalidate — serve the cached copy instantly
  // for speed, but always kick off a background fetch to refresh the
  // cache for next time. This is the actual fix for stale portraits:
  // previously this was pure cache-first, so once a portrait URL was
  // cached it was served forever, no matter how many times the underlying
  // file changed, since the filename itself never changes. Non-image
  // assets (fonts, etc., which genuinely never change post-deploy) keep
  // the original cache-first behavior for speed.
  const isImage = /\.(png|jpe?g|webp|gif|svg|ico)$/i.test(new URL(req.url).pathname);
  if (isImage) {
    event.respondWith(
      caches.match(req).then(cached => {
        const network = fetch(req).then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(RUNTIME).then(cache => cache.put(req, copy));
          }
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

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
