//Cache version name
var cacheName = 'v0.11:static';

var cacheFiles = [
  '200.html',
  'css/main.css',
  'js/app.js',
  'fonts/Roboto/Roboto-400.woff',
  'fonts/Roboto/Roboto-500.woff',
  'img/add.svg',
  'img/arrow-forward.svg',
  'img/check-blank.svg',
  'img/check-marked.svg',
  'img/close.svg',
  'img/menu.svg',
  'img/more.svg',
  'img/more-w.svg',
  'img/tudu-logo.svg'
]

//Cache static assets during installation
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(cacheFiles)
      .then(function() {
        self.skipWaiting();
      });
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(thisCacheName) {
        if (thisCacheName !== cacheName) {
          // Delete previus cache version
          return caches.delete(thisCacheName);
        }
      }));
    })
  );
});

//Fetch the page or load from cache
self.addEventListener('fetch', function(e) {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(function(exception) {
        console.error('Fetch failed; returning offline page instead.', exception);

        return caches.open(cacheName).then(function(cache) {
          return cache.match('/');
        });
      })
    )
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
