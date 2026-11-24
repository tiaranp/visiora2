/* =====================================================================
   VISIORA - Portofolio: Konstruksi Prima
   BAGIAN JAVASCRIPT
   Daftar isi:
   1. Menu mobile
   2. Smooth scroll tombol "Eksplorasi Platform"
   3. Animasi muncul saat scroll (reveal)
   4. Progress bar K3 & ESG
   5. Counter angka telemetri
   6. Dropzone upload TOR/KAK
   7. Form RFQ + toast
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- 1. MENU MOBILE ---------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));

  /* ---------- 2. SMOOTH SCROLL ---------- */
  const btnExplore = document.getElementById("btnExplore");
  btnExplore.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("showcase").scrollIntoView({ behavior: "smooth" });
  });

  /* ---------- 3. REVEAL SAAT SCROLL ---------- */
  const revealTargets = document.querySelectorAll(
    ".card, .pillar, .metric, .testi, .pager__item, .cta, .tech, .metrics"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ---------- 4. PROGRESS BAR K3 & ESG ---------- */
  const bars = document.querySelectorAll(".bar__fill");
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width + "%";
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  bars.forEach((bar) => barObserver.observe(bar));

  /* ---------- 5. COUNTER ANGKA ---------- */
  const counters = document.querySelectorAll(".count");
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimal || "0", 10);
        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = (target * eased).toFixed(decimals);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => countObserver.observe(c));

  /* ---------- 6. DROPZONE UPLOAD ---------- */
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const dropText = document.getElementById("dropText");

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      showToast("Hanya berkas PDF yang diterima.");
      return;
    }
    dropText.textContent = file.name;
  };

  dropzone.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => handleFile(fileInput.files[0]));
  ["dragenter", "dragover"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add("drag");
    })
  );
  ["dragleave", "drop"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove("drag");
    })
  );
  dropzone.addEventListener("drop", (e) => handleFile(e.dataTransfer.files[0]));

  /* ---------- 7. FORM RFQ + TOAST ---------- */
  const rfqForm = document.getElementById("rfqForm");
  rfqForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Permohonan tender berhasil dikirim. Tim VISIORA akan segera menghubungi Anda.");
    rfqForm.reset();
    dropText.textContent = "Tarik berkas PDF tender ke sini";
  });

  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }
});