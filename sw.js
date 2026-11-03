// เก็บหน้าเว็บไว้ใช้ออฟไลน์: ออนไลน์ดึงของใหม่ก่อนเสมอ (ได้อัปเดตทันที) ออฟไลน์ค่อยใช้ของที่เก็บไว้
const CACHE = 'lead-prep-v1';
const FILES = ['./', 'index.html', 'competency-2026-train.html', 'competency-2026-exam.html',
  'sqljs/sql-wasm.js', 'sqljs/sql-wasm.wasm', 'manifest.webmanifest', 'icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}))
  );
});
