self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', event => {
  // ให้ทุก request ผ่านตามปกติ ไม่ cache
  return;
});
