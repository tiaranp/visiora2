/* =========================================================
   VISIORA - Daftar Klien
   ========================================================= */
(function () {
  "use strict";

  const $ = (selector, context = document) => context.querySelector(selector);
  const form = $("#signupForm");
  const fullName = $("#fullName");
  const email = $("#email");
  const phone = $("#phone");
  const address = $("#address");
  const preferredBank = $("#preferredBank");
  const password = $("#password");
  const confirmPw = $("#confirm");
  const agree = $("#agree");
  const submitBtn = $("#submitBtn");
  const toastEl = $("#toast");

  let toastTimer;
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 4000);
  }

  $("#togglePw").addEventListener("click", () => {
    const show = password.type === "password";
    password.type = show ? "text" : "password";
    confirmPw.type = show ? "text" : "password";
    $("#togglePw").setAttribute("aria-label", show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    $(".submit__text", submitBtn).textContent = "Membuat akun...";

    try {
      const tokenResponse = await fetch("/csrf-token", {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      });

      if (!tokenResponse.ok) {
        throw new Error("Sesi keamanan tidak dapat dibuat. Muat ulang halaman dan coba lagi.");
      }

      const tokenData = await tokenResponse.json();
      const response = await fetch("/register", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": tokenData.token,
        },
        body: JSON.stringify({
          name: fullName.value,
          email: email.value,
          phone: phone.value,
          address: address.value,
          preferred_bank: preferredBank.value,
          password: password.value,
          password_confirmation: confirmPw.value,
          terms_accepted: agree.checked,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        const errors = result.errors || {};
        const firstError = Object.keys(errors).map((field) => errors[field][0]).find(Boolean);
        toast(firstError || result.message || "Pendaftaran gagal. Coba lagi.");
        return;
      }

      toast(result.message || "Akun berhasil dibuat.");
      window.setTimeout(() => window.location.assign("beranda.html"), 600);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Pendaftaran gagal terhubung ke server.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
      $(".submit__text", submitBtn).textContent = "Daftar & Aktivasi Akun Klien";
    }
  });
})();
