// Daybreak: Crimson Tide — Service Worker
// Bump CACHE_VERSION whenever index.html or any other PRECACHE_URLS file
// changes — that's the only way returning clients pick up a new app shell.
// NOTE: this does NOT cover runtime-cached assets like portraits/comics/
// audio (see below) — those now self-update via stale-while-revalidate,
// so swapping a portrait file no longer requires a version bump at all.
const CACHE_VERSION = 'crimson-tide-v145';
const PRECACHE = `${CACHE_VERSION}-precache`;
// BUG FIX (San's report — "images loading very slowly with this
// refresh"): RUNTIME used to be derived from CACHE_VERSION too
// (`${CACHE_VERSION}-runtime`), same as PRECACHE. Every one of this
// session's near-constant feature deploys bumps CACHE_VERSION, and
// activate() below deletes any cache whose name isn't the CURRENT
// PRECACHE or RUNTIME — so every single deploy was also silently
// wiping the entire runtime cache of already-downloaded portraits,
// comics, and audio, forcing every image back to a slow first-time
// network fetch right after each update. None of that was ever the
// point: RUNTIME already self-updates per-file via stale-while-
// revalidate (see the fetch handler below), so it never needed to be
// tied to app-shell versioning at all. Giving it a fixed name instead
// means it now survives every future CACHE_VERSION bump — a portrait
// only has to be fetched over the network once, ever, not once per
// deploy.
const RUNTIME = 'crimson-tide-runtime';

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
  './scripts/fair-tide-grooming-room.js',
  './scripts/fair-tide-companion-rooms.js',
  './scripts/harbour-and-arc14.js',
  './scripts/achievements.js',
  './scripts/tide-network.js',
  './scripts/arc15-and-voyage-fixes.js',
  './scripts/arc16-and-bonding.js',
  './scripts/clan-settlement-and-sw.js',
  './scripts/raid-mode.js',
  './scripts/voyage-group-encounters.js',
  './scripts/midnight-backup.js',
  './scripts/unknown-location-ui-fixes.js',
  './scripts/arc16-world-systems.js',
  './scripts/arc17.js',
  './scripts/pirate-cove.js',
  './scripts/character-bios.js',
  './scripts/fleet-trade-routes.js',
  './scripts/rumor-market-effects.js',
  './scripts/voyage-insurance.js',
  './scripts/fleet-ship-stats-repair.js',
  './scripts/local-port-standing.js',
  './scripts/quest-tracker-widget.js',
  './scripts/hang-out-san-joel.js',
  './scripts/hang-out-crew-trio.js',
  './scripts/hang-out-san-joy.js',
  './scripts/hang-out-companions.js',
  './scripts/dre-wedding.js',
  './scripts/fairtide-office-network.js',
  './scripts/fair-tide-requests-visibility.js',
  './scripts/arc17-archive-hub.js',
  './scripts/arc17-research.js',
  './scripts/arc17-renn-origin.js',
  './scripts/arc17-farseer-layer.js',
  './scripts/world-catalogue.js',
  './scripts/arc18.js',
  './scripts/arc18-horizon-charter.js',
  './scripts/arc18-factions-agreements.js',
  './scripts/arc18-fair-tide-council.js',
  './scripts/arc18-horizon-engine-security.js',
  './scripts/arc19.js',
  './scripts/arc20.js',
  './scripts/arc20-interlude.js',
  './scripts/arc21.js',
  './scripts/arc21-council-hall.js',
  './scripts/arc21-harbour-office.js',
  './scripts/arc21-market-quarter.js',
  './scripts/arc21-supply-house.js',
  './scripts/arc21-medical-house.js',
  './scripts/arc21-workshop.js',
  './scripts/arc21-wardens-hall.js',
  './scripts/arc21-route-observatory.js',
  './scripts/arc21-horizon-chamber.js',
  './scripts/arc21-route-preparation.js',
  './scripts/arc21-commons.js',
  './scripts/arc21-ledger.js',
  './scripts/arc22.js',
  './scripts/arc22-maera-mechanics.js',
  './scripts/arc23.js',
  './scripts/arc23-mechanics.js',
  './scripts/rival-disposition.js',
  './scripts/crafting.js',
  './scripts/bestiary.js',
  './scripts/arc16-forest-coast.js',
  './scripts/arc16-dragon-mountain.js',
  './scripts/arc16-crystal-old.js',
  './scripts/arc24.js',
  './scripts/arc24-mechanics.js',
  './scripts/arc25.js',
  './scripts/arc26.js',
  './scripts/arc26-mechanics.js',
  './scripts/arc27.js',
  './scripts/arc27-mechanics.js',
  './scripts/arc28.js',
  './scripts/arc28-mechanics.js',
  './scripts/arc29.js',
  './scripts/arc29-mechanics.js',
  './scripts/arc30.js',
  './scripts/arc30-mechanics.js',
  './scripts/arc31.js',
  './scripts/arc31-mechanics.js',
  './scripts/arc32.js',
  './scripts/arc32-mechanics.js',
  './scripts/arc33.js',
  './scripts/arc33-mechanics.js',
  './scripts/arc34.js',
  './scripts/arc34-mechanics.js',
  './scripts/arc35.js',
  './scripts/arc35-mechanics.js',
  './scripts/arc36.js',
  './scripts/arc36-mechanics.js',
  './scripts/arc37.js',
  './scripts/arc37-mechanics.js',
  './scripts/fair-tide-mood.js',
  './scripts/veyren-weather.js',
  './scripts/real-calendar-events.js',
  './scripts/festival-drops.js',
  './scripts/character-birthdays.js',
  './scripts/san-joel-anniversary.js',
  './scripts/fair-tide-flavour-events.js',
  './scripts/fair-tide-ally-network.js',
  './scripts/nursery-care-flavour-events.js',
  './scripts/tide-stories.js',
  './scripts/fair-tide-hobbies.js',
  './scripts/fair-tide-crew-conversations.js',
  './scripts/fair-tide-port-visitors.js',
  './scripts/fair-tide-live-activity-feed.js',
  './scripts/archive-nav-button.js',
  './scripts/fair-tide-chronicle.js',
  './scripts/settlement-memories.js',
  './scripts/fair-tide-food-culture.js',
  './scripts/fair-tide-time-of-day.js',
  './scripts/fair-tide-soel-sightings.js',
  './scripts/stories-from-other-worlds.js',
  './scripts/ship-personality.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => {
        // BUG FIX (San's report — app wouldn't open at all, needed a
        // full delete+reinstall to recover): cache.addAll() is atomic —
        // if even ONE of the ~54 URLs below fails to fetch (a missing
        // icon, a renamed script, any 404), the entire install event
        // rejects and the service worker never successfully installs at
        // all. That leaves the browser stuck serving whatever
        // (possibly broken, possibly nonexistent) service worker state
        // it had before, with no way to recover except removing the app
        // entirely and starting over — which matches San's exact
        // symptom. Caching each file independently instead, each
        // wrapped in its own .catch(), means one missing asset (5 icon
        // files were confirmed missing at the time of this fix) just
        // gets skipped and logged rather than taking down the whole
        // install — and protects against the same failure recurring
        // from any future missing or renamed file in this list.
        return Promise.all(
          PRECACHE_URLS.map(url =>
            cache.add(url).catch(err => {
              console.warn('[SW] Skipping failed precache URL:', url, err && err.message);
            })
          )
        );
      })
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

  // BUG FIX (San's report — app wouldn't open after a phone reboot, no
  // error, just flashed and closed): found by diffing against Legends of
  // Daybreak's own sw.js, which never has this problem. That game has
  // exactly one game.js and its network-first fetch has NO timeout at all
  // — it just waits for the real result. This file's own network-first
  // rule below used to apply a 3-second timeout to EVERY individual
  // app-shell request, and isAppShellRequest() matches each of this
  // game's ~120 separate script files, not just the page itself. Right
  // after a reboot the network is often slow to stabilize but not
  // actually dead — and a request that took, say, 4 seconds would get
  // silently abandoned at the 3-second mark (Promise.race doesn't cancel
  // the loser, it just stops waiting for it) and replaced by the
  // hardcoded "You're offline" HTML fallback below, served AS IF it were
  // that script's real content. A browser handed HTML where it expected
  // JavaScript throws immediately — and if that happened to core-
  // engine.js, loaded first with everything else depending on it, the
  // whole app fails to initialize. One file with no timeout never hits
  // this; ~120 files each racing a 3-second clock hits it constantly
  // under exactly the slow-but-recovering network a reboot produces.
  //
  // Fix: keep the navigation itself (the actual HTML document — one
  // request per load) on network-first with the timeout/fallback, since
  // genuinely hanging connections still need to time out somewhere. But
  // script/app-shell files now use stale-while-revalidate instead, same
  // proven pattern already used for images below: serve the cached copy
  // instantly (immune to however slow or flaky the network is right
  // now), and always kick off a background fetch to refresh the cache
  // for next time. A script is never blocked on fresh network success to
  // render at all — it just updates a session later instead of this one,
  // which is a fair trade against the app not opening at all.
  if (req.mode === 'navigate') {
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

  if (isAppShellRequest(new URL(req.url))) {
    event.respondWith(
      caches.match(req).then(cached => {
        const network = fetch(req).then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(PRECACHE).then(cache => cache.put(req, copy));
          }
          return res;
        }).catch(() => cached);
        return cached || network;
      })
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
