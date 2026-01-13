const CACHE_NAME = 'gambia-visual-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/js/main.js',
    '/js/ui.js',
    '/js/map.js',
    '/js/animations.js',
    '/js/state.js',
    '/js/error-handler.js',
    '/manifest.json',
    '/assets/crocodile.svg',
    '/assets/bird.svg',
    '/assets/shores.svg',
    '/assets/forest.svg',
    '/assets/wassu.svg',
    '/assets/kunta-kinteh.svg',
    '/assets/albert-market.svg',
    '/assets/janjanbureh.svg',
    '/assets/og-image.jpg',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Stale-While-Revalidate strategy
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // Only cache valid responses
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            });

            // Return cached response immediately if available, otherwise wait for network
            return cachedResponse || fetchPromise;
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
