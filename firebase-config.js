// ============================================
// Firebase Config - Allo-Bricall / Hrafiy App
// ============================================

// Firebase Scripts خاصك تزيد هاد السطور في index.html قبل هاد الملف:
// <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-database-compat.js"></script>
// <script src="firebase-config.js"></script>

// ============================================
// 1. Firebase Initialization
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyDqF510_qVbJxImCP94Sl9uE7srF2u1Cuk",
  authDomain: "hrafiy-app.firebaseapp.com",
  databaseURL: "https://hrafiy-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hrafiy-app",
  storageBucket: "hrafiy-app.firebasestorage.app",
  messagingSenderId: "668315848262",
  appId: "1:668315848262:web:0323e4f8c932e040c80447",
  measurementId: "G-7B59SHYW4K"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ============================================
// 2. GPS - تحديد موقع الحرفي عند فتح التطبيق
// ============================================

// artisanId = ID ديال الحرفي المسجل دخول - بدلو بالمتغير ديالك
// مثال: const artisanId = currentUser.uid;
const artisanId = localStorage.getItem('artisanId') || 'test-artisan';

function updateArtisanLocation() {
  if (!navigator.geolocation) {
    showGPSError("متصفحك لا يدعم تحديد الموقع");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // بعت الموقع لـ Firebase
      db.ref('artisans/' + artisanId).update({
        lat: lat,
        lng: lng,
        lastSeen: Date.now(),
        online: true
      }).then(function() {
        console.log("✅ الموقع تحدث بنجاح:", lat, lng);
        hideGPSError();
      }).catch(function(error) {
        console.error("❌ خطأ في تحديث الموقع:", error);
      });
    },
    function(error) {
      // الحرفي رفض GPS أو كاين مشكل
      showGPSError("⚠️ خاصك تفعل الموقع باش تظهر للزبائن القريبين منك!");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

// ============================================
// 3. تحديث الموقع كل 3 دقائق تلقائياً
// ============================================
updateArtisanLocation(); // أول تحديث عند الفتح
setInterval(updateArtisanLocation, 3 * 60 * 1000); // كل 3 دقائق

// ============================================
// 4. عند إغلاق التطبيق - الحرفي يصبح Offline
// ============================================
window.addEventListener('beforeunload', function() {
  db.ref('artisans/' + artisanId).update({
    online: false,
    lastSeen: Date.now()
  });
});

// ============================================
// 5. رسالة خطأ GPS
// ============================================
function showGPSError(message) {
  // شوف إذا كاين div للرسالة
  let errorDiv = document.getElementById('gps-error');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'gps-error';
    errorDiv.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0;
      background: #e05a00;
      color: white;
      text-align: center;
      padding: 12px;
      font-size: 15px;
      z-index: 9999;
      font-family: Cairo, sans-serif;
    `;
    document.body.prepend(errorDiv);
  }
  errorDiv.textContent = message;
}

function hideGPSError() {
  const errorDiv = document.getElementById('gps-error');
  if (errorDiv) errorDiv.remove();
}

// ============================================
// 6. قراءة مواقع الحرفيين للخريطة
// ============================================
function loadArtisansOnMap() {
  db.ref('artisans').on('value', function(snapshot) {
    const artisans = snapshot.val();
    if (!artisans) return;

    // هنا تمرر البيانات للخريطة ديالك
    // مثال مع Leaflet:
    Object.keys(artisans).forEach(function(id) {
      const artisan = artisans[id];
      if (artisan.lat && artisan.lng && artisan.online) {
        // addMarkerToMap(artisan.lat, artisan.lng, artisan); // دير هاد الفونكسيون حسب الخريطة ديالك
        console.log("📍 حرفي:", id, artisan.lat, artisan.lng);
      }
    });
  });
}

// استدعي هاد الفونكسيون في صفحة الخريطة
// loadArtisansOnMap();
