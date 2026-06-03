const CACHE_NAME = 'tr-pwa-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // กรองเฉพาะ GET — POST/PUT/DELETE ไม่ cache (cache.put รองรับแค่ GET)
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // ข้าม cross-origin (เช่น iframe เข้า script.google.com)
  if (url.origin !== location.origin) return;

  // Network-first → fallback cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // เก็บเฉพาะ response สมบูรณ์ (status 200, basic)
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone).catch(() => {});
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
