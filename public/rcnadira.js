/* =========================================================
   VISIORA - Room Chat Konsultasi
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const chatBody = $("#chatBody");
  const input = $("#msgInput");
  const sendBtn = $("#sendBtn");
  const toastEl = $("#toast");

  /* ---------- Util ---------- */
  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function nowWIB() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm} WIB`;
  }

  function scrollBottom() {
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }

  let toastTimer;
  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }

  /* ---------- Mobile nav ---------- */
  $("#navToggle").addEventListener("click", () => $("#nav").classList.toggle("open"));

  /* ---------- Textarea auto-resize ---------- */
  function autoResize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 110) + "px";
  }
  input.addEventListener("input", autoResize);

  /* ---------- Render messages ---------- */
  function addUserMessage(text) {
    const el = document.createElement("div");
    el.className = "msg msg--out";
    el.innerHTML = `
      <div class="msg__meta"><span>${nowWIB()}</span> <strong>Anda (Founder &amp; CMO)</strong></div>
      <div class="bubble">
        ${escapeHTML(text).replace(/\n/g, "<br>")}
        <div class="bubble__status">
          <svg viewBox="0 0 24 24" class="ico"><path d="M2 13l5 5L18 7M12 17l1 1L23 7"/></svg>
          Terkirim
        </div>
      </div>`;
    chatBody.appendChild(el);
    scrollBottom();
    return el;
  }

  function addConsultantMessage(text, isTyping = false) {
    const el = document.createElement("div");
    el.className = "msg msg--in msg--with-avatar";
    el.innerHTML = `
      <div class="avatar avatar--sm"><span class="avatar__fallback">NK</span></div>
      <div class="msg__col">
        <div class="msg__meta msg__meta--left">
          <strong>Nadira Kencana</strong> <span class="tag-director">UI/UX Architect</span> <span>${nowWIB()}</span>
        </div>
        <div class="bubble">${
          isTyping ? '<span class="typing"><span></span><span></span><span></span></span>' : escapeHTML(text)
        }</div>
      </div>`;
    chatBody.appendChild(el);
    scrollBottom();
    return el;
  }

  /* ---------- Balasan otomatis (simulasi) ---------- */
  const replies = [
    {
      keys: ["alur", "flow", "checkout", "navigasi", "pengguna", "user journey"],
      text: "Untuk memperbaiki alur pengguna, kita petakan langkah dari kebutuhan awal sampai tugas selesai, lalu hilangkan hambatan dan keputusan yang tidak perlu. Alur mana yang paling penting untuk ditinjau?",
    },
    {
      keys: ["design system", "design systems", "sistem desain", "komponen", "enterprise"],
      text: "Untuk design system, saya akan mengaudit komponen yang sudah ada, menyusun token dan pola yang konsisten, lalu mendokumentasikan aturan penggunaan. Kita bisa mulai dari komponen yang paling sering dipakai.",
    },
    {
      keys: ["fintech", "keuangan", "transaksi", "keamanan", "dashboard"],
      text: "Di produk fintech, kejelasan status transaksi, kepercayaan, dan pencegahan kesalahan sangat penting. Saya akan meninjau hierarki informasi serta konfirmasi untuk tindakan berisiko agar pengguna selalu paham langkah berikutnya.",
    },
    {
      keys: ["riset", "usability", "kegunaan", "aksesibilitas", "pengujian", "testing"],
      text: "Kita bisa memvalidasi desain lewat uji tugas dengan pengguna, mencatat titik kebingungan, lalu memperbaiki alur berdasarkan temuan. Apakah Anda sudah memiliki akses ke pengguna untuk sesi pengujian?",
    },
    {
      keys: ["roadmap", "pekan", "timeline", "jadwal proyek", "deadline"],
      text: "Tahap UX yang saya sarankan: pemetaan kebutuhan dan arsitektur informasi, rancangan alur, prototipe, lalu validasi dan spesifikasi design system. Saya akan sesuaikan jadwal dengan ruang lingkup produk.",
    },
    {
      keys: ["review", "jadwalkan", "live"],
      text: "Baik, kita bisa atur sesi live review. Silakan pilih dua slot waktu yang cocok minggu ini, nanti saya konfirmasi salah satunya.",
    },
    {
      keys: ["harga", "biaya", "budget", "paket"],
      text: "Biaya bergantung pada cakupan proyek. Setelah sesi ini, saya akan menyusun proposal ringkas dengan rincian tahapan dan estimasi biaya yang transparan.",
    },
  ];

  function pickReply(text) {
    const q = text.toLowerCase();
    const hit = replies.find((r) => r.keys.some((k) => q.includes(k)));
    if (hit) return hit.text;
    return `Saya menangkap kebutuhan Anda: “${text}”. Sebagai UI/UX Architect, saya akan mempertimbangkannya dalam struktur dan alur produk. Tugas apa yang paling ingin dipermudah bagi pengguna?`;
  }

  /* ---------- Kirim pesan ---------- */
  let replying = false;

  function sendMessage() {
    const text = input.value.trim();
    if (!text || replying) return;

    addUserMessage(text);
    input.value = "";
    autoResize();

    replying = true;
    const typingEl = addConsultantMessage("", true);

    setTimeout(() => {
      typingEl.remove();
      addConsultantMessage(pickReply(text));
      replying = false;
    }, 1400);
  }

  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      sendMessage();
    }
  });

  /* ---------- Saran cepat ---------- */
  $$(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      input.value = chip.dataset.text || chip.textContent;
      autoResize();
      input.focus();
    });
  });

  /* ---------- Timer sesi ---------- */
  const timerEl = $("#timer");
  let minutesLeft = 38;
  setInterval(() => {
    if (minutesLeft > 0) {
      minutesLeft -= 1;
      timerEl.textContent = minutesLeft + " Menit";
      if (minutesLeft === 5) toast("Sisa waktu sesi 5 menit lagi.");
    }
  }, 60000);

  /* ---------- Tombol aksi ---------- */
  $("#closeSession").addEventListener("click", () => {
    if (confirm("Tutup sesi konsultasi dengan Nadira Kencana?")) {
      toast("Sesi konsultasi ditutup.");
    }
  });

  const fileNda = $("#fileNda");
  $("#uploadNda").addEventListener("click", () => fileNda.click());
  fileNda.addEventListener("change", () => {
    if (fileNda.files.length) toast(`Dokumen "${fileNda.files[0].name}" siap diunggah.`);
  });

  /* ---------- Init ---------- */
  chatBody.scrollTop = chatBody.scrollHeight;
})();