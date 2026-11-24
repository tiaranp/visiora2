// ================= FILTER DIREKTORI AHLI =================
const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // ganti tombol aktif
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    cards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const show = filter === "all" || categories.includes(filter);
      card.classList.toggle("hide", !show);
    });
  });
});

// ================= NEWSLETTER =================
const newsletterForm = document.getElementById("newsletterForm");

newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = newsletterForm.querySelector("input");
  alert("Terima kasih! " + input.value + " berhasil didaftarkan.");
  newsletterForm.reset();
});

// ================= EFEK MUNCUL SAAT SCROLL =================
const revealItems = document.querySelectorAll(".card, .step, .stat-card, .cta-box");

revealItems.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealItems.forEach((el) => observer.observe(el));