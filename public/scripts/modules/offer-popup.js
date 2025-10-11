/* ===========================================================
   📦 Offer Popup – Smart Analytics + Full Declarative Tracking
   =========================================================== */

function showOfferPopup(data) {
  try {
    const STORAGE_KEY = "offerPopupLastShown";
    const VERSION_KEY = "offerPopupVersion";
    const CLOSE_COUNT_KEY = "offerPopupCloseCount";
    const CTA_COUNT_KEY = "offerPopupCtaCount";

    // ✅ מניעת פתיחה כפולה
    if (window.__offerPopupActive) {
      console.log("⚠️ הפופאפ כבר פעיל – מבטל פתיחה נוספת");
      return;
    }
    window.__offerPopupActive = true;

    // 🔍 בדיקת טעינה של CSS
    if (!document.querySelector('link[href*="offer-popup.css"]')) {
      console.warn("⚠️ offer-popup.css לא נטען – בדוק את הנתיב או את הקובץ");
    }

    // ⚙️ יצירת מזהה גרסה לפי התוכן
    const currentVersion =
      data.version ||
      `${data.title || ""}_${data.text || ""}_${data.buttonText || ""}`.trim();

    // 📦 נתונים קודמים
    const lastShown = Number(localStorage.getItem(STORAGE_KEY)) || 0;
    const lastVersion = localStorage.getItem(VERSION_KEY) || "";
    const repeatAfter = Number(data.repeatAfterHours) || 24;
    const hoursPassed = (Date.now() - lastShown) / (1000 * 60 * 60);

    // ✅ הצגה רק אם עבר הזמן או התוכן חדש
    const shouldShow =
      hoursPassed >= repeatAfter || currentVersion !== lastVersion;

    if (!shouldShow) {
      console.log(
        `⏳ הפופאפ לא יוצג (עברו רק ${hoursPassed.toFixed(
          2
        )} שעות, ואין שינוי תוכן)`
      );
      window.__offerPopupActive = false;
      return;
    }

    // 🧹 ניקוי מופעים קודמים
    document.querySelectorAll(".offer-popup, .offer-overlay").forEach(el => el.remove());

    // 🎨 רקע
    const overlay = document.createElement("div");
    overlay.className = "offer-overlay";

    // 💬 פופאפ עם data-analytics על כל פקד חשוב
    const popup = document.createElement("div");
    popup.className = "offer-popup";
    popup.innerHTML = `
      <button
        class="offer-close"
        data-analytics="offer_popup_close"
        data-analytics-context="${data.version || 'unknown'}"
        aria-label="סגור פופאפ"
      >✖</button>
      <div class="offer-content" style="background-image:url('${data.bgImage || ""}')">
        <div class="offer-text-wrap">
          <h2 class="offer-title" data-analytics="offer_popup_title">
            ${data.title || "מבצע מיוחד 🎉"}
          </h2>
          <p class="offer-text">${data.text || "קבלו 25% הנחה על כל השירותים שלנו!"}</p>
          <a href="${data.buttonLink || "#"}"
             class="offer-btn"
             target="_blank"
             rel="noopener"
             data-analytics="offer_popup_cta_click"
             data-analytics-context="${data.version || 'unknown'}">
            ${data.buttonText || "אני רוצה"}
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    requestAnimationFrame(() => {
      overlay.classList.add("active");
      popup.classList.add("visible");
    });

    console.log("🎯 הפופאפ מוצג מעל כל הדף (סגירה רק באיקס)");

    // שליחת אירוע הצגה
    sendPopupEvent("shown", data);

    // 🧩 סגירה רק באיקס
    const close = () => {
      popup.classList.remove("visible");
      overlay.classList.remove("active");

      const currentCloseCount = Number(localStorage.getItem(CLOSE_COUNT_KEY)) || 0;
      localStorage.setItem(CLOSE_COUNT_KEY, currentCloseCount + 1);
      sendPopupEvent("closed", data);

      setTimeout(() => {
        overlay.remove();
        popup.remove();
        window.__offerPopupActive = false;
        localStorage.setItem(STORAGE_KEY, Date.now());
        localStorage.setItem(VERSION_KEY, currentVersion);
        console.log(
          `🕒 הפופאפ נסגר – ייפתח שוב רק אם יעברו ${repeatAfter} שעות או שתוכן חדש יוגדר`
        );
      }, 400);
    };

    popup.querySelector(".offer-close").addEventListener("click", close);

    // 🧠 מעקב על כל פקד עם data-analytics בתוך הפופאפ
    popup.addEventListener("click", (e) => {
      const el = e.target.closest("[data-analytics]");
      if (!el) return;

      const eventName = el.getAttribute("data-analytics");
      const context = el.getAttribute("data-analytics-context") || data.version || "unknown";

      // שליחת אירוע ייעודי ל-GA
      if (typeof gtag === "function") {
        gtag("event", eventName, {
          event_category: "Offer Popup",
          event_label: context,
          offer_version: data.version || "unknown",
          offer_title: data.title || "",
          offer_button_text: data.buttonText || "",
          offer_link: data.buttonLink || "",
          timestamp: new Date().toISOString(),
        });
        console.log(`📈 GA Event → ${eventName} (${context})`);
      }

      // 🟢 ספירת קליקים על כפתור הנעה לפעולה (CTA)
      if (eventName === "offer_popup_cta_click") {
        const currentCtaCount = Number(localStorage.getItem(CTA_COUNT_KEY)) || 0;
        localStorage.setItem(CTA_COUNT_KEY, currentCtaCount + 1);
        sendPopupEvent("cta", data); // ← אירוע גלובלי נוסף ל-GA
      }
    });
  } catch (err) {
    console.error("❌ OfferPopup Error:", err);
    window.__offerPopupActive = false;
  }
}

/* ===========================================================
   📊 GA4 Tracking Helper
   =========================================================== */
function sendPopupEvent(action, data) {
  try {
    if (typeof gtag !== "function") {
      console.warn("⚠️ gtag() לא זמין – האירוע לא נשלח לאנליטיקס");
      return;
    }

    const eventLabel = `offer_popup_${action}`;

    gtag("event", eventLabel, {
      event_category: "Offer Popup",
      event_action: action,
      event_label: data.version || "unknown",
      offer_title: data.title || "",
      offer_version: data.version || "unknown",
      offer_button_text: data.buttonText || "",
      offer_link: data.buttonLink || "",
      timestamp: new Date().toISOString(),
    });

    console.log(`📈 GA Event → ${eventLabel}`);
  } catch (err) {
    console.error("❌ GA Event Error:", err);
  }
}
