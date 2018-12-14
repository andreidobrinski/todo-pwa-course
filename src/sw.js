
workbox.skipWaiting()
workbox.clientsClaim()

self.addEventListener('install', event => {
  const asyncInstall = new Promise(resolve => {
    console.log("Waiting to resolve...")
    setTimeout(resolve, 1000)
  })

  event.waitUntil(asyncInstall)
})

self.addEventListener('activate', event => {
  console.log("activate")
})

self.addEventListener('fetch', event => {
  if(event.request.method === "POST" || event.request.method === "DELETE") {
    event.respondWith(
      fetch(event.request).catch(err => {
        return new Response(
          JSON.stringify({ error: "This action disabled while app is offline" }), {
            headers: { 'Content-Type': 'application/json' }
          }
        )
      })
    )
  }
})

workbox.routing.registerRoute(
  new RegExp('(http|https):.*min\.(css|js)'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'cdn-cache'
  })
)

workbox.routing.registerRoute(
  new RegExp('http://.*:8080.*\.json'),
  workbox.strategies.networkFirst()
)

workbox.precaching.precacheAndRoute(self.__precacheManifest || [])
