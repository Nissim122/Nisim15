// public/scripts/policy-router.js
(function () {
  // מיפוי בין data-open-page לבין הקבצים ב-/pages/
  const MAP = {
    accessibility: "/pages/accessibility.html"
    // אפשר להוסיף בהמשך:
    // privacy: "/pages/privacy.html",
    // terms: "/pages/terms.html"
  };

  // פתיחה בטאב חדש עם נפילה לאותו חלון אם נחסם ע"י הדפדפן
  function openInNewTab(url) {
    const w = window.open(url, "_blank", "noopener");
    if (!w) window.location.assign(url);
  }

  // מעבר לדף (טאב חדש)
  function go(key) {
    const url = MAP[key];
    if (url) openInNewTab(url);
  }

  // חיבור לאלמנטים עם data-open-page
  function activate(el) {
    const key = el.getAttribute("data-open-page");

    const on = (e) => {
      e.preventDefault();
      go(key);
    };

    el.addEventListener("click", on);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " " || e.code === "Space") {
        e.preventDefault();
        on(e);
      }
    });

    // נגישות בסיסית
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
    if (!el.hasAttribute("role")) el.setAttribute("role", "link");
    if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", el.textContent.trim());
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-open-page]").forEach(activate);
  });
})();
