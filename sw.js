// Daybreak: Crimson Tide — Service Worker
// Bump CACHE_VERSION whenever index.html or any other PRECACHE_URLS file
// changes — that's the only way returning clients pick up a new app shell.
// NOTE: this does NOT cover runtime-cached assets like portraits/comics/
// audio (see below) — those now self-update via stale-while-revalidate,
// so swapping a portrait file no longer requires a version bump at all.
const CACHE_VERSION = 'crimson-tide-v12';
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
  './scripts/arc16-world-systems.js',
  './scripts/arc17.js',
  './scripts/arc17-archive-hub.js',
  './scripts/arc17-research.js',
  './scripts/arc16-forest-coast.js',
  './scripts/arc16-dragon-mountain.js',
  './scripts/arc16-crystal-old.js'
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

// BUG FIX (San's report — comparing against the Daybreak project's own
// sw.js, which never had this problem): script files fell through to the
// generic final block below, which is pure cache-first with NO network
// check at all. Even after index.html itself got fresh via the
// navigate-network-first rule below, its own <script src="..."> tags
// still got intercepted and served from whatever the currently-active
// service worker had cached — which only updates once the full
// install/activate lifecycle completes. That lifecycle depends on the
// browser noticing sw.js itself has changed, which can be delayed or
// blocked by ordinary HTTP caching of sw.js — a fragile, multi-step path
// with several places to silently stall, which is exactly what kept
// happening. Daybreak's sw.js sidesteps all of this: it treats its core
// files (game.js, styles.css, etc.) as network-first, so every load
// fetches the latest version directly, completely independent of
// whether the service worker itself has been detected as updated. Every
// script file here is now treated the same way — this doesn't just make
// the update check fire sooner, it removes the dependency on that whole
// mechanism for getting fresh code in the first place.
function isAppShellRequest(url) {
  return PRECACHE_URLS.some(function(asset){
    const clean = asset.replace('./', '/');
    return url.pathname.endsWith(clean) || (clean === '/' && url.pathname === '/');
  });
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Page navigations AND app-shell files (scripts, index.html, manifest):
  // network-first, so players always get the latest build while online —
  // this is the fix. Falls back to the cached shell if offline. See the
  // BUG FIX note above for why this now covers script files too, not
  // just the navigation itself.
  //
  // The timeout-race + guaranteed-Response fallback here predates this
  // change and stays as-is: no timeout on a slow/flaky connection means
  // the fetch just hangs instead of falling back, and caches.match() can
  // resolve to undefined (e.g. right after a deploy), and
  // respondWith(undefined) fails navigations silently in standalone mode.
  if (req.mode === 'navigate' || isAppShellRequest(new URL(req.url))) {
    event.respondWith(
      Promise.race([
        fetch(req),
        new Promise((_, reject) => setTimeout(() => reject(new Error('nav-timeout')), 3000))
      ]).then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(PRECACHE).then(cache => cache.put(req, copy));
        }
        return response;
      }).catch(() =>
        caches.match(req).then(cached => cached || caches.match('./index.html')).then(cached =>
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
