/* =====================================================
   VISIORA - Portofolio Pilihan
   File: script.js
   ===================================================== */

// ---------- Data Portofolio ----------
const projects = [
  {
    name: "",   
  title: "Aurora Finance App",
  desc: "Desain ulang dashboard fintech dengan alur transaksi yang lebih singkat.",
  category: "uiux",
  gradient: "url('images/aurora-finance.webp') center/cover no-repeat",
  tags: ["Figma", "Prototyping", "Design System"],
  href: "p.aurora.html"
  },
  {
    name: "",   
  title: "Kopi Senja Rebrand",
  desc: "Identitas visual baru untuk jaringan kedai kopi lokal, dari logo sampai kemasan.",
  category: "branding",
  gradient: "url('images/kopi-senja.webp') center/cover no-repeat",
  tags: ["Illustrator", "Packaging", "Brand Guide"],
  extraClass: "kopi",
  href: "p.kopisenja.html"
  },
  {
    name: "",  
  title: "NusaTravel Booking",
  desc: "Website pemesanan paket wisata dengan pencarian cepat dan pembayaran terintegrasi.",
  category: "web",
  gradient: "url('images/NusaTravel.webp') center/cover no-repeat",
  tags: ["Laravel", "Tailwind", "MySQL"],
  href: "p.nusa.html"
  },
  {
    name: "",   
  title: "MediCare+ Mobile",
  desc: "Aplikasi janji temu dokter dengan alur pendaftaran tiga langkah.",
  category: "uiux",
  gradient: "url('images/MediCare+.webp') center/cover no-repeat",
  tags: ["Figma", "User Research", "Flutter"],
  href: "p.medicare.html"
  },
  {
    name: "",   
  title: "Tenun Studio Identity",
  desc: "Sistem identitas untuk label fesyen yang mengangkat motif tenun tradisional.",
  category: "branding",
  gradient: "url('images/Tenun-Studio.webp') center/cover no-repeat",
  tags: ["Logo", "Typography", "Motion"],
  href: "p.tenun.html"
  },
  {
    name: "",   // kosongkan kalau tulisan sudah ada di gambar
  title: "Konstruksi Prima Company Profile",
  desc: "Website profil perusahaan dengan galeri proyek dan formulir penawaran.",
  category: "web",
  gradient: "url('images/Konstruksi-Prima.webp') center/cover no-repeat",
  tags: ["HTML", "Tailwind", "JavaScript"],
  href: "p.konstruksi.html"
  }
];

const grid = document.getElementById("portfolio-grid");

// ---------- Render Kartu ----------
function renderCards() {
  grid.innerHTML = projects.map(p => `
    <a class="card" href="${p.href}" data-category="${p.category}">
      <div class="card-img ${p.extraClass || ""}" style="background: ${p.gradient}">
        ${p.name}
      </div>
      <div class="card-body">
        <h3 class="card-title">${p.title}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="tags">
          ${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}
        </div>
      </div>
    </a>
  `).join("");
}

// ---------- Filter Kategori ----------
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    document.querySelectorAll(".card").forEach(card => {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hide", !match);
    });
  });
});

// Jalankan saat halaman dimuat
renderCards();