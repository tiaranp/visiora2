/* =====================================================================
   script.js — Halaman Portofolio VISIORA × Aurora Finance
   ===================================================================== */

// 1) Animasi muncul saat di-scroll (reveal)
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach((el) => revealObserver.observe(el));

// 2) Animasi batang grafik tumbuh saat terlihat
const bars = document.getElementById('bars');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const items = bars.querySelectorAll('.bar');
      items.forEach((b, i) => { b.style.transitionDelay = (i * 60) + 'ms'; });
      bars.classList.add('in');
      barObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
barObserver.observe(bars);

// 3) Penghitung "Terakhir diperbarui X detik lalu" (siklus 1–5 detik)
const lastUpdate = document.getElementById('lastUpdate');
let sec = 2;
setInterval(() => {
  sec = sec >= 5 ? 1 : sec + 1;
  lastUpdate.textContent = sec;
}, 1000);
