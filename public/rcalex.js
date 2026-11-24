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
      <div class="avatar avatar--sm"><span class="avatar__fallback">AV</span></div>
      <div class="msg__col">
        <div class="msg__meta msg__meta--left">
          <strong>Alexander Vance</strong> <span class="tag-director">Design Director</span> <span>${nowWIB()}</span>
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
      keys: ["tipografi", "font", "huruf", "logo", "warna", "visual", "identitas"],
      text: "Untuk identitas visual premium, saya akan menyusun arah tipografi, palet warna, dan sistem logo yang konsisten. Kita bisa membandingkan beberapa opsi di mockup produk sebelum menentukan arah final.",
    },
    {
      keys: ["roadmap", "pekan", "timeline", "jadwal proyek", "deadline"],
      text: "Untuk proyek identitas visual, tahapannya: audit dan arah kreatif, eksplorasi konsep, penyempurnaan desain, lalu panduan brand dan serah-terima aset. Durasi tiap tahap kita sesuaikan dengan cakupan dan jumlah revisi.",
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
    return `Saya menangkap pesan Anda: “${text}”. Sebagai Design Director, saya akan mempertimbangkan kebutuhan tersebut dalam arah visual. Bisa ceritakan gaya atau kesan brand yang paling ingin Anda tonjolkan?`;
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
    if (confirm("Tutup sesi konsultasi dengan Alexander Vance?")) {
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