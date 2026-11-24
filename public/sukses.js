// Tombol unduh bukti -> membuka dialog cetak / simpan PDF
document.getElementById('btnDownload').addEventListener('click', function () {
  window.print();
});

// Tombol kembali ke beranda
document.getElementById('btnBack').addEventListener('click', function (e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// (Opsional) Isi data dinamis lewat URL, contoh:
// ?amount=45000000&order=VSR-2026-8891&rrn=992810482910
const params = new URLSearchParams(window.location.search);
if (params.get('amount')) {
  document.getElementById('amount').textContent =
    'Rp ' + Number(params.get('amount')).toLocaleString('id-ID');
}
if (params.get('order')) {
  document.getElementById('orderId').textContent = '#' + params.get('order');
}
if (params.get('rrn')) {
  document.getElementById('rrn').textContent = 'QRIS-' + params.get('rrn');
}