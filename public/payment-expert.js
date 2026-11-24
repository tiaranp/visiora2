(() => {
  const experts = {
    alexander: { name: "Alexander Vance", role: "Design Director" },
    clara: { name: "Clara Santoso", role: "Brand Strategist" },
    julian: { name: "Julian Rasyid", role: "3D & Motion Artist" },
    marcus: { name: "Marcus Wijaya", role: "Creative Technologist" },
    nadira: { name: "Nadira Kencana", role: "UI/UX Architect" },
    saskia: { name: "Saskia Putri", role: "Interaction Designer" },
  };
  const params = new URLSearchParams(window.location.search);
  const expertId = params.get("expert") || sessionStorage.getItem("visiora:paymentExpert");
  const expert = Object.prototype.hasOwnProperty.call(experts, expertId)
    ? experts[expertId]
    : null;

  if (!expert) {
    return;
  }

  sessionStorage.setItem("visiora:paymentExpert", expertId);

  document.querySelectorAll("[data-checkout-expert-name]").forEach((element) => {
    element.textContent = expert.name;
  });
  document.querySelectorAll("[data-checkout-expert-role]").forEach((element) => {
    element.textContent = expert.role;
  });

  const initials = expert.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  document.querySelectorAll("[data-checkout-expert-initials]").forEach((element) => {
    element.textContent = initials;
  });
})();
