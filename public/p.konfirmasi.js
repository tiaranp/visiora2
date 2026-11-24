// VISIORA - Konfirmasi Sesi : SCRIPT
  // Aktifkan ikon Lucide
  lucide.createIcons();

  // Data sesi
  const SESSION = {
    title: 'Discovery & Strategy Alignment',
    code: '#SCH-2024-VSR-092',
    link: 'https://meet.google.com/vsr-2024-ent',
    start: '20241030T030000Z', // 10:00 WIB
    end:   '20241030T043000Z', // 11:30 WIB
    whatsapp: '6281234567890'
  };

  // Toast
  const toastEl = document.getElementById('toast');
  let toastTimer;
  function toast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }
  document.querySelectorAll('[data-toast]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); toast(el.dataset.toast); });
  });

  // Menu mobile
  document.getElementById('burger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });

  // Masuk ruang Google Meet
  document.getElementById('btnMeet').addEventListener('click', () => {
    window.open(SESSION.link, '_blank', 'noopener');
  });

  // Salin tautan
  document.getElementById('btnCopy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(SESSION.link);
      toast('Tautan ruang Google Meet berhasil disalin!');
    } catch {
      toast('Gagal menyalin. Salin manual: ' + SESSION.link);
    }
  });

  // Google Calendar
  document.getElementById('btnGcal').addEventListener('click', () => {
    const url = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + '&text=' + encodeURIComponent('VISIORA - ' + SESSION.title)
      + '&dates=' + SESSION.start + '/' + SESSION.end
      + '&details=' + encodeURIComponent('Kode sesi ' + SESSION.code + '\n' + SESSION.link)
      + '&location=' + encodeURIComponent(SESSION.link);
    window.open(url, '_blank', 'noopener');
  });

  // iCal / Outlook (.ics)
  document.getElementById('btnIcal').addEventListener('click', () => {
    const ics = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//VISIORA//Sync Hub//ID','BEGIN:VEVENT',
      'UID:' + SESSION.code + '@visiora.id',
      'DTSTART:' + SESSION.start,'DTEND:' + SESSION.end,
      'SUMMARY:VISIORA - ' + SESSION.title,
      'DESCRIPTION:Kode sesi ' + SESSION.code,
      'LOCATION:' + SESSION.link,'END:VEVENT','END:VCALENDAR'
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'sesi-visiora.ics';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('File kalender (.ics) berhasil diunduh!');
  });

  // Unduh E-Pass (PDF) lewat dialog cetak browser
  document.getElementById('btnPdf').addEventListener('click', () => {
    toast('Menyiapkan E-Pass (PDF)...');
    setTimeout(() => window.print(), 600);
  });

  // Reschedule & batalkan
  document.getElementById('btnResched').addEventListener('click', () => {
    toast('Membuka pilihan jadwal baru...');
  });
  document.getElementById('btnCancel').addEventListener('click', () => {
    if (confirm('Yakin ingin membatalkan pertemuan ini?')) toast('Pertemuan berhasil dibatalkan.');
  });

  // WhatsApp
  document.getElementById('btnWa').addEventListener('click', () => {
    const text = encodeURIComponent('Halo VISIORA, saya butuh bantuan untuk sesi ' + SESSION.code);
    window.open('https://wa.me/' + SESSION.whatsapp + '?text=' + text, '_blank', 'noopener');
  });

  // Newsletter
  document.getElementById('btnJoin').addEventListener('click', () => {
    const input = document.getElementById('newsEmail');
    if (/^\S+@\S+\.\S+$/.test(input.value)) { toast('Terima kasih sudah berlangganan!'); input.value = ''; }
    else toast('Masukkan alamat email yang valid.');
  });