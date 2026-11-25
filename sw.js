// Service worker de Entrelíneas 3.0.1. Lo genera tools/pwa.mjs: no se edita a mano.
const CACHE = 'entrelineas-v3.0.1-bbbb221d'
const ARCHIVOS = ["./","./app-DKo2_yDb.js","./apple-touch-icon.png","./atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2","./atkinson-hyperlegible-latin-700-normal-GZI4o3u0.woff2","./icono-192.png","./icono-512.png","./icono-maskable-512.png","./index-Bz4VJ3th.css","./index.html","./literata-latin-400-italic-BxdXY0No.woff2","./literata-latin-400-normal-CLtNJ872.woff2","./literata-latin-700-normal-DYBWKELl.woff2","./manifest.webmanifest","./parte-BbMdcw0p.js","./parte-BdIgrs-h.js","./parte-DOwCrGXH.js"]

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.registration.active ? null : self.skipWaiting()))
})
self.addEventListener('message', e => { if (e.data === 'actualizar') self.skipWaiting() })
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('entrelineas-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()))
})
// Otras apps del mismo sitio de GitHub comparten el almacén de cachés y alguna puede borrar la nuestra:
// al abrir la app con internet, si falta, se vuelve a guardar completa.
const asegurar = () => caches.has(CACHE).then(h => h ? null : caches.open(CACHE).then(c => c.addAll(ARCHIVOS))).catch(() => null)
const deRed = r => fetch(r).then(res => {
  if (res.ok && res.type === 'basic') { const copia = res.clone(); caches.open(CACHE).then(c => c.put(r, copia)) }
  return res
})
self.addEventListener('fetch', e => {
  const r = e.request
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return
  if (new URL(r.url).pathname.indexOf(new URL(self.registration.scope).pathname) !== 0) return
  if (r.mode === 'navigate') {
    e.waitUntil(asegurar())
    e.respondWith(caches.match('./', { cacheName: CACHE }).then(res => res || fetch(r)).catch(() => fetch(r)))
    return
  }
  e.respondWith(caches.match(r, { cacheName: CACHE, ignoreSearch: true }).then(res => res || deRed(r)))
})
