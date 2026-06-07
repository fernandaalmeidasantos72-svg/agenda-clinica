const CACHE = "agenda-clinica-v2";
const FILES = [
  "/agenda-clinica/",
  "/agenda-clinica/index.html",
  "/agenda-clinica/manifest.json",
  "/agenda-clinica/icon-192.png",
  "/agenda-clinica/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match("/agenda-clinica/index.html")))
  );
});
