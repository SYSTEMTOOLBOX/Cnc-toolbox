const CACHE_NAME = 'cnc-toolbox-v1-3-vera';
const FILES = ['./','./index.html','./manifest.webmanifest','./service-worker.js','./icon-192.png','./icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')) {
    e.respondWith(fetch(e.request).then(resp => { const copy = resp.clone(); caches.open(CACHE_NAME).then(c => c.put(e.request, copy)); return resp; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => { const copy = resp.clone(); caches.open(CACHE_NAME).then(c => c.put(e.request, copy)); return resp; }).catch(() => caches.match('./index.html'))));
});
