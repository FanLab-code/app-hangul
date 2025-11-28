/*
  sw.js
  Le Service Worker permet à l'application de fonctionner hors ligne.
  Il agit comme un intermédiaire entre l'app et internet.
*/

const CACHE_NAME = 'hangul-app-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json'
];

// 1. Installation : On met en cache les fichiers essentiels
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installation');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Mise en cache des fichiers');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Activation : On nettoie les anciens caches si besoin
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activation');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Suppression de l\'ancien cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

// 3. Interception des requêtes (Fetch)
self.addEventListener('fetch', (event) => {
    // Stratégie : Cache First, falling back to Network
    // On regarde d'abord dans le cache, si on trouve pas, on va sur internet.
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
