// =====================================================
// VISIORA - Jadwal & Agenda Sesi Kreatif
// =====================================================

// ---------- Helper: toast notifikasi ----------
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ---------- Tab tampilan (Bulan / Minggu / Hari / Daftar Agenda) ----------
document.querySelectorAll('#viewSeg button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#viewSeg button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ---------- Pilih hari pada strip minggu ----------
document.querySelectorAll('#week .day:not(.off)').forEach(day => {
  day.addEventListener('click', () => {
    document.querySelectorAll('#week .day').forEach(d => d.classList.remove('selected'));
    day.classList.add('selected');
  });
});

// ---------- Pilih hari konsultasi ----------
document.querySelectorAll('#daysPick button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#daysPick button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ---------- Pilih slot waktu ----------
document.querySelectorAll('#slots .slot').forEach(slot => {
  slot.addEventListener('click', () => {
    document.querySelectorAll('#slots .slot').forEach(s => s.classList.remove('active'));
    slot.classList.add('active');
  });
});

// ---------- Konfirmasi jadwal ----------
document.getElementById('btnConfirm').addEventListener('click', () => {
  const day  = document.querySelector('#daysPick .active').textContent.trim();
  const time = document.querySelector('#slots .active .l').textContent.trim();
  showToast(`Jadwal dikonfirmasi: ${day} • ${time}`);
});

// ---------- Klaim slot ----------
document.getElementById('btnClaim').addEventListener('click', e => {
  e.target.textContent = 'Terklaim ✓';
  showToast('Slot Quick Sync berhasil diklaim');
});

// ---------- Tombol header ----------
document.getElementById('btnSync').addEventListener('click', () => showToast('Sinkronisasi kalender berhasil'));
document.getElementById('btnNew').addEventListener('click',  () => showToast('Membuka form sesi baru...'));

// ---------- Tombol dengan data-toast ----------
document.querySelectorAll('[data-toast]').forEach(el => {
  el.addEventListener('click', () => showToast(el.dataset.toast));
});

// ---------- Salin tautan ----------
document.querySelectorAll('.copy[data-copy]').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.copy;
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    showToast('Tautan disalin: ' + text);
  });
});