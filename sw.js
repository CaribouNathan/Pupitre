// Pupitre en ligne — service worker : tout le site est mis en cache pour fonctionner hors ligne.
// La liste des fichiers est injectée à la compilation (vite.web.config.ts).
const VERSION = '3.14.0-8abcf5c7';
const PRECACHE = ["./","./aide.html","./apple-touch-icon.png","./assets/01-cp-c28ca3c577.js","./assets/02-ce1-c275c43cf8.js","./assets/03-ce2-c242c875c1.js","./assets/04-cm1-c3e3a0e014.js","./assets/05-cm2-c3ed567625.js","./assets/06-6e-c3a8f3ae8a.js","./assets/07-5e-c4bf4bdff3b.js","./assets/08-4e-c4b1739b15f.js","./assets/09-3e-c4b394401fd.js","./assets/10-2nde-c5b4300dab7.js","./assets/11-1re-c5b35bf1ca5.js","./assets/12-term-c5bd9a46365.js","./assets/20-formats-riches-c596620c15.js","./assets/21-italien-c43d00335b.js","./assets/30-gen-01-cp-c28ca3c577.js","./assets/30-gen-02-ce1-c275c43cf8.js","./assets/30-gen-03-ce2-c242c875c1.js","./assets/30-gen-04-cm1-c3e3a0e014.js","./assets/30-gen-05-cm2-c3ed567625.js","./assets/30-gen-06-6e-c3a8f3ae8a.js","./assets/30-gen-07-5e-c4bf4bdff3b.js","./assets/30-gen-08-4e-c4b1739b15f.js","./assets/30-gen-09-3e-c4b394401fd.js","./assets/30-gen-10-2nde-c5b4300dab7.js","./assets/30-gen-11-1re-c5b35bf1ca5.js","./assets/30-gen-12-term-c5bd9a46365.js","./assets/31-dictee-01-cp-c28ca3c577.js","./assets/31-dictee-02-ce1-c275c43cf8.js","./assets/31-dictee-03-ce2-c242c875c1.js","./assets/31-dictee-04-cm1-c3e3a0e014.js","./assets/31-dictee-05-cm2-c3ed567625.js","./assets/32-extra-01-cp-c28ca3c577.js","./assets/32-extra-02-ce1-c275c43cf8.js","./assets/32-extra-03-ce2-c242c875c1.js","./assets/32-extra-04-cm1-c3e3a0e014.js","./assets/32-extra-05-cm2-c3ed567625.js","./assets/32-extra-06-6e-c3a8f3ae8a.js","./assets/32-extra-07-5e-c4bf4bdff3b.js","./assets/32-extra-08-4e-c4b1739b15f.js","./assets/32-extra-09-3e-c4b394401fd.js","./assets/32-extra-10-2nde-c5b4300dab7.js","./assets/32-extra-11-1re-c5b35bf1ca5.js","./assets/32-extra-12-term-c5bd9a46365.js","./assets/33-v3-01-cp-d4f37721c5.js","./assets/33-v3-02-ce1-d4d7b85b6b.js","./assets/33-v3-03-ce2-d477ce96ec.js","./assets/33-v3-04-cm1-d48e8dc02c.js","./assets/33-v3-05-cm2-d463657a95.js","./assets/33-v3-06-6e-d41437b612.js","./assets/33-v3-07-5e-d4272345a8.js","./assets/33-v3-08-4e-d42937d664.js","./assets/33-v3-09-3e-d402e1c07f.js","./assets/33-v3-10-2nde-d497a0f80a.js","./assets/33-v3-11-1re-d4e9d56b8e.js","./assets/33-v3-12-term-d47931363a.js","./assets/andika-latin-400-normal-BTFTIZb-.woff2","./assets/andika-latin-700-normal-Dk95f5lc.woff2","./assets/fredoka-hebrew-wght-normal-DdnsCkLr.woff2","./assets/fredoka-latin-ext-wght-normal-CYrqKuxd.woff2","./assets/fredoka-latin-wght-normal-DM6njrJ3.woff2","./assets/inter-latin-wght-normal-Dx4kXJAl.woff2","./assets/jetbrains-mono-latin-wght-normal-B9CIFXIH.woff2","./assets/kalam-latin-400-normal-BthBl_aR.woff2","./assets/kalam-latin-700-normal-D2H-9ISU.woff2","./assets/opendyslexic-latin-400-normal-nUhe5EwG.woff2","./assets/opendyslexic-latin-700-normal-Bnmt45Ln.woff2","./assets/schoolbell-latin-400-normal-D_Z2-wWK.woff2","./assets/sora-latin-wght-normal-DdqRvwsR.woff2","./assets/web-d48abcf5c7.js","./assets/web-d4ba473fe2.css","./confidentialite.html","./favicon.svg","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./manifest.webmanifest","./index.html"];
const CACHE = `pupitre-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => (k.startsWith('pupitre-') || k.startsWith('carischool-')) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // Pages : le réseau d'abord (nouvelle version visible tout de suite), le cache hors ligne.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put('./index.html', copy));
          }
          return res;
        })
        .catch(() => caches.match('./index.html').then((hit) => hit || caches.match('./'))),
    );
    return;
  }
  // Fichiers compilés (noms uniques à chaque version) : le cache d'abord.
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(
      (hit) =>
        hit ||
        fetch(req)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : Response.error())),
    ),
  );
});
