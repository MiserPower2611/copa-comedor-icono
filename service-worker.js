const CACHE_NAME =
  "copa-comedor-v1";


const ARCHIVOS_CACHE = [

  "./",

  "./index.html",

  "./manifest.json",

  "./copa_comedor_180.png",

  "./copa_comedor_192.png",

  "./copa_comedor_512.png"

];


// =====================================
// INSTALACIÓN
// =====================================

self.addEventListener(
  "install",
  function(event) {

    event.waitUntil(

      caches
        .open(CACHE_NAME)
        .then(
          function(cache) {

            return cache.addAll(
              ARCHIVOS_CACHE
            );

          }
        )
        .then(
          function() {

            return self.skipWaiting();

          }
        )

    );

  }
);


// =====================================
// ACTIVACIÓN
// =====================================

self.addEventListener(
  "activate",
  function(event) {

    event.waitUntil(

      caches
        .keys()
        .then(
          function(nombresCache) {

            return Promise.all(

              nombresCache.map(
                function(nombre) {

                  if (
                    nombre !==
                    CACHE_NAME
                  ) {

                    return caches.delete(
                      nombre
                    );

                  }

                }
              )

            );

          }
        )
        .then(
          function() {

            return self.clients.claim();

          }
        )

    );

  }
);


// =====================================
// PETICIONES
// =====================================

self.addEventListener(
  "fetch",
  function(event) {

    const url =
      new URL(
        event.request.url
      );


    // Solo controlamos archivos
    // pertenecientes a GitHub Pages.
    //
    // La aplicación de Apps Script
    // está en otro dominio y debe
    // seguir funcionando directamente
    // desde Google.

    if (
      url.origin !==
      self.location.origin
    ) {

      return;

    }


    event.respondWith(

      caches
        .match(
          event.request
        )
        .then(
          function(respuestaCache) {

            if (
              respuestaCache
            ) {

              return respuestaCache;

            }


            return fetch(
              event.request
            );

          }
        )

    );

  }
);
