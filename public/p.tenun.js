document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  const revealElements = document.querySelectorAll(".reveal");
  const scoreFill = document.getElementById("scoreFill");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
    if (scoreFill) {
      scoreFill.style.width = "100%";
    }
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);

        if (entry.target.classList.contains("score-card") && scoreFill) {
          scoreFill.style.width = "100%";
        }
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${(index % 4) * 70}ms`;
    revealObserver.observe(element);
  });

  const counters = document.querySelectorAll(".count[data-target]");
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const counter = entry.target;
      const target = Number(counter.dataset.target);
      const duration = 1400;
      const start = performance.now();

      const updateCounter = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        counter.textContent = String(Math.round(target * easedProgress));

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };

      requestAnimationFrame(updateCounter);
      observer.unobserve(counter);
    });
  }, { threshold: 0.6 });

  counters.forEach((counter) => counterObserver.observe(counter));
});