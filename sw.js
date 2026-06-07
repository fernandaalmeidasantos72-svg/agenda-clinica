const CACHE = "agenda-clinica-v4";
const FILES = [
  "/agenda-clinica/",
  "/agenda-clinica/index.html",
  "/agenda-clinica/manifest.json",
  "/agenda-clinica/icon-192.png",
  "/agenda-clinica/icon-512.png"
];

// Na instalação: guarda todos os arquivos no cache
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

// Na ativação: apaga caches antigos
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Nas requisições: tenta internet primeiro, se falhar usa cache
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Salva cópia fresca no cache
        const clone = response.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return response;
      })
      .catch(() => {
        // Sem internet: usa cache
        return caches.match(e.request)
          .then(r => r || caches.match("/agenda-clinica/index.html"));
      })
  );
});
