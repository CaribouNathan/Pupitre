// Pupitre en ligne — service worker : tout le site est mis en cache pour fonctionner hors ligne.
// La liste des fichiers est injectée à la compilation (vite.web.config.ts).
const VERSION = '3.2.0-1793323584231';
const PRECACHE = ["./","./aide.html","./apple-touch-icon.png","./assets/01-cp-Bw-VaTLI.js","./assets/02-ce1-DKxBRW_d.js","./assets/03-ce2-sNXk0Ikm.js","./assets/04-cm1-DOuJ-wmZ.js","./assets/05-cm2-DauSbEzU.js","./assets/06-6e-CFAu0_L4.js","./assets/07-5e-BfPziCsD.js","./assets/08-4e-Dv0wee7j.js","./assets/09-3e-C5QVd1LO.js","./assets/10-2nde-D_9ZYnYx.js","./assets/11-1re-BtsuSJ7O.js","./assets/12-term-B5CsSdcH.js","./assets/20-formats-riches-BqHQEM4J.js","./assets/21-italien-u6XlT7oM.js","./assets/30-gen-01-cp-BuPPXK2b.js","./assets/30-gen-02-ce1-B-8hafcP.js","./assets/30-gen-03-ce2-sMcEeR_J.js","./assets/30-gen-04-cm1-BrF9U0f4.js","./assets/30-gen-05-cm2-DtDMHiwB.js","./assets/30-gen-06-6e-CaSr67in.js","./assets/30-gen-07-5e-BM2gcbXc.js","./assets/30-gen-08-4e-DxrgZ5q_.js","./assets/30-gen-09-3e-C5OK1E_l.js","./assets/30-gen-10-2nde-BqVKzR0E.js","./assets/30-gen-11-1re-BWxMHhGi.js","./assets/30-gen-12-term-C289xI9F.js","./assets/31-dictee-01-cp-CocaZdaT.js","./assets/31-dictee-02-ce1-r3Eo3ed9.js","./assets/31-dictee-03-ce2-oW_oXWxm.js","./assets/31-dictee-04-cm1-CF3EYxMi.js","./assets/31-dictee-05-cm2-B6rRlXLT.js","./assets/32-extra-01-cp-BiCGQZjG.js","./assets/32-extra-02-ce1-Ct5J4Fzj.js","./assets/32-extra-03-ce2-DpY108Ph.js","./assets/32-extra-04-cm1-BvniK-Hp.js","./assets/32-extra-05-cm2-Bawe797A.js","./assets/32-extra-06-6e-CCv5kMsD.js","./assets/32-extra-07-5e-DLA03NFh.js","./assets/32-extra-08-4e-CxsZdRdd.js","./assets/32-extra-09-3e-CRgr2T_b.js","./assets/32-extra-10-2nde-ViJAJVAL.js","./assets/32-extra-11-1re-B5PyUgg0.js","./assets/32-extra-12-term-BCihLUSS.js","./assets/33-v3-01-cp-DqLfzIvA.js","./assets/33-v3-02-ce1-DpPkj2hT.js","./assets/33-v3-03-ce2-BwERxjZO.js","./assets/33-v3-04-cm1-BIQJuKKi.js","./assets/33-v3-05-cm2-ChAS8ao1.js","./assets/33-v3-06-6e-De32a5hA.js","./assets/33-v3-07-5e-BdehUfPu.js","./assets/33-v3-08-4e-CAIAydob.js","./assets/33-v3-09-3e--ve6cRgW.js","./assets/33-v3-10-2nde-CsynYEXg.js","./assets/33-v3-11-1re-zcsTZb_8.js","./assets/33-v3-12-term-DaLV-oU6.js","./assets/andika-latin-400-normal-BTFTIZb-.woff2","./assets/andika-latin-700-normal-Dk95f5lc.woff2","./assets/fredoka-hebrew-wght-normal-DdnsCkLr.woff2","./assets/fredoka-latin-ext-wght-normal-CYrqKuxd.woff2","./assets/fredoka-latin-wght-normal-DM6njrJ3.woff2","./assets/inter-latin-wght-normal-Dx4kXJAl.woff2","./assets/jetbrains-mono-latin-wght-normal-B9CIFXIH.woff2","./assets/kalam-latin-400-normal-BthBl_aR.woff2","./assets/kalam-latin-700-normal-D2H-9ISU.woff2","./assets/opendyslexic-latin-400-normal-nUhe5EwG.woff2","./assets/opendyslexic-latin-700-normal-Bnmt45Ln.woff2","./assets/schoolbell-latin-400-normal-D_Z2-wWK.woff2","./assets/sora-latin-wght-normal-DdqRvwsR.woff2","./assets/web-Ba9teepP.css","./assets/web-vjyRzEuq.js","./confidentialite.html","./favicon.svg","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./manifest.webmanifest","./index.html"];
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
