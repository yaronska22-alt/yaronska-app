// Service worker de Yaronska App: recibe los avisos (notificaciones push) y abre la app al tocarlos.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('push',e=>{
  let d={};try{d=e.data?e.data.json():{}}catch(_){d={body:e.data&&e.data.text()}}
  e.waitUntil(self.registration.showNotification(d.title||'Yaronska_Fit',{body:d.body||'',icon:'/img/icon-192.png',badge:'/img/icon-192.png',tag:d.tag||'yaronska',renotify:true,data:{url:d.url||'/'}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();const url=(e.notification.data&&e.notification.data.url)||'/';
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const c of list){if('focus' in c){c.navigate&&c.navigate(url);return c.focus()}}
    return self.clients.openWindow(url);
  }));
});
