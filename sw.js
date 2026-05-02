const CACHE_NAME = 'ai-analytik-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/app.js',
  './js/api.js',
  './js/charts.js',
  './js/config.js',
  './js/mock.js',
  './js/router.js',
  './js/store.js',
  './js/telegram.js',
  './js/views/home.js',
  './js/views/products.js',
  './js/views/analytics.js',
  './js/views/ai.js',
  './js/views/profile.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        return cached || caches.match('./index.html');
      })
  );
});
