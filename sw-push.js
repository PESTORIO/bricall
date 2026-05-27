// Service Worker للإشعارات في الخلفية
self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim());
});

// مني يجي إشعار push
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(err) { data = { title: 'ALLO-BRICALL', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(
    self.registration.showNotification(data.title || 'ALLO-BRICALL 🔔', {
      body: data.body || 'لديك إشعار جديد',
      icon: '/favicon-512x512.png',
      badge: '/favicon-512x512.png',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      tag: 'allo-bricall'
    })
  );
});

// مني يضغط على الإشعار
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        if (clientList[i].url.includes('requests') && 'focus' in clientList[i]) {
          return clientList[i].focus();
        }
      }
      if (clients.openWindow) return clients.openWindow('/requests.html');
    })
  );
});
