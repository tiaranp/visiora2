/* =========================================================
   VISIORA - Ruang Konsultasi VIP (interaksi)
   ========================================================= */

const chatBody = document.getElementById("chatBody");
const composer = document.getElementById("composer");
const msgInput = document.getElementById("msgInput");
const preloadNathalia = new Image();
preloadNathalia.src = "images/Nathalia Pradipta.jpg";
const toastEl = document.getElementById("toast");

/* ---------- Helper ---------- */
function nowTime() {
  return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":");
}

function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

function scrollChat() {
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- Tambah pesan ---------- */
function addMessage(text, from = "me") {
  const wrap = document.createElement("div");
  wrap.className = "msg " + (from === "me" ? "me" : "");
  const avatar = from === "me"
    ? `<div class="avatar avatar-xs av-3"><span>AN</span></div>`
    :    <div class="avatar avatar-xs av-1"><img src="images/Nathalia Pradipta.jpg" alt="Nathalia Pradipta" /></div>
  const name = from === "me" ? "Anda" : "Nathalia Pradipta";
  wrap.innerHTML = `
    ${avatar}
    <div class="msg-col">
      <div class="msg-meta"><b>${name}</b> <span>${nowTime()}</span></div>
      <div class="bubble">${escapeHtml(text)}</div>
    </div>`;
  chatBody.appendChild(wrap);
  scrollChat();
  return wrap;
}

function botReply(text) {
  const typing = document.createElement("div");
  typing.className = "msg";
  typing.innerHTML = `
    <div class="avatar avatar-xs av-1"><img src="images/Nathalia Pradipta .jpg" alt="Nathalia Pradipta" /></div>
    <div class="msg-col"><div class="bubble"><span class="typing"><i></i><i></i><i></i></span></div></div>`;
  chatBody.appendChild(typing);
  scrollChat();
  setTimeout(() => {
    typing.remove();
    addMessage(text, "bot");
  }, 1200);
}

/* ---------- Kirim pesan ---------- */
composer.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = msgInput.value.trim();
  if (!text) return;
  addMessage(text, "me");
  msgInput.value = "";
  botReply("Terima kasih! Catatan Anda sudah kami terima. Tim kami akan menyiapkan rekomendasi terbaik untuk proyek Anda.");
});

msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    composer.requestSubmit();
  }
});

/* ---------- Balas cepat ---------- */
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    msgInput.value = chip.textContent.trim();
    msgInput.focus();
  });
});

/* ---------- Pilihan fokus konsultasi ---------- */
document.querySelectorAll(".option").forEach((opt) => {
  opt.addEventListener("click", () => {
    document.querySelectorAll(".option").forEach((o) => o.classList.remove("selected"));
    opt.classList.add("selected");
    const value = opt.dataset.value;
    addMessage("Fokus utama kami: " + value, "me");
    botReply("Pilihan yang sangat tepat! Kami akan menyiapkan tim khusus untuk " + value + ". Bisa ceritakan target dan timeline yang Anda inginkan?");
  });
});

/* ---------- Ganti tiket ---------- */
document.querySelectorAll(".ticket").forEach((t) => {
  t.addEventListener("click", () => {
    document.querySelectorAll(".ticket").forEach((x) => x.classList.remove("active"));
    t.classList.add("active");
    if (t.dataset.ticket !== "1") showToast("Tiket arsip hanya bisa dilihat (read-only)");
  });
});

/* ---------- Tombol-tombol lain ---------- */
document.getElementById("btnStar").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  btn.classList.toggle("on");
  showToast(btn.classList.contains("on") ? "Ditambahkan ke favorit" : "Dihapus dari favorit");
});

document.getElementById("btnMeet").addEventListener("click", () => showToast("Menyiapkan ruang Google Meet..."));
document.getElementById("btnNewTicket").addEventListener("click", () => showToast("Membuat tiket baru..."));
document.getElementById("btnSow").addEventListener("click", () => showToast("Mengarahkan ke penyusunan SOW resmi..."));
document.getElementById("btnEmoji").addEventListener("click", () => {
  msgInput.value += "😊";
  msgInput.focus();
});

document.querySelectorAll(".doc-item").forEach((d) => {
  d.addEventListener("click", () => showToast("Membuka: " + d.querySelector("span").textContent));
});

/* ---------- Auto scroll awal ---------- */
window.addEventListener("load", scrollChat);