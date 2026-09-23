// Daybreak: Crimson Tide — Service Worker
// Bump CACHE_VERSION whenever index.html or any other PRECACHE_URLS file
// changes — that's the only way returning clients pick up a new app shell.
// NOTE: this does NOT cover runtime-cached assets like portraits/comics/
// audio (see below) — those now self-update via stale-while-revalidate,
// so swapping a portrait file no longer requires a version bump at all.
const CACHE_VERSION = 'crimson-tide-v6';
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
  './assets/icons/icon-512x512-maskable.png',
  // index.html was split into external scripts (v184) — these are now
  // part of the app shell itself and have to be precached the same way
  // index.html is, or a fresh install with no prior online visit could
  // load an index.html with nothing behind it.
  './scripts/debug-log.js',
  './scripts/core-engine.js',
  './scripts/story-mode-advance.js',
  './scripts/footer-and-arc1.js',
  './scripts/arc2.js',
  './scripts/safety-and-fixes.js',
  './scripts/arc3.js',
  './scripts/arc4-fairtide.js',
  './scripts/arc5-and-objective-chain.js',
  './scripts/fairtide-buildings-and-arc6.js',
  './scripts/arc7.js',
  './scripts/arc8.js',
  './scripts/arc9-and-systems.js',
  './scripts/arc10-12.js',
  './scripts/fairtide-systems.js',
  './scripts/interworld-expeditions.js',
  './scripts/arc13-harbour.js',
  './scripts/harbour-and-arc14.js',
  './scripts/achievements.js',
  './scripts/tide-network.js',
  './scripts/arc15-and-voyage-fixes.js',
  './scripts/clan-settlement-and-sw.js',
  './scripts/fountain-of-youth.js',
  './scripts/midnight-backup.js',
  './scripts/unknown-location-ui-fixes.js',
  './scripts/arc16-world-systems.js'
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
  //
  // BUG FIX: this used to be `fetch(req).catch(() => caches.match(...))`,
  // which has two failure modes that both look like "tap the icon, nothing
  // happens" — the exact symptom that was forcing repeated reinstalls:
  //   1. No timeout on the network attempt. A slow/flaky mobile connection
  //      at launch doesn't reject quickly, it just hangs — and with no
  //      race against that, the navigation stalls indefinitely instead of
  //      falling back to the cached shell.
  //   2. No guaranteed fallback. caches.match() can resolve to undefined
  //      (e.g. right after a deploy, before that exact URL's been cached
  //      under the new version). respondWith(undefined) is invalid — in
  //      standalone/installed mode Chrome fails the navigation silently
  //      instead of showing any error page, so tapping the icon does
  //      nothing at all, with no indication anything went wrong.
  // Racing a short timeout against the network, and always falling back to
  // an actual Response (the cached shell, or as a last resort a minimal
  // inline offline page) fixes both — launch either gets the fresh page,
  // the cached one, or a real "you're offline" screen, but never nothing.
  if (req.mode === 'navigate') {
    event.respondWith(
      Promise.race([
        fetch(req),
        new Promise((_, reject) => setTimeout(() => reject(new Error('nav-timeout')), 3000))
      ]).catch(() =>
        caches.match('./index.html').then(cached => cached || caches.match('./')).then(cached =>
          cached || new Response(
            '<!doctype html><meta charset="utf-8"><title>Crimson Tide — Offline</title>' +
            '<body style="background:#0d1f2d;color:#e8c96a;font-family:sans-serif;text-align:center;padding:3em 1em;">' +
            '<h2>You\'re offline</h2><p>Couldn\'t reach the server and no cached copy was found yet.<br>Reconnect and try again.</p></body>',
            { headers: { 'Content-Type': 'text/html' } }
          )
        )
      )
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
