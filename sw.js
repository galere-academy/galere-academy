// Galère Academy : fonctionne hors connexion
const CACHE = "galere-v20261105e";
const FILES = ["./","index.html","app/","app/index.html","media/pub.jpg","media/qr.svg","mentions-legales.html","fonts/fonts.css","fonts/atkinson-hyperlegible-latin-400-italic.woff2","fonts/atkinson-hyperlegible-latin-400-normal.woff2","fonts/atkinson-hyperlegible-latin-700-normal.woff2","fonts/atkinson-hyperlegible-latin-ext-400-italic.woff2","fonts/atkinson-hyperlegible-latin-ext-400-normal.woff2","fonts/atkinson-hyperlegible-latin-ext-700-normal.woff2","fonts/bricolage-grotesque-latin-600-normal.woff2","fonts/bricolage-grotesque-latin-800-normal.woff2","fonts/bricolage-grotesque-latin-ext-600-normal.woff2","fonts/bricolage-grotesque-latin-ext-800-normal.woff2","manifest.webmanifest","data/annuaire.json","data/communes.json","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if(e.request.method !== "GET") return;
  if(u.origin === location.origin){
    if(e.request.mode === "navigate" || u.pathname.endsWith("index.html")) e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match(u.pathname.includes("/app") ? "app/index.html" : "index.html"))));
    else if(!u.pathname.endsWith(".mp4")) e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
