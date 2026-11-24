/* ==========================================================
   VISIORA - login.js
   Login backend, tampilkan sandi, toast, menu mobile
   ========================================================== */

const $ = (id) => document.getElementById(id);

const form = $("loginForm");
const emailInput = $("email");
const pwInput = $("password");
const emailError = $("emailError");
const pwError = $("pwError");
const submitBtn = $("submitBtn");
const remember = $("remember");
const toastEl = $("toast");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let toastTimer;
function showToast(message, type = "success") {
  toastEl.textContent = message;
  toastEl.className = `show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toastEl.className = ""), 3000);
}

function setError(input, errorEl, message = "") {
  input.classList.toggle("is-error", Boolean(message));
  errorEl.textContent = message;
  errorEl.classList.toggle("hidden", !message);
}

emailInput.addEventListener("input", () => setError(emailInput, emailError));
pwInput.addEventListener("input", () => setError(pwInput, pwError));

const EYE_OPEN =
  '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>';
const EYE_OFF =
  '<path d="M3 3l18 18"/><path d="M10.6 6.1A9.8 9.8 0 0112 6c6 0 10 6 10 6a17 17 0 01-3.2 3.9M6.6 6.6C3.6 8.4 2 12 2 12s4 7 10 7a9.7 9.7 0 004.4-1"/>';

$("togglePw").addEventListener("click", (event) => {
  const showing = pwInput.type === "text";
  pwInput.type = showing ? "password" : "text";
  event.currentTarget.setAttribute("aria-label", showing ? "Tampilkan kata sandi" : "Sembunyikan kata sandi");
  event.currentTarget.querySelector("svg").innerHTML = showing ? EYE_OPEN : EYE_OFF;
});

function setLoading(isLoading) {
  submitBtn.classList.toggle("btn-loading", isLoading);
  submitBtn.disabled = isLoading;
  submitBtn.innerHTML = isLoading
    ? '<span class="spinner"></span><span>Memproses...</span>'
    : "Masuk";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setLoading(true);
  setError(emailInput, emailError);
  setError(pwInput, pwError);

  try {
    const tokenResponse = await fetch("/csrf-token", {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });

    if (!tokenResponse.ok) {
      throw new Error("Sesi keamanan tidak dapat dibuat. Muat ulang halaman dan coba lagi.");
    }

    const tokenData = await tokenResponse.json();
    const response = await fetch("/login", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": tokenData.token,
      },
      body: JSON.stringify({
        email: emailInput.value,
        password: pwInput.value,
        remember: remember.checked,
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      const errors = result.errors || {};
      setError(emailInput, emailError, errors.email ? errors.email[0] : "");
      setError(pwInput, pwError, errors.password ? errors.password[0] : "");
      showToast(result.message || "Tidak dapat masuk. Periksa kembali data Anda.", "error");
      return;
    }

    showToast(result.message || "Berhasil masuk.", "success");
    window.location.assign(result.redirect);
  } catch (error) {
    showToast(error instanceof Error ? error.message : "Login gagal terhubung ke server.", "error");
  } finally {
    setLoading(false);
  }
});

const menuBtn = $("menuBtn");
const mobileNav = $("mobileNav");
menuBtn.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

$("newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.target.querySelector("input");
  if (!EMAIL_RE.test(input.value.trim())) {
    showToast("Masukkan email yang valid.", "error");
    return;
  }
  showToast("Terima kasih sudah berlangganan!", "success");
  event.target.reset();
});
