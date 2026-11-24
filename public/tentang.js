// ==================== MENU MOBILE ====================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Tutup menu saat link diklik
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ==================== LINK AKTIF SAAT SCROLL ====================
const links = navLinks.querySelectorAll('a');

links.forEach((link) => {
  link.addEventListener('click', () => {
    links.forEach((l) => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// ==================== ANIMASI REVEAL SAAT SCROLL ====================
const revealTargets = document.querySelectorAll(
  '.hero-text, .philosophy-card, .story-text, .story-image, .vm-card, .value-card, .team-head, .member, .cta-inner'
);

revealTargets.forEach((el) => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((el) => observer.observe(el));

// ==================== NEWSLETTER ====================
const form = document.getElementById('newsletterForm');
const emailInput = document.getElementById('emailInput');
const msg = document.getElementById('newsletterMsg');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();

  if (!email) return;

  msg.textContent = 'Thank you! ' + email + ' has been subscribed.';
  form.reset();

  setTimeout(() => (msg.textContent = ''), 4000);
});