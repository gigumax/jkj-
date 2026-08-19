const CACHE_NAME = 'explore-build-v8';
const PRECACHE = [
    './style.css',
    './icons.js',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.149.0/three.min.js',
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE).catch(() => {}))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((k) => k !== CACHE_NAME ? caches.delete(k) : null));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    const { request } = e;
    // Always fetch index.html and game.js from the network first to avoid stale code
    if (request.destination === 'document' || request.url.includes('game.js')) {
        e.respondWith(
            fetch(request).then((resp) => {
                if (resp && resp.status === 200 && request.method === 'GET') {
                    const clone = resp.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return resp;
            }).catch(() => caches.match(request))
        );
        return;
    }
    e.respondWith(
        caches.match(request).then((cached) => {
            return cached || fetch(request).then((resp) => {
                if (resp && resp.status === 200 && request.method === 'GET') {
                    const clone = resp.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return resp;
            }).catch(() => cached);
        })
    );
});
