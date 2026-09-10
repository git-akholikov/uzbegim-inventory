/* Uzbegim Inventory — service worker
   Caches the app shell (this is a single-file bundled app: index.html has
   everything but the two CDN scripts inlined) so it still opens when the
   phone has no signal. Bump CACHE_NAME whenever you ship a change so old
   phones pick up the new file instead of a stale cached copy. */
var CACHE_NAME = 'uzbegim-inv-v8';
var SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './manager.html',
  './manifest-manager.json',
  './icon-192-manager.png',
  './icon-512-manager.png',
  './icon-maskable-512-manager.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){ return cache.addAll(SHELL); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(names.filter(function(n){ return n!==CACHE_NAME; }).map(function(n){ return caches.delete(n); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

// Same-origin app-shell files: network first (so you always get the latest
// once online), falling back to the cached copy the moment the network fails.
// Cross-origin requests (the jsPDF / barcode-scanner CDN scripts) are left
// alone — those two features simply need a connection, same as before.
self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    fetch(req).then(function(res){
      var copy = res.clone();
      caches.open(CACHE_NAME).then(function(cache){ cache.put(req, copy); });
      return res;
    }).catch(function(){
      return caches.match(req).then(function(cached){
        return cached || caches.match('./index.html');
      });
    })
  );
});
