const CACHE_NAME = 'awc-warehouse-tool-v17-full-pro';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE)).catch(() => Promise.resolve())
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          if (!response) return response;

          const shouldCache =
            response.status === 200 &&
            (response.type === 'basic' || event.request.url.includes('cdnjs.cloudflare.com'));

          if (shouldCache) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
          }

          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
