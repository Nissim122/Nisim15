/* public/scripts/policy-router.js */
(function () {
  const MAP = {
    accessibility: "/pages/accessibility.html",
    privacy: "/pages/privacy.html"
  };

  function openInNewTab(url) {
    const w = window.open(url, "_blank", "noopener");
    if (!w) window.location.assign(url);
  }

  function go(key) {
    const url = MAP[key];
    if (url) openInNewTab(url);
  }

  function activate(el) {
    const key = el.getAttribute("data-open-page");

    // ביטול ניווט טבעי של <a>
    el.setAttribute("href", "javascript:void(0)");
    el.removeAttribute("target"); // מונע פתיחה כפולה אם נשאר target בקוד
    el.removeAttribute("rel");

    const on = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      go(key);
      return false;
    };

    // קושרים מוקדם כדי לתפוס לפני ברירת המחדל
    el.addEventListener("click", on, { capture: true });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " " || e.code === "Space") {
        on(e);
      }
    }, { capture: true });

    // נגישות בסיסית
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
    if (!el.hasAttribute("role")) el.setAttribute("role", "link");
    if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", el.textContent.trim());
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-open-page]").forEach(activate);
  });
})();
