const CACHE='awc-versie-1-0-updatefix-20260501';
const ASSETS=['./','./index.html','./app.js','./manifest.json','./icon-192.png','./icon-512.png','./icon.png','./README.md'];
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).catch(()=>{}));
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.map(k=>caches.delete(k)));
    await self.clients.claim();
    const clientsList=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    clientsList.forEach(client=>client.postMessage({type:'AWC_UPDATED',build:'20260501-UPDATEFIX'}));
  })());
});
self.addEventListener('message',event=>{
  if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();
  if(event.data&&event.data.type==='CLEAR_CACHE'){
    event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))));
  }
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(req.mode==='navigate'){
    event.respondWith(fetch(req,{cache:'reload'}).then(res=>{
      const copy=res.clone();
      caches.open(CACHE).then(cache=>cache.put('./',copy)).catch(()=>{});
      return res;
    }).catch(()=>caches.match('./').then(r=>r||caches.match('./index.html'))));
    return;
  }
  event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{
    if(res&&res.status===200&&url.origin===self.location.origin){
      const copy=res.clone();
      caches.open(CACHE).then(cache=>cache.put(req,copy)).catch(()=>{});
    }
    return res;
  }).catch(()=>caches.match(req)));
});
