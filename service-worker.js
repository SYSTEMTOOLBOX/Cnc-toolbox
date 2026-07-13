const CACHE_NAME='cnc-toolbox-v3-9';
const ASSETS=[
  './',
  './index.html?v=3.9',
  './manifest.webmanifest?v=3.9',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache=>cache.addAll(ASSETS))
      .catch(()=>Promise.resolve())
  );
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;

  event.respondWith(
    fetch(event.request,{cache:'no-store'})
      .then(response=>{
        const copy=response.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)).catch(()=>{});
        return response;
      })
      .catch(async()=>{
        const cached=await caches.match(event.request);
        if(cached)return cached;
        return caches.match('./index.html?v=3.9') || caches.match('./index.html');
      })
  );
});
