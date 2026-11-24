const profileFields = {
  name: ["profileName", "profileDetailsName"],
  email: ["profileEmail", "profileDetailsEmail"],
  phone: ["profilePhone", "profileDetailsPhone"],
  address: ["profileAddress", "profileDetailsAddress"],
  preferred_bank: ["profileBank"],
};

function setProfileValue(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value || "Belum diisi";
  }
}

function renderSelectedExperts() {
  const container = document.getElementById("selectedExperts");
  if (!container) {
    return;
  }

  try {
    const storedExperts = localStorage.getItem("visiora:selectedExperts");
    const experts = storedExperts ? JSON.parse(storedExperts) : [];
    if (!Array.isArray(experts)) {
      throw new Error("Format data ahli pilihan tidak valid.");
    }

    container.replaceChildren();
    if (experts.length === 0) {
      const emptyState = document.createElement("p");
      emptyState.className = "team-empty";
      emptyState.append("Belum ada ahli dipilih. ");

      const link = document.createElement("a");
      link.href = "tim%20ahli.html#tim-ahli";
      link.textContent = "Pilih ahli dari Tim Ahli";
      emptyState.append(link, ".");
      container.append(emptyState);
      return;
    }

    experts.forEach((expert) => {
      if (
        !expert ||
        typeof expert.id !== "string" ||
        typeof expert.name !== "string" ||
        typeof expert.role !== "string" ||
        typeof expert.roomChat !== "string" ||
        !/^rc[a-z]+\.html$/.test(expert.roomChat)
      ) {
        throw new Error("Data ahli pilihan tidak lengkap atau tidak valid.");
      }

      const member = document.createElement("div");
      member.className = "member";

      const avatar = document.createElement("div");
      avatar.className = "member-avatar";
      const initials = expert.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
      avatar.textContent = initials;

      if (typeof expert.image === "string" && /^images\/[A-Za-z0-9 ._-]+\.(?:jpg|jpeg|png|webp)$/i.test(expert.image)) {
        const image = document.createElement("img");
        image.src = expert.image;
        image.alt = expert.name;
        image.addEventListener("error", () => {
          avatar.textContent = initials;
        }, { once: true });
        avatar.replaceChildren(image);
      }

      const info = document.createElement("div");
      info.className = "member-info";

      const name = document.createElement("div");
      name.className = "member-name";
      name.textContent = expert.name;

      const role = document.createElement("div");
      role.className = "member-role";
      role.textContent = expert.role;

      const note = document.createElement("div");
      note.className = "member-note";
      note.textContent = "Ahli pilihan Anda";

      info.append(name, role, note);

      const chatLink = document.createElement("a");
      chatLink.className = "chat-btn";
      chatLink.href = expert.roomChat;
      chatLink.setAttribute("aria-label", `Chat ${expert.name}`);
      chatLink.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/></svg>';

      member.append(avatar, info, chatLink);
      container.append(member);
    });
  } catch (error) {
    console.error("Tim Kurator tidak dapat dimuat.", error);
    const errorState = document.createElement("p");
    errorState.className = "team-empty";
    errorState.textContent = "Data Tim Kurator tidak dapat dimuat.";
    container.replaceChildren(errorState);
  }
}

renderSelectedExperts();

fetch("/profile-data", {
  credentials: "same-origin",
  headers: { Accept: "application/json" },
})
  .then((response) => {
    if (response.status === 401) {
      window.location.assign("login.html");
      return null;
    }
    if (!response.ok) {
      throw new Error("Data profil tidak dapat dimuat.");
    }
    return response.json();
  })
  .then((profile) => {
    if (!profile) {
      return;
    }

    Object.entries(profileFields).forEach(([field, elementIds]) => {
      elementIds.forEach((id) => setProfileValue(id, profile[field]));
    });

    const initials = profile.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
    setProfileValue("profileInitials", initials);
  })
  .catch((error) => {
    setProfileValue("profileName", error.message);
    ["profileEmail", "profilePhone", "profileAddress", ...Object.values(profileFields).flat()]
      .forEach((id) => setProfileValue(id, "Tidak dapat dimuat"));
  });

// Cegah halaman lompat ke atas saat link "#" diklik
  document.querySelectorAll('a[href="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) { e.preventDefault(); });
  });

  // Tombol "Keluar Dari Semua Sesi Lain"
  document.querySelector('.btn-outline').addEventListener('click', function () {
    alert('Semua sesi lain telah dikeluarkan.');
  });

  // Tombol "Hubungi Tim Kurator"
  document.querySelector('.btn-light').addEventListener('click', function () {
    alert('Menghubungkan Anda ke Tim Kurator...');
  });