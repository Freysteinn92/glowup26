const CACHE_NAME = 'glowup-app-v2'; // Bumped version to v2
const urlsToCache = [
  './index.html',
  './manifest.json'
];

// Install: Force the new service worker to take over immediately
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate: Delete any old caches (v1) instantly
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName); // Wipe the old version
          }
        })
      );
    })
  );
  self.clients.claim(); // Control the page immediately
});

// Fetch: Try Network First, then Cache (Better for real-time updates)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
