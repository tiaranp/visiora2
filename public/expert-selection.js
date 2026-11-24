(function () {
  "use strict";

  const pickButton = document.getElementById("pickExpert");
  if (!pickButton) {
    return;
  }

  const toast = document.getElementById("toast");
  const nameElement = document.querySelector(".profile__name");
  const roleElement = document.querySelector(".profile__role");
  const imageElement = document.querySelector(".profile__photo img");
  const roomChat = window.location.pathname.split("/").pop();

  function showToast(message) {
    if (!toast) {
      return;
    }
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  pickButton.addEventListener("click", () => {
    const name = nameElement ? nameElement.textContent.trim() : "";
    const role = roleElement ? roleElement.textContent.trim() : "";

    if (!name || !role || !/^rc[a-z]+\.html$/.test(roomChat)) {
      showToast("Data ahli tidak lengkap, pilihan tidak dapat disimpan.");
      return;
    }

    const expert = {
      id: roomChat.replace(/\.html$/, ""),
      name,
      role,
      image: imageElement ? imageElement.getAttribute("src") : "",
      roomChat,
    };

    try {
      const storedExperts = localStorage.getItem("visiora:selectedExperts");
      const experts = storedExperts ? JSON.parse(storedExperts) : [];
      if (!Array.isArray(experts)) {
        throw new Error("Format data ahli pilihan tidak valid.");
      }

      const updatedExperts = experts.filter((selected) => selected && selected.id !== expert.id);
      updatedExperts.push(expert);
      localStorage.setItem("visiora:selectedExperts", JSON.stringify(updatedExperts));
      showToast(`${name} tersimpan di Tim Kurator pada profil Anda.`);
    } catch (error) {
      console.error("Pilihan ahli tidak dapat disimpan.", error);
      showToast("Pilihan ahli tidak dapat disimpan. Coba lagi.");
    }
  });
})();
