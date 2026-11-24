const backDestinations = {
  "beranda.html": { href: "portofolio.html#portfolio-grid", label: "Portofolio" },
  "layanan.html": { href: "beranda.html#layanan", label: "Beranda" },
  "portofolio.html": { href: "beranda.html#portofolio", label: "Beranda" },
  "tentang.html": { href: "beranda.html#tentang", label: "Beranda" },
  "tim ahli.html": { href: "beranda.html#beranda", label: "Beranda" },
  "login.html": { href: "beranda.html#beranda", label: "Beranda" },
  "jadwal.html": { href: "beranda.html#kontak", label: "Beranda" },
  "p.konfirmasi.html": { href: "jadwal.html", label: "Jadwal" },
  "payment.html": { href: "beranda.html#kontak", label: "Beranda" },
  "roomchat.html": { href: "jadwal.html", label: "Jadwal" },
  "p.aurora.html": { href: "portofolio.html#portfolio-grid", label: "Portofolio" },
  "p.kopisenja.html": { href: "portofolio.html#portfolio-grid", label: "Portofolio" },
  "p.tenun.html": { href: "portofolio.html#portfolio-grid", label: "Portofolio" },
  "p.nusa.html": { href: "portofolio.html#portfolio-grid", label: "Portofolio" },
  "p.medicare.html": { href: "portofolio.html#portfolio-grid", label: "Portofolio" },
  "p.konstruksi.html": { href: "portofolio.html#portfolio-grid", label: "Portofolio" }
};

const currentPage = decodeURIComponent(window.location.pathname.split("/").pop() || "");
const destination = backDestinations[currentPage];

if (destination) {
  const backLinks = document.querySelectorAll(".back-link");

  function hasInternalReferrer() {
    if (!document.referrer || window.history.length < 2) {
      return false;
    }

    const referrer = new URL(document.referrer);
    const currentDirectory = new URL(".", window.location.href).pathname;
    const referrerDirectory = referrer.pathname.slice(0, referrer.pathname.lastIndexOf("/") + 1);

    return referrer.origin === window.location.origin && referrerDirectory === currentDirectory;
  }

  function handleBack(event) {
    if (hasInternalReferrer()) {
      event.preventDefault();
      window.history.back();
    }
  }

  if (backLinks.length > 0) {
    backLinks.forEach((backLink) => {
      backLink.href = destination.href;
      backLink.addEventListener("click", handleBack);
    });
  }
}
