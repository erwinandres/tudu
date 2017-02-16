//Cache version name
var cacheName = 'v0.3:static';

var cacheFiles = [
  'index.html',
  'css/main.css',
  'js/app.js',
  'fonts/Roboto/Roboto-400.woff',
  'fonts/Roboto/Roboto-500.woff',
  'img/add.svg',
  'img/check-blank.svg',
  'img/check-marked.svg',
  'js/close.svg',
  'js/menu.svg',
  'js/more.svg',
  'js/tudu-logo.svg'
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
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if (response) {
        //retrieve from cache
        return response;
      }
      //fetch as normal
      return fetch(e.request);
    })
  );
});
