//Cache version name
var cacheName = 'v0.3:static';

//Cache static assets during installation
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        'index.html',
        'assets/css/main.css',
        'assets/js/app.js',
        'assets/img/check-blank.svg',
        'assets/img/check-marked.svg'
      ]).then(function() {
        self.skipWaiting();
      });
    })
  );
});

//Fetch the page or load from cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        //retrieve from cache
        return response;
      }
      //fetch as normal
      return fetch(event.request);
    })
  );
});
