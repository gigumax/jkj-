const CACHE_NAME = 'explore-build-v2';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './game.js',
    './icons.js',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.149.0/three.min.js',
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS).catch(() => {}))
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
    e.respondWith(
        caches.match(e.request).then((cached) => {
            return cached || fetch(e.request).then((resp) => {
                if (resp && resp.status === 200 && e.request.method === 'GET') {
                    const clone = resp.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
                }
                return resp;
            }).catch(() => cached);
        })
    );
});
