/* =====================================================
   VISIORA — NusaTravel Case Study | script.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Animasi muncul saat scroll ---------- */
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

  /* ---------- 2. Hitung angka metrik (count-up) ---------- */
  const counters = document.querySelectorAll('.count');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const to = parseInt(el.dataset.to, 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.round(to * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => countObserver.observe(el));

  /* ---------- 3. Telemetri live (ping, angin, suhu) ---------- */
  const pingEl = document.getElementById('ping');
  const windEl = document.getElementById('wind');
  const tempEl = document.getElementById('temp');
  const rand = (min, max) => Math.random() * (max - min) + min;

  setInterval(() => {
    if (pingEl) pingEl.textContent = Math.round(rand(28, 36)) + 'ms';
    if (windEl) windEl.innerHTML = rand(8.0, 8.9).toFixed(1) + ' Knot <small>(Barat Laut)</small>';
    if (tempEl) tempEl.textContent = rand(28.7, 29.1).toFixed(1) + ' °C';
  }, 2500);

  /* ---------- 4. Efek bayangan navbar saat scroll ---------- */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10 ? '0 8px 30px rgba(0,0,0,0.5)' : 'none';
  }, { passive: true });

  /* ---------- 5. Smooth scroll untuk tombol "Mulai Proyek" ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
});