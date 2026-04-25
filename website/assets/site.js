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
  const items = Array.from(document.querySelectorAll("[data-project]"));
  let openItem = null;
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  function getParts(item) {
    const toggle = item.querySelector("[data-project-toggle]");
    const body = item.querySelector("[data-project-body]");
    return toggle && body ? { toggle, body } : null;
  }

  function stopOngoingAnimation(body) {
    const onEnd = body.__accordionOnEnd;
    if (typeof onEnd === "function") {
      body.removeEventListener("transitionend", onEnd);
      body.removeEventListener("transitioncancel", onEnd);
      body.__accordionOnEnd = null;
    }
  }

  function closeItem(item) {
    const parts = getParts(item);
    if (!parts) return;
    const { toggle, body } = parts;

    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (!isOpen && body.hidden) return;

    stopOngoingAnimation(body);
    toggle.setAttribute("aria-expanded", "false");
    if (openItem === item) openItem = null;

    if (prefersReducedMotion) {
      body.dataset.accordionState = "closed";
      body.style.height = "";
      body.hidden = true;
      return;
    }

    body.hidden = false;
    body.dataset.accordionState = "closed";

    // From current height to 0.
    body.style.height = `${body.scrollHeight}px`;
    // Force reflow so the start height is applied before transitioning.
    body.getBoundingClientRect();
    body.style.height = "0px";

    const onEnd = (ev) => {
      if (ev.propertyName !== "height") return;
      stopOngoingAnimation(body);
      body.style.height = "";
      body.hidden = true;
    };
    body.__accordionOnEnd = onEnd;
    body.addEventListener("transitionend", onEnd);
    body.addEventListener("transitioncancel", onEnd);
  }

  function openItemExclusive(item) {
    const parts = getParts(item);
    if (!parts) return;
    const { toggle, body } = parts;

    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen && !body.hidden) return;

    if (openItem && openItem !== item) closeItem(openItem);

    stopOngoingAnimation(body);
    toggle.setAttribute("aria-expanded", "true");
    openItem = item;

    if (prefersReducedMotion) {
      body.hidden = false;
      body.dataset.accordionState = "open";
      body.style.height = "";
      return;
    }

    body.hidden = false;
    body.dataset.accordionState = "open";

    // From 0 to content height.
    body.style.height = "0px";
    body.getBoundingClientRect();
    body.style.height = `${body.scrollHeight}px`;

    const onEnd = (ev) => {
      if (ev.propertyName !== "height") return;
      stopOngoingAnimation(body);
      body.style.height = "auto";
    };
    body.__accordionOnEnd = onEnd;
    body.addEventListener("transitionend", onEnd);
    body.addEventListener("transitioncancel", onEnd);
  }

  for (const item of items) {
    const parts = getParts(item);
    if (!parts) continue;
    const { toggle, body } = parts;

    toggle.setAttribute("aria-expanded", "false");
    body.dataset.accordionState = "closed";
    body.hidden = true;
    body.style.height = "";

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) closeItem(item);
      else openItemExclusive(item);
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

function initTodoVisibility() {
  const isLocal =
    window.location.protocol === "file:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "[::1]";

  document.documentElement.classList.toggle("show-todos", isLocal);

  for (const el of document.querySelectorAll(".todo")) {
    el.hidden = !isLocal;
  }
}

async function init() {
  window.__BUSINESS__ = (await loadBusinessConfig()) || {};
  initCurrentYear();
  initTodoVisibility();
  initProjectAccordions();
  initPhoneLinks();
  initEmailLinks();
}

init();
