/* ================= COUNTDOWN TIMER ================= */
// Mulai dari 23 jam 59 menit 30 detik (sesuai tampilan)
let totalSeconds = 23 * 3600 + 59 * 60 + 30;

const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function pad(n) { return String(n).padStart(2, '0'); }

function renderTimer() {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  hoursEl.textContent = pad(h);
  minutesEl.textContent = pad(m);
  secondsEl.textContent = pad(s);
}

renderTimer();
const timerInterval = setInterval(() => {
  if (totalSeconds <= 0) {
    clearInterval(timerInterval);
    return;
  }
  totalSeconds--;
  renderTimer();
}, 1000);

/* ================= COPY BUTTONS ================= */
function copyText(text, btn, doneLabel) {
  const label = btn.querySelector('span');
  const original = label.textContent;
  const done = () => {
    btn.classList.add('copied');
    label.textContent = doneLabel;
    setTimeout(() => {
      btn.classList.remove('copied');
      label.textContent = original;
    }, 1800);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(done);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    done();
  }
}

document.getElementById('copyVA').addEventListener('click', function () {
  copyText(VA, this, 'Tersalin!');
});

document.getElementById('copyAmount').addEventListener('click', function () {
  copyText('45000000', this, 'Tersalin!');
});

/* ================= TABS PANDUAN TRANSFER ================= */
const VA_PREFIX = '88708';
let VA = '';
const banks = {
  BCA: { code: 'BCA', name: 'Bank Central Asia (BCA)' },
  BNI: { code: 'BNI', name: 'Bank Negara Indonesia (BNI)' },
  BRI: { code: 'BRI', name: 'Bank Rakyat Indonesia (BRI)' },
};

const stepsEl = document.getElementById('steps');
const tabButtons = document.querySelectorAll('.tab');
const methodName = document.getElementById('vaMethodName');
const bankLogo = document.getElementById('vaBankLogo');
const bankName = document.getElementById('vaBankName');
const vaNumberEl = document.getElementById('vaNumber');
const copyVAButton = document.getElementById('copyVA');
let selectedBank = null;

function renderSteps(key) {
  if (!selectedBank) {
    stepsEl.textContent = 'Bank pilihan belum dimuat.';
    return;
  }

  const guides = {
    BCA: [
      'Buka aplikasi <b>BCA mobile</b> dan masuk ke akun Anda.',
      selectedBank.code === 'BCA'
        ? 'Pilih <b>m-Transfer</b>, lalu pilih <b>BCA Virtual Account</b>.'
        : `Pilih <b>m-Transfer</b> dan transfer ke <b>${selectedBank.name}</b>.`,
      `Masukkan nomor Virtual Account <code>${VA}</code>.`,
      'Pastikan nama penerima <b>VISIORA Creative Lab</b> dan nominal <b>Rp 45.000.000</b> sudah sesuai.',
      'Konfirmasi transaksi dengan <b>m-PIN</b> Anda.'
    ],
    BNI: [
      'Buka aplikasi <b>BNI Mobile Banking</b> dan masuk ke akun Anda.',
      selectedBank.code === 'BNI'
        ? 'Pilih menu <b>Transfer</b>, lalu pilih <b>Virtual Account Billing</b>.'
        : `Pilih menu <b>Transfer</b> dan transfer ke <b>${selectedBank.name}</b>.`,
      `Masukkan nomor Virtual Account <code>${VA}</code>.`,
      'Pastikan nama penerima <b>VISIORA Creative Lab</b> dan nominal <b>Rp 45.000.000</b> sudah sesuai.',
      'Konfirmasi transaksi dengan <b>password transaksi</b> Anda.'
    ],
    BRI: [
      'Buka aplikasi <b>BRImo</b> dan masuk ke akun Anda.',
      selectedBank.code === 'BRI'
        ? 'Pilih menu <b>Tagihan</b>, lalu pilih <b>BRIVA</b>.'
        : `Pilih menu <b>Transfer</b> dan transfer ke <b>${selectedBank.name}</b>.`,
      `Masukkan nomor Virtual Account <code>${VA}</code>.`,
      'Pastikan nama penerima <b>VISIORA Creative Lab</b> dan nominal <b>Rp 45.000.000</b> sudah sesuai.',
      'Konfirmasi transaksi dengan <b>PIN BRImo</b> Anda.'
    ],
    other: [
      'Buka aplikasi mobile banking atau ATM bank yang ingin Anda gunakan.',
      'Pilih menu <b>Transfer Antarbank</b>.',
      `Pilih <b>${selectedBank.name}</b> sebagai bank tujuan.`,
      `Masukkan nomor Virtual Account <code>${VA}</code>.`,
      'Pastikan nama penerima <b>VISIORA Creative Lab</b> dan nominal <b>Rp 45.000.000</b> sudah sesuai.',
      'Konfirmasi transaksi menggunakan PIN atau token bank Anda.'
    ]
  };

  stepsEl.innerHTML = guides[key]
    .map((text, i) => `
      <div class="step">
        <span class="step-num">${i + 1}</span>
        <p>${text}</p>
      </div>`)
    .join('');
}

function selectGuide(key) {
  tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === key);
  });
  renderSteps(key);
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    selectGuide(btn.dataset.tab);
  });
});

async function loadPaymentProfile() {
  const response = await fetch('/profile-data', {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });

  if (response.status === 401) {
    window.location.assign('login.html');
    return;
  }
  if (!response.ok) {
    throw new Error('Preferensi bank tidak dapat dimuat.');
  }

  const profile = await response.json();
  if (
    typeof profile.preferred_bank !== 'string' ||
    !Object.prototype.hasOwnProperty.call(banks, profile.preferred_bank)
  ) {
    throw new Error('Bank pilihan pada profil tidak valid.');
  }
  if (typeof profile.phone !== 'string' || !profile.phone.trim()) {
    throw new Error('Nomor telepon pada profil tidak tersedia.');
  }

  const phoneDigits = profile.phone.replace(/\D/g, '');
  if (!phoneDigits) {
    throw new Error('Nomor telepon pada profil tidak valid.');
  }

  selectedBank = banks[profile.preferred_bank];
  bankLogo.textContent = selectedBank.code;
  bankName.textContent = `${selectedBank.name} Virtual Account`;
  methodName.textContent = `Metode: ${selectedBank.code} Virtual Account`;

  VA = `${VA_PREFIX}${phoneDigits}`;
  vaNumberEl.textContent = `${VA_PREFIX} ${phoneDigits.match(/.{1,4}/g).join(' ')}`;
  copyVAButton.disabled = false;

  tabButtons.forEach(btn => {
    btn.disabled = false;
  });
  selectGuide(profile.preferred_bank);
}

loadPaymentProfile().catch(error => {
  console.error('Data pembayaran tidak dapat dimuat.', error);
  bankName.textContent = 'Bank pilihan tidak dapat dimuat.';
  methodName.textContent = 'Preferensi bank tidak tersedia';
  vaNumberEl.textContent = 'Nomor Virtual Account tidak dapat dimuat.';
  stepsEl.textContent = 'Data bank dan nomor telepon tidak dapat dimuat. Silakan masuk kembali atau coba lagi.';
  alert('Data bank dan nomor telepon tidak dapat dimuat. Silakan masuk kembali atau coba lagi.');
});

/* ================= CEK STATUS PEMBAYARAN ================= */
const checkBtn = document.getElementById('checkStatus');
checkBtn.addEventListener('click', () => {
  const label = checkBtn.querySelector('span');
  const original = label.textContent;
  checkBtn.classList.add('loading');
  label.textContent = 'Memeriksa...';
  setTimeout(() => {
    checkBtn.classList.remove('loading');
    label.textContent = 'Pembayaran belum terdeteksi';
    setTimeout(() => { label.textContent = original; }, 2000);
  }, 1800);
});

/* ================= NEWSLETTER ================= */
document.getElementById('newsForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const input = this.querySelector('input');
  const btn = this.querySelector('button');
  btn.textContent = '✓';
  input.value = '';
  setTimeout(() => { btn.textContent = 'Join'; }, 1800);
});