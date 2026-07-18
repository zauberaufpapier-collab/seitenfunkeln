const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");

if (menuButton && menu) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Menü öffnen");
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(willOpen));
    menuButton.setAttribute("aria-label", willOpen ? "Menü schließen" : "Menü öffnen");
    menu.classList.toggle("is-open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuButton.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) closeMenu();
  });
}

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const toast = document.querySelector("[data-toast]");
let toastTimer;

function showToast(message) {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 5200);
}

document.querySelectorAll("[data-affiliate-placeholder]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("Vor dem Livegang wird hier dein persönlicher Digistore24-Affiliate-Link eingesetzt.");
  });
});

document.querySelectorAll("[data-download-consent]").forEach((container) => {
  const checkbox = container.querySelector("[data-download-ack]");
  const link = container.querySelector("[data-download-link]");
  if (!checkbox || !link) return;

  const syncState = () => {
    const isConfirmed = checkbox.checked;
    link.classList.toggle("is-disabled", !isConfirmed);
    link.setAttribute("aria-disabled", String(!isConfirmed));
  };

  syncState();
  checkbox.addEventListener("change", syncState);
  link.addEventListener("click", (event) => {
    if (checkbox.checked) return;
    event.preventDefault();
    checkbox.focus();
    showToast("Bitte lies und bestätige zuerst die Hinweise zum Download.");
  });
});
