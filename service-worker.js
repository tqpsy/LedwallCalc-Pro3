// LEDWall Calculator Pro — Service Worker
// Cache "app shell" per funzionamento offline e installazione come app
// (Aggiungi a Home su smartphone, Installa app su Windows/Chrome/Edge).

const CACHE_NAME = 'ledwall-calc-pro-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './iconledwallcalcpro.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Strategy: network-first per index.html (per avere sempre l'ultima versione online),
// cache-first per tutto il resto (icone, manifest, font/script esterni già scaricati).
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isCoreDoc = url.origin === self.location.origin &&
    (url.pathname.endsWith('/') || url.pathname.endsWith('index.html'));

  if (isCoreDoc) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        // Cache anche le risorse esterne (font, jsPDF, html2canvas) al primo utilizzo
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
