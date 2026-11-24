// ================= MENU MOBILE =================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Tutup menu setelah link diklik
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ================= ANIMASI REVEAL SAAT SCROLL =================
const revealTargets = document.querySelectorAll(
  ".intro, .overview, .service-card, .methodology, .cta, .method-card"
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

// ================= NAV AKTIF SESUAI SECTION =================
const navAnchors = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  const y = window.scrollY + 140;
  const layanan = document.getElementById("layanan");
  const tentang = document.getElementById("tentang");
  const kontak = document.getElementById("kontak");

  let current = "#beranda";
  if (y >= layanan.offsetTop) current = "#layanan";
  if (y >= tentang.offsetTop) current = "#tentang";
  if (y >= kontak.offsetTop) current = "#kontak";

  navAnchors.forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === current);
  });
});

// ================= FORM NEWSLETTER =================
const newsletterForm = document.getElementById("newsletterForm");
const emailInput = document.getElementById("emailInput");
const newsletterMsg = document.getElementById("newsletterMsg");

newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newsletterMsg.textContent = "Email tidak valid.";
    return;
  }

  newsletterMsg.textContent = "Terima kasih! Anda sudah berlangganan.";
  newsletterForm.reset();
  setTimeout(() => (newsletterMsg.textContent = ""), 4000);
});