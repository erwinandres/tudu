"use strict";

//Register service worker if available.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then(function(reg) {
      console.log('Succsessfully regitered service worker', reg);
    })
    .catch(function(err) {
      console.warn('Error whilst registering service worker', err);
    });
  navigator.serviceWorker.ready.then(function(reg) {
    console.log('Service worker ready');
  });
}
