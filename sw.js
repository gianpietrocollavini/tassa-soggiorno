// Tiene una copia dell'app sul dispositivo, così funziona anche senza internet.
// Cambiare VERSIONE a ogni aggiornamento dei file.
const VERSIONE = "tassa-soggiorno-1.2";
const FILE = ["./", "index.html", "manifest.webmanifest", "icone/icona-32.png", "icone/icona-180.png", "icone/icona-192.png", "icone/icona-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSIONE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Prima la rete (per ricevere gli aggiornamenti), poi la copia salvata se manca internet.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const copy = r.clone(); caches.open(VERSIONE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
