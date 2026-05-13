/* ====================================================
   SERVICE WORKER — Robust Offline Support
   ====================================================
   Strategy:
   - On install: pre-cache all app shell files (HTML/CSS/JS/images/audio).
   - On first online run: cache ALL fetched resources including:
     * Google Fonts CSS (from fonts.googleapis.com)
     * Google Fonts WOFF2 files (from fonts.gstatic.com)
   - On subsequent runs (online or offline): serve from cache first.
   - Use both standard responses AND opaque (no-cors) ones to ensure
     cross-origin font files cache even when CORS is unfriendly.
   ==================================================== */

const CACHE_NAME = 'card-game-v5';

// Pre-cached app assets (relative paths only — same origin)
const APP_ASSETS = [
  './',
  './index.html',
  './style.css',
  './game.js',
  './images/001.jpeg',
  './images/card_2.jpeg',
  './images/card_3.jpeg',
  './images/card_4.jpeg',
  './images/card_5.jpeg',
  './images/card_6.jpeg',
  './images/card_7.jpeg',
  './images/card_8.jpeg',
  './images/card_9.jpeg',
  './images/card_10.jpeg',
  './images/card_J.jpeg',
  './images/card_Q.jpeg',
  './images/card_K.jpeg',
  './images/card_A.jpeg',
  './audio/voice_2.wav',
  './audio/voice_3.wav',
  './audio/voice_4.wav',
  './audio/voice_5.wav',
  './audio/voice_6.wav',
  './audio/voice_7.wav',
  './audio/voice_8.wav',
  './audio/voice_9.wav',
  './audio/voice_10.wav',
  './audio/voice_J.wav',
  './audio/voice_Q.wav',
  './audio/voice_K.wav',
  './audio/voice_A.wav'
];

// Cross-origin assets we want to cache when first encountered
const EXTERNAL_PREFIXES = [
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com/'
];

function isExternalCacheable(url) {
  return EXTERNAL_PREFIXES.some((p) => url.startsWith(p));
}

// ---------- INSTALL ----------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cache each app asset individually so one missing file doesn't break install
      await Promise.all(
        APP_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('SW install: skipped', url, err && err.message);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// ---------- ACTIVATE ----------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// ---------- FETCH ----------
// Cache-first for everything; if a request is not in cache, try network and
// stash the result for next time. If network fails, fall back gracefully.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = req.url;
  const isFontReq = isExternalCacheable(url);

  event.respondWith(
    caches.match(req, { ignoreSearch: false }).then((cached) => {
      if (cached) return cached;

      // For cross-origin font requests, fetch with no-cors so we get
      // an OPAQUE response we can still cache and serve later.
      const fetchReq = isFontReq
        ? new Request(url, { mode: 'no-cors', credentials: 'omit' })
        : req;

      return fetch(fetchReq)
        .then((response) => {
          if (!response) return response;

          // Cache successful responses + any opaque (cross-origin no-cors) ones
          const shouldCache =
            response.status === 200 ||
            response.type === 'opaque'; // opaque has status 0

          if (shouldCache) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, clone).catch(() => { /* quota or other */ });
            });
          }
          return response;
        })
        .catch(() => {
          // Network unavailable. For navigations, return cached index.html.
          if (req.destination === 'document' || req.mode === 'navigate') {
            return caches.match('./index.html');
          }
          // For images: return a tiny transparent fallback so the page doesn't break
          if (req.destination === 'image') {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }
          // For everything else, return an empty response so promises resolve
          return new Response('', { status: 504, statusText: 'Offline' });
        });
    })
  );
});

// ---------- MESSAGE (manual cache-warming hook) ----------
// Page can post {type: 'WARM_CACHE', urls: [...]} to force-cache extras
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'WARM_CACHE' && Array.isArray(data.urls)) {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) =>
        Promise.all(
          data.urls.map((url) =>
            cache.add(url).catch(() => { /* ignore individual failures */ })
          )
        )
      )
    );
  }
});
