const CACHE = 'harfi-v2';
const ASSETS = [
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// إشعارات حتى لو الأدمن مسدود
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: '🔔 إشعار جديد', body: '' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://allo-bricall.ma/favicon.ico',
      badge: 'https://allo-bricall.ma/favicon.ico',
      tag: 'allo-bricall-alert',
      requireInteraction: true,
      vibrate: [200, 100, 200]
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.openWindow('https://allo-bricall.ma/bx7k9m.html')
  );
});

// إشعار من الأدمن عبر postMessage
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(e.data.title, {
      body: e.data.body,
      icon: 'https://allo-bricall.ma/favicon.ico',
      badge: 'https://allo-bricall.ma/favicon.ico',
      tag: 'allo-bricall-alert',
      requireInteraction: true,
      vibrate: [200, 100, 200]
    });
  }
});
