// Shell-only service worker: precaches the app shell + engine vendor
// bytes on install; binary pack in Cache API, structured data in
// IndexedDB (P1 pattern). Shell-first, vendor cache-first, versioned.
const VERSION = 'v1';
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg'];
const VENDOR = ['/vendor/swe.wasm', '/vendor/sepl_18.se1', '/vendor/semo_18.se1', '/vendor/seas_18.se1'];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(VERSION).then((c) => c.addAll([...SHELL, ...VENDOR]).catch(() => c.addAll(SHELL))),
  );
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))),
  );
});

self.addEventListener('fetch', (ev) => {
  const url = new URL(ev.request.url);
  if (url.origin !== location.origin) return;
  ev.respondWith(
    caches.match(ev.request).then((hit) => {
      if (hit) return hit;
      return fetch(ev.request).then((res) => {
        if (url.pathname.startsWith('/vendor/') && res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(ev.request, copy));
        }
        return res;
      });
    }),
  );
});
