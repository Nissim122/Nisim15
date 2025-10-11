/* ===========================================================
   📦 Offer Popup – Sequential Rotation (1→2→3 Loop) + Version Priority
   =========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  try {
    const offerData = window.cardData?.offerPopup;
    if (!offerData || !offerData.enabled) return;

    const STORAGE_LAST_DATE = "offerPopupLastDate";
    const STORAGE_INDEX = "offerPopupIndex";
    const repeatDays = Number(offerData.repeatAfterDays) || 30;

    const items = (offerData.items || []).filter(i => i.active);
    if (!items.length) return;

    // 🧠 בדיקה אם אחד הפופאפים עודכן בגרסה חדשה
    const versionChanged = items.find(it => {
      const k = `offerPopupVersion_${it.id}`;
      const stored = localStorage.getItem(k) || "";
      return (it.version || "") !== stored;
    });

    const lastDate = localStorage.getItem(STORAGE_LAST_DATE);
    const daysPassed = lastDate
      ? (Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24)
      : Infinity;

    // ⏳ תנאי הצגה: או שעברה התקופה או שיש גרסה חדשה
    if (!versionChanged && daysPassed < repeatDays) {
      console.log(`⏳ טרם עברו ${repeatDays} ימים (${daysPassed.toFixed(1)}) – לא מציג שוב`);
      return;
    }

    // 📊 חישוב האינדקס הנוכחי
    let index = Number(localStorage.getItem(STORAGE_INDEX)) || 0;
    if (index >= items.length) index = 0; // איפוס מחזור

    // אם יש גרסה חדשה, מציג אותה מיד (מתעלם מהסדר)
    const selected = versionChanged || items[index];
    if (!selected) return;

    console.log(`🎯 מציג פופאפ ${selected.id} – ${selected.title}`);

    // הצגה בפועל
    showOfferPopup(selected);

    // שמירה בזיכרון
    localStorage.setItem(STORAGE_LAST_DATE, new Date().toISOString());
    localStorage.setItem(STORAGE_INDEX, versionChanged ? index : index + 1);
    localStorage.setItem(`offerPopupVersion_${selected.id}`, selected.version || "");
  } catch (err) {
    console.error("❌ OfferPopup Sequential Rotation Error:", err);
  }
});

/* ===========================================================
   📦 Offer Popup – Full Declarative Tracking + UI
   =========================================================== */
function showOfferPopup(data) {
  try {
    const STORAGE_LAST_DATE = "offerPopupLastDate";
    if (window.__offerPopupActive) {
      console.log("⚠️ הפופאפ כבר פעיל – ביטול פתיחה נוספת");
      return;
    }
    window.__offerPopupActive = true;

    // ניקוי פופאפים קיימים
    document.querySelectorAll(".offer-popup, .offer-overlay").forEach(el => el.remove());

    // שכבת רקע
    const overlay = document.createElement("div");
    overlay.className = "offer-overlay";

    // גוף הפופאפ
    const popup = document.createElement("div");
    popup.className = `offer-popup theme-${data.theme || "default"}`;
    popup.innerHTML = `
      <button class="offer-close" data-analytics="offer_popup_close" aria-label="סגור פופאפ">✖</button>
      <div class="offer-content" style="background-image:url('${data.bgImage || ""}')">
        <div class="offer-text-wrap">
          <h2 class="offer-title">${data.title || "מבצע מיוחד 🎉"}</h2>
          <p class="offer-text">${data.text || "קבלו 25% הנחה על השירותים שלנו!"}</p>
          <a href="${data.buttonLink || "#"}"
             class="offer-btn"
             target="_blank"
             rel="noopener"
             data-analytics="offer_popup_cta_click">
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

    sendPopupEvent("shown", data);

    // סגירה
    popup.querySelector(".offer-close").addEventListener("click", () => {
      popup.classList.remove("visible");
      overlay.classList.remove("active");
      setTimeout(() => {
        popup.remove();
        overlay.remove();
        window.__offerPopupActive = false;
        localStorage.setItem(STORAGE_LAST_DATE, new Date().toISOString());
        sendPopupEvent("closed", data);
      }, 400);
    });

    // מעקב אנליטיקס על לחיצות
    popup.addEventListener("click", e => {
      const el = e.target.closest("[data-analytics]");
      if (!el) return;
      const eventName = el.getAttribute("data-analytics");
      sendPopupEvent(eventName, data);
      if (eventName === "offer_popup_cta_click") {
        localStorage.setItem(STORAGE_LAST_DATE, new Date().toISOString());
        sendPopupEvent("cta", data);
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
    if (typeof gtag !== "function") return;
    const label = data.id || "unknown";
    gtag("event", `offer_popup_${action}`, {
      event_category: "Offer Popup",
      event_label: label,
      offer_id: data.id,
      offer_title: data.title || "",
      offer_version: data.version || "",
      offer_button_text: data.buttonText || "",
      offer_link: data.buttonLink || "",
      timestamp: new Date().toISOString()
    });
    console.log(`📈 GA Event → offer_popup_${action} (${label})`);
  } catch (err) {
    console.error("❌ GA Event Error:", err);
  }
}
