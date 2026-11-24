/* ==================== BAGIAN JS ==================== */
/* ---------- Helper: Toast ---------- */
const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toastEl.classList.remove('show'), 2200);
}

/* ---------- Generator pola QR (PLACEHOLDER) ----------
   Ini hanya gambar tampilan. Ganti dengan QRIS asli milik Anda
   (lihat komentar di bawah) agar bisa dipindai & menerima pembayaran. */
function drawQR(canvas){
  const ctx = canvas.getContext('2d');
  const N = 25;                       // jumlah modul
  const size = canvas.width;
  const m = size / N;

  // PRNG sederhana agar pola selalu sama
  let seed = 8891;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0,0,size,size);
  ctx.fillStyle = '#111';

  const reserved = (x,y) =>
    (x<8 && y<8) || (x>=N-8 && y<8) || (x<8 && y>=N-8) ||
    (x>=10 && x<=14 && y>=10 && y<=14);

  for(let y=0;y<N;y++){
    for(let x=0;x<N;x++){
      if(reserved(x,y)) continue;
      if(rand() > 0.52) ctx.fillRect(x*m, y*m, m+0.5, m+0.5);
    }
  }

  // Finder pattern 3 sudut
  const finder = (fx,fy)=>{
    ctx.fillStyle = '#111';
    ctx.fillRect(fx*m, fy*m, 7*m, 7*m);
    ctx.fillStyle = '#fff';
    ctx.fillRect((fx+1)*m, (fy+1)*m, 5*m, 5*m);
    ctx.fillStyle = '#111';
    ctx.fillRect((fx+2)*m, (fy+2)*m, 3*m, 3*m);
  };
  finder(0,0); finder(N-7,0); finder(0,N-7);

  // Area logo tengah
  ctx.fillStyle = '#fff';
  ctx.fillRect(10*m, 10*m, 5*m, 5*m);
}

const qrCanvas = document.getElementById('qrCanvas');
drawQR(qrCanvas);

/* ---------- Unduh QR ---------- */
document.getElementById('btnDownload').addEventListener('click', ()=>{
  const link = document.createElement('a');
  link.download = 'QRIS-VISIORA-VSR-8891.png';
  link.href = qrCanvas.toDataURL('image/png');
  link.click();
  showToast('Kode QR berhasil diunduh');
});

/* ---------- Perbesar QR ---------- */
const modal = document.getElementById('modal');
document.getElementById('btnZoom').addEventListener('click', ()=>{
  drawQR(document.getElementById('qrBig'));
  modal.classList.add('show');
});
document.getElementById('modalClose').addEventListener('click', ()=>modal.classList.remove('show'));
modal.addEventListener('click', e=>{ if(e.target===modal) modal.classList.remove('show'); });

/* ---------- Salin jumlah ---------- */
document.getElementById('btnCopy').addEventListener('click', async ()=>{
  try{
    await navigator.clipboard.writeText('45000000');
  }catch(e){
    const t = document.createElement('textarea');
    t.value = '45000000'; document.body.appendChild(t); t.select();
    document.execCommand('copy'); t.remove();
  }
  showToast('Nominal Rp 45.000.000 disalin');
});

/* ---------- Tab panduan ---------- */
document.querySelectorAll('.tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.steps').forEach(s=>s.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-'+tab.dataset.tab).classList.add('active');
  });
});

/* ---------- Hitung mundur 15 menit ---------- */
const DURATION = 15 * 60;
let remaining = 14 * 60 + 45;       // mulai dari 14:45 seperti pada desain
const minEl = document.getElementById('minutes');
const secEl = document.getElementById('seconds');

function renderTimer(){
  minEl.textContent = Math.floor(remaining / 60);
  secEl.textContent = remaining % 60;
}
renderTimer();

setInterval(()=>{
  remaining--;
  if(remaining < 0){
    remaining = DURATION;           // QR diperbarui otomatis
    showToast('Kode QRIS diperbarui otomatis');
  }
  renderTimer();
}, 1000);

/* ---------- Tombol cek status ---------- */
const btnCheck = document.getElementById('btnCheck');
btnCheck.addEventListener('click', ()=>{
  const icon = document.getElementById('checkIcon');
  icon.classList.add('spin');
  btnCheck.disabled = true;
  setTimeout(()=>{
    icon.classList.remove('spin');
    btnCheck.disabled = false;
    showToast('Pembayaran belum terdeteksi, coba lagi sebentar');
    /* Di produksi: panggil API backend Anda, mis.
       fetch('/api/payment/status?ref=VSR-2026-8891') */
  }, 1500);
});