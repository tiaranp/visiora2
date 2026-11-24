/* =========================================================
   VISIORA - Beranda
   1. Menu mobile  2. Navbar scroll  3. Menu aktif
   4. Counter statistik  5. Newsletter
   ========================================================= */

// 1. Menu mobile
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// 2. Garis bawah navbar saat di-scroll
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
});

// 3. Highlight menu sesuai bagian yang sedang dilihat
const sections = document.querySelectorAll("section[id], footer[id]");
const links = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "beranda";
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  links.forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === "#" + current)
  );
});

// 4. Animasi hitung angka statistik
const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 50));
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 30);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
counters.forEach((el) => {
  el.textContent = "0";
  counterObserver.observe(el);
});

// 5. Form newsletter
document.getElementById("newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("newsletterMsg").textContent = "Terima kasih, Anda sudah berlangganan!";
  e.target.reset();
});