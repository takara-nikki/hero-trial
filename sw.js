// 勇者試煉 離線快取：首頁走網路優先（有新版就用新版），圖片音效走快取優先，字型邊用邊更新。
const V="ht-v1",CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const put=(req,res)=>{if(res&&(res.ok||res.type==="opaque")){const c=res.clone();caches.open(V).then(x=>x.put(req,c))}return res};
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(r.mode==="navigate"||(u.origin===location.origin&&/\/(index\.html)?$/.test(u.pathname))){
    e.respondWith(fetch(r).then(res=>put(r,res)).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));return}
  if(u.origin===location.origin){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>put(r,res))));return}
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(m=>{const net=fetch(r).then(res=>put(r,res)).catch(()=>m);return m||net}))}
});
