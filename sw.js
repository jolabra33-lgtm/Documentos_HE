// Service worker mínimo: solo existe para cumplir el requisito de
// instalabilidad de Chrome (manifest + service worker con "fetch").
// No cachea nada de forma agresiva a propósito, para que las 11
// unidades se sigan sirviendo siempre actualizadas desde la red.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
