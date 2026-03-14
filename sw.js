const CACHE = 'tms-shell-v1';

// cache เฉพาะ shell files — ไม่ cache GAS (เปลี่ยนบ่อย)
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // GAS requests → ผ่านตรงไป network เสมอ (ไม่ cache)
  if (e.request.url.includes('script.google.com')) return;

  // shell files → cache first
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
