const V='yawin-v6',SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  if(u.hostname.endsWith('supabase.co'))return; // data dan login selalu langsung ke server
  const same=u.origin===location.origin,cdn=/jsdelivr|googleapis|gstatic/.test(u.hostname);
  if(!same&&!cdn)return;
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(ch=>ch.put('./index.html',c));return x}).catch(()=>caches.match('./index.html')));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(ch=>ch.put(r,c))}return x})));
});
