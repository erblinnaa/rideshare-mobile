const PUBLIC_CACHE = "rideshare-public-v1";
const OFFLINE_URL = "/offline.html";
const MANIFEST_URL = "/manifest.webmanifest";
const TRIP_API_PATH = "/api/udhetimet";
const PUBLIC_ASSETS = [
  OFFLINE_URL,
  MANIFEST_URL,
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

async function cachePublicAssets() {
  const cache = await caches.open(PUBLIC_CACHE);

  await Promise.all(
    PUBLIC_ASSETS.map(async (asset) => {
      try {
        const response = await fetch(asset, { cache: "no-store" });
        if (response.ok) {
          await cache.put(asset, response);
        }
      } catch {
        // Një aset i vetëm nuk duhet ta pengojë instalimin e service worker-it.
      }
    }),
  );
}

async function responseWithHeaders(response, extraHeaders) {
  const headers = new Headers(response.headers);
  Object.entries(extraHeaders).forEach(([name, value]) => {
    headers.set(name, value);
  });

  return new Response(await response.clone().blob(), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function ruajPergjigjenEListes(cache, response) {
  const headers = new Headers(response.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("X-RideShare-Saved-At", new Date().toISOString());
  headers.set("X-RideShare-Source", "network");

  await cache.put(
    TRIP_API_PATH,
    new Response(await response.clone().blob(), {
      status: response.status,
      statusText: response.statusText,
      headers,
    }),
  );
}

async function lexoFallbackunEListes(cache) {
  const cached = await cache.match(TRIP_API_PATH);
  if (!cached) return null;

  return responseWithHeaders(cached, {
    "X-RideShare-Source": "cache",
  });
}

async function networkFirstLista(request) {
  const cache = await caches.open(PUBLIC_CACHE);

  try {
    const publicRequest = new Request(request, {
      cache: "no-store",
      credentials: "omit",
    });
    const response = await fetch(publicRequest);

    if (response.ok) {
      await ruajPergjigjenEListes(cache, response);
      return response;
    }

    return (await lexoFallbackunEListes(cache)) ?? response;
  } catch {
    const fallback = await lexoFallbackunEListes(cache);
    if (fallback) return fallback;

    return new Response(JSON.stringify([]), {
      status: 503,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-RideShare-Source": "empty",
      },
    });
  }
}

async function networkFirstNavigation(request) {
  try {
    return await fetch(request);
  } catch {
    const offline = await caches.match(OFFLINE_URL);
    if (offline) return offline;

    return new Response("RideShare është offline.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

async function cacheFirstPublicAsset(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  return fetch(request);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    cachePublicAssets().then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith("rideshare-public-") &&
                key !== PUBLIC_CACHE,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname === TRIP_API_PATH) {
    event.respondWith(networkFirstLista(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (PUBLIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirstPublicAsset(request));
  }
});
