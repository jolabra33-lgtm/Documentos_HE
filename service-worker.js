/* ---- Service Worker del Archivo de Fuentes -------------------------------
   Necesario para que el navegador considere el sitio "instalable" como PWA
   y para que la aplicación pueda abrirse sin conexión una vez visitada.

   Estrategia:
   - Páginas HTML (navegación): red primero, y si falla (sin conexión) se
     sirve la copia guardada en caché. Así, estando online, siempre se ve
     la versión más reciente publicada en GitHub Pages; offline, se abre
     la última versión visitada.
   - Resto de recursos (imágenes, manifest, fuentes, iconos): caché primero
     y actualización en segundo plano (stale-while-revalidate), para que
     carguen al instante y se mantengan al día sin bloquear la carga.

   IMPORTANTE: sube este archivo a la raíz del repositorio, junto a
   index.html. Un service worker solo puede controlar los archivos que
   están en su misma carpeta o por debajo de ella. -------------------- */

const CACHE_VERSION = 'archivo-fuentes-v1';

const APP_SHELL = [
  './',
  'index.html',
  'manifest.json',
  'images/icon-192.png',
  'images/icon-512.png',
  'images/icon-512-maskable.png',
  'images/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Navegación entre páginas (abrir index.html o cualquier unidad-XX.html)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((res) => res || caches.match('index.html')))
    );
    return;
  }

  // Resto de peticiones GET (mismo origen o no): caché primero,
  // refrescando en segundo plano.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
