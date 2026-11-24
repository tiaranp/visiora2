// =========================================================
// VISIORA — Studi Kasus MediCare+
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- 1. Animasi muncul saat scroll ----------
  const revealTargets = document.querySelectorAll(
    '.hero > *, .pillars-head, .feature-card, .arch, .mini-card, .results > *, .stat-card, .tech, .quote, .proj-card, .cta'
  );
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((el) => revealObserver.observe(el));

  // ---------- 2. Progress bar ----------
  const bar = document.querySelector('.progress-bar');
  if (bar) {
    const barObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        bar.style.width = bar.dataset.width + '%';
        barObserver.disconnect();
      }
    }, { threshold: 0.5 });
    barObserver.observe(bar);
  }

  // ---------- 3. Counter angka statistik ----------
  const counters = document.querySelectorAll('[data-count]');
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => counterObserver.observe(el));

  // ---------- 4. Menu navigasi aktif ----------
  const navLinks = document.querySelectorAll('.nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ---------- 5. Tombol "Mulai Proyek" & "Jadwalkan Konsultasi" ----------
  document.querySelectorAll('.btn-primary').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.getElementById('kontak').scrollIntoView({ behavior: 'smooth' });
    });
  });

  const consultBtn = document.querySelector('.btn-ghost');
  if (consultBtn) {
    consultBtn.addEventListener('click', () => {
      alert('Terima kasih! Tim VISIORA akan segera menghubungi Anda untuk menjadwalkan konsultasi.');
    });
  }

  // ---------- 6. Efek cahaya mengikuti kursor pada kartu ----------
  document.querySelectorAll('.feature-card, .mini-card, .stat-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background =
        `radial-gradient(circle at ${x}px ${y}px, rgba(124,58,237,.14), transparent 55%), var(--card)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

});