/* ===================== JS: HELPER ===================== */
const rupiah = (n) => 'Rp ' + n.toLocaleString('id-ID');

/* ===================== JS: TAB METODE PEMBAYARAN ===================== */
const methodButtons = document.querySelectorAll('.method');
const panels = document.querySelectorAll('.pay-panel');

methodButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    methodButtons.forEach((b) => b.classList.remove('active'));
    panels.forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

/* ===================== JS: FORMAT INPUT KARTU ===================== */
const cardNumber = document.getElementById('cardNumber');
const cardExp = document.getElementById('cardExp');
const cardCvv = document.getElementById('cardCvv');
const cardName = document.getElementById('cardName');

async function loadRegisteredCardName() {
  const response = await fetch('/profile-data', {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });

  if (response.status === 401) {
    window.location.assign('login.html');
    return;
  }
  if (!response.ok) {
    throw new Error('Nama akun tidak dapat dimuat.');
  }

  const profile = await response.json();
  if (typeof profile.name !== 'string' || !profile.name.trim()) {
    throw new Error('Nama akun tidak tersedia.');
  }

  cardName.value = profile.name.trim().toUpperCase();
}

loadRegisteredCardName().catch((error) => {
  console.error('Nama pada kartu tidak dapat dimuat.', error);
  alert('Nama akun tidak dapat dimuat. Silakan muat ulang halaman atau masuk kembali.');
});

cardNumber.addEventListener('focus', () => {
  if (cardNumber.value.includes('•')) cardNumber.value = '';
});
cardNumber.addEventListener('input', () => {
  const digits = cardNumber.value.replace(/\D/g, '').slice(0, 16);
  cardNumber.value = digits.replace(/(.{4})/g, '$1 ').trim();
});

cardExp.addEventListener('input', () => {
  let d = cardExp.value.replace(/\D/g, '').slice(0, 4);
  if (d.length >= 3) d = d.slice(0, 2) + ' / ' + d.slice(2);
  cardExp.value = d;
});

cardCvv.addEventListener('input', () => {
  cardCvv.value = cardCvv.value.replace(/\D/g, '').slice(0, 3);
});

cardName.addEventListener('input', () => {
  cardName.value = cardName.value.toUpperCase();
});

/* ===================== JS: HITUNG TAGIHAN & VOUCHER ===================== */
const SUBTOTAL = 45000000;
const PPN_RATE = 0.11;
const VALID_VOUCHER = 'VISIORA-EARLY24';
const DISCOUNT_VALUE = 2500000;

const voucherInput = document.getElementById('voucherInput');
const btnApply = document.getElementById('btnApply');
const discountRow = document.getElementById('discountRow');

function renderTotals(discount) {
  const tax = Math.round(SUBTOTAL * PPN_RATE);
  const total = SUBTOTAL + tax - discount;
  document.getElementById('subtotal').textContent = rupiah(SUBTOTAL);
  document.getElementById('tax').textContent = rupiah(tax);
  document.getElementById('discount').textContent = '–' + rupiah(discount);
  document.getElementById('total').textContent = rupiah(total);
  discountRow.style.display = discount > 0 ? 'flex' : 'none';
}

btnApply.addEventListener('click', () => {
  const code = voucherInput.value.trim().toUpperCase();
  if (code === VALID_VOUCHER) {
    renderTotals(DISCOUNT_VALUE);
    btnApply.textContent = 'Terapkan';
    alert('Voucher berhasil diterapkan!');
  } else {
    renderTotals(0);
    alert('Kode voucher tidak valid.');
  }
});

renderTotals(DISCOUNT_VALUE);

/* ===================== JS: TOMBOL BAYAR ===================== */
function redirectToPaymentDetails(page) {
  const expert = new URLSearchParams(window.location.search).get('expert');
  const query = expert ? `?expert=${encodeURIComponent(expert)}` : '';
  window.location.assign(`${page}${query}`);
}

document.getElementById('btnPay').addEventListener('click', () => {
  const selectedMethod = document.querySelector('.method.active');
  if (selectedMethod && selectedMethod.dataset.target === 'panel-va') {
    redirectToPaymentDetails('pay.va.html');
    return;
  }
  if (selectedMethod && selectedMethod.dataset.target === 'panel-qris') {
    redirectToPaymentDetails('pay.qr.html');
    return;
  }

  alert('Pembayaran diproses. Tim VISIORA akan segera menghubungi Anda untuk kickoff proyek.');
});