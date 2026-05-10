/**
 * Echonomix PWA Service Worker
 * Strategy:
 *   - Precache the app shell on install
 *   - Network-only for CoinGecko price API (always fresh)
 *   - Network-first for HTML (so updates land fast)
 *   - Stale-while-revalidate for fonts and third-party imagery
 *   - Cache-first for same-origin static assets
 */

const VERSION = 'echonomix-v1.4.0';
const SHELL_CACHE = `${VERSION}-shell`;
const STATIC_CACHE = `${VERSION}-static`;
const FONT_CACHE = `${VERSION}-fonts`;
const IMG_CACHE = `${VERSION}-images`;

const SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/board/board-prototype.jpg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512-maskable.png',
  '/apple-touch-icon.png',
  '/favicon.ico',
  '/favicon-32.png',
  '/favicon-16.png',
  '/og-image.png',
  '/llms.txt',
  '/llms-full.txt',
  '/robots.txt',
  '/sitemap.xml'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.startsWith(VERSION))
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

function isHTML(req) {
  return req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
}
function isFont(url) {
  return /fonts\.(googleapis|gstatic)\.com/.test(url.hostname);
}
function isPriceAPI(url) {
  // CoinGecko free public API - must always be live
  return /api\.coingecko\.com/.test(url.hostname);
}
function isThirdPartyImage(url) {
  return (
    /cdn\.jsdelivr\.net/.test(url.hostname) ||
    /media\.swipepages\.com/.test(url.hostname) ||
    /www\.google\.com/.test(url.hostname)
  );
}
function isSameOriginStatic(url) {
  return url.origin === self.location.origin &&
    /\.(png|jpg|jpeg|svg|ico|webp|gif|json|css|js|woff2?)$/i.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1) Live price API: never cache, always fetch fresh
  if (isPriceAPI(url)) {
    event.respondWith(
      fetch(req).catch(() => new Response('{}', { headers: { 'content-type': 'application/json' } }))
    );
    return;
  }

  // 2) HTML: network-first, fall back to cache, fall back to / shell
  if (isHTML(req)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match('/')))
    );
    return;
  }

  // 3) Fonts: stale-while-revalidate
  if (isFont(url)) {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const network = fetch(req).then((res) => {
            cache.put(req, res.clone()).catch(() => {});
            return res;
          }).catch(() => cached);
          return cached || network;
        })
      )
    );
    return;
  }

  // 4) Third-party imagery (coin icons, banner, brand favicons): stale-while-revalidate
  if (isThirdPartyImage(url)) {
    event.respondWith(
      caches.open(IMG_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const network = fetch(req).then((res) => {
            if (res && (res.ok || res.type === 'opaque')) {
              cache.put(req, res.clone()).catch(() => {});
            }
            return res;
          }).catch(() => cached);
          return cached || network;
        })
      )
    );
    return;
  }

  // 5) Same-origin static: cache-first
  if (isSameOriginStatic(url)) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        });
      })
    );
    return;
  }

  // Default: pass-through
});
