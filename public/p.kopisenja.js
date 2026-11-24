/* =========================================================
   VISIORA — Portofolio Kopi Senja (JavaScript)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. MENU MOBILE ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  }

  /* ---------- 2. ANIMASI REVEAL SAAT SCROLL ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- 3. COUNTER ANGKA METRIK ---------- */
  const counters = document.querySelectorAll("[data-count]");

  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  }

  /* ---------- 4. KALKULATOR RACIK LANGGANAN ---------- */
  const cupRange = document.getElementById("cupRange");
  const calcResult = document.getElementById("calcResult");

  const updateCalc = () => {
    const cups = parseInt(cupRange.value, 10);       // cangkir per hari
    const gramsPerMonth = cups * 15 * 30;            // ±15 gr per cangkir
    const bags = Math.max(1, Math.round(gramsPerMonth / 250));
    calcResult.textContent = `${bags} x 250gr Beans`;

    const min = parseInt(cupRange.min, 10);
    const max = parseInt(cupRange.max, 10);
    const fill = ((cups - min) / (max - min)) * 100;
    cupRange.style.setProperty("--fill", fill + "%");
  };

  if (cupRange && calcResult) {
    cupRange.addEventListener("input", updateCalc);
    updateCalc();
  }

  /* ---------- 5. SELEKSI PROFIL GILINGAN ---------- */
  const grindChips = document.querySelectorAll("#grindChips .chip");

  grindChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      grindChips.forEach((c) => c.classList.remove("active", "chip-orange"));
      chip.classList.add("active", "chip-orange");
    });
  });

  /* ---------- 6. SMOOTH SCROLL UNTUK TOMBOL CTA ---------- */
  document.querySelectorAll('a[href="#cta"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("cta").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

});