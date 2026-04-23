function formatTelHref(phoneNumberRaw) {
  const cleaned = String(phoneNumberRaw || "")
    .trim()
    .replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : null;
}

function formatMailtoHref(emailRaw) {
  const cleaned = String(emailRaw || "").trim();
  if (!cleaned || !cleaned.includes("@")) return null;
  return `mailto:${cleaned}`;
}

async function loadBusinessConfig() {
  try {
    const res = await fetch("business.json", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

function initCurrentYear() {
  const year = String(new Date().getFullYear());
  for (const el of document.querySelectorAll("[data-current-year]")) el.textContent = year;
}

function initProjectAccordions() {
  const items = document.querySelectorAll("[data-project]");
  for (const item of items) {
    const toggle = item.querySelector("[data-project-toggle]");
    const body = item.querySelector("[data-project-body]");
    if (!toggle || !body) continue;

    toggle.setAttribute("aria-expanded", "false");
    body.hidden = true;

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      body.hidden = isOpen;
    });
  }
}

function initPhoneLinks() {
  // Wird in init() mit business.phone befüllt.
  const phone = window.__BUSINESS__?.phone || "";
  const href = formatTelHref(phone);
  for (const a of document.querySelectorAll("[data-phone-link]")) {
    if (href) {
      a.href = href;
      a.textContent = a.textContent.includes("TODO") ? phone : a.textContent;
      a.classList.remove("is-todo");
    } else {
      a.href = "index.html#kontakt";
      a.classList.add("is-todo");
    }
  }
}

function initEmailLinks() {
  const email = window.__BUSINESS__?.email || "";
  const href = formatMailtoHref(email);
  for (const a of document.querySelectorAll("[data-email-link]")) {
    if (href) {
      a.href = href;
      a.textContent = a.textContent.includes("TODO") ? email : a.textContent;
      a.classList.remove("is-todo");
    } else {
      a.href = "impressum.html";
      a.classList.add("is-todo");
    }
  }
}

async function init() {
  window.__BUSINESS__ = (await loadBusinessConfig()) || {};
  initCurrentYear();
  initProjectAccordions();
  initPhoneLinks();
  initEmailLinks();
}

init();
