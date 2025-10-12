document.addEventListener("DOMContentLoaded", () => {
  try {
    const offerData = window.cardData?.offerPopup;
    if (!offerData || !offerData.enabled) return;

    const STORAGE_LAST_DATE = "offerPopupLastDate";
    const STORAGE_INDEX = "offerPopupIndex";

    // ❗ אסור להשתמש ב-|| 30 כדי לא לדרוס 0
    const repeatDaysRaw = Number(offerData.repeatAfterDays);
    const repeatDays = Number.isFinite(repeatDaysRaw) ? repeatDaysRaw : 30;

    // ✅ אם repeatAfterDays = 0 → הפופאפ יוצג תמיד
    const alwaysShow = repeatDays === 0;
    window.__offerAlwaysShow = alwaysShow;

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

    // ⏳ תנאי הצגה: או שעברה התקופה, או שיש גרסה חדשה, או שהוגדר alwaysShow
    if (!versionChanged && !alwaysShow && daysPassed < repeatDays) {
      console.log(`⏳ טרם עברו ${repeatDays} ימים (${daysPassed.toFixed(1)}) – לא מציג שוב`);
      return;
    }

    // 📊 חישוב האינדקס הנוכחי
    let index = Number(localStorage.getItem(STORAGE_INDEX)) || 0;
    if (index >= items.length) index = 0; // איפוס מחזור

    const selected = versionChanged || items[index];
    if (!selected) return;

    // ⏱️ השהיה לפי DATA
    const delayMs = (Number(offerData.delaySeconds) || 0) * 1000;
    console.log(`🎯 פופאפ ${selected.id} יוצג בעוד ${delayMs / 1000} שניות`);

    setTimeout(() => {
      showOfferPopup(selected);

      // שמירה בזיכרון (רק אם לא alwaysShow)
      if (!alwaysShow) {
        localStorage.setItem(STORAGE_LAST_DATE, new Date().toISOString());
        localStorage.setItem(STORAGE_INDEX, versionChanged ? index : index + 1);
        localStorage.setItem(`offerPopupVersion_${selected.id}`, selected.version || "");
      }
    }, delayMs);

  } catch (err) {
    console.error("❌ OfferPopup Sequential Rotation Error:", err);
  }
});


/* ===========================================================
   📦 Offer Popup – Background & Countdown from DATA only (Final Version)
   =========================================================== */
function showOfferPopup(data) {
  try {
    const STORAGE_LAST_DATE = "offerPopupLastDate";
    if (window.__offerPopupActive) {
      console.log("⚠️ הפופאפ כבר פעיל – ביטול פתיחה נוספת");
      return;
    }
    window.__offerPopupActive = true;

    // ניקוי מופעים קודמים
    document.querySelectorAll(".offer-popup, .offer-overlay").forEach(el => el.remove());

    // שכבת רקע
    const overlay = document.createElement("div");
    overlay.className = "offer-overlay";

    // 🎨 רקע דינמי לפי DATA בלבד
    let backgroundStyle = "";
    if (data.bgImage && data.bgImage !== "none") {
      backgroundStyle = `background-image:url('${data.bgImage}'); background-size:cover; background-position:center;`;
    } else if (data.bgColor) {
      backgroundStyle = `background-color:${data.bgColor};`;
    } else {
      backgroundStyle = `background-color:#ffffff;`; // ברירת מחדל
    }

    // 🕒 טיימר מתוך DATA
    const countdownHTML = data.endDate
      ? `<p class="offer-countdown" data-end="${data.endDate}" data-label="${data.countdownText || "המבצע מסתיים בעוד"}"></p>`
      : "";

    // ✨ יצירת הפופאפ בפועל
    const popup = document.createElement("div");
    popup.className = `offer-popup theme-${data.theme || "default"}`;
    popup.dataset.id = data.id;

    popup.innerHTML = `
      <button class="offer-close" data-analytics="offer_popup_close" aria-label="סגור פופאפ">✖</button>
      <div class="offer-content" style="${backgroundStyle}">
        ${countdownHTML}
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

    // הוספה למסך
    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    requestAnimationFrame(() => {
      overlay.classList.add("active");
      popup.classList.add("visible");
    });

    // הפעלת טיימר
    popup.querySelectorAll(".offer-countdown").forEach(startCountdown);

    sendPopupEvent("shown", data);

    // סגירה
    popup.querySelector(".offer-close").addEventListener("click", () => {
      popup.classList.remove("visible");
      overlay.classList.remove("active");
      setTimeout(() => {
        popup.remove();
        overlay.remove();
        window.__offerPopupActive = false;
        // לא לעדכן תאריך אם תמיד מציגים
        if (!window.__offerAlwaysShow) {
          localStorage.setItem(STORAGE_LAST_DATE, new Date().toISOString());
        }
        sendPopupEvent("closed", data);
      }, 400);
    });

    // מעקב אנליטיקס
    popup.addEventListener("click", e => {
      const el = e.target.closest("[data-analytics]");
      if (!el) return;
      const eventName = el.getAttribute("data-analytics");
      sendPopupEvent(eventName, data);
      if (eventName === "offer_popup_cta_click") {
        // לא לעדכן תאריך אם תמיד מציגים
        if (!window.__offerAlwaysShow) {
          localStorage.setItem(STORAGE_LAST_DATE, new Date().toISOString());
        }
        sendPopupEvent("cta", data);
      }
    });
  } catch (err) {
    console.error("❌ OfferPopup Error:", err);
    window.__offerPopupActive = false;
  }
}

/* ===========================================================
   ⏰ Countdown – from DATA only
   =========================================================== */
function startCountdown(el) {
  try {
    const end = new Date(el.dataset.end);
    if (isNaN(end)) {
      el.textContent = "⏳ ללא תאריך סיום";
      return;
    }

    // שליפת טקסט מה־DATA של הפופאפ עצמו
    const popupId = el.closest(".offer-popup")?.dataset.id;
    const popupData = window.cardData?.offerPopup?.items?.find(p => p.id === popupId);
    const label = popupData?.countdownText || el.dataset.label || "המבצע מסתיים בעוד";

    const tick = () => {
      const diff = end - new Date();
      if (diff <= 0) {
        el.textContent = "⏰ המבצע הסתיים!";
        clearInterval(interval);
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      el.textContent = `${label} ${hours} שעות, ${minutes} דקות ו־${seconds} שניות`;
    };

    tick();
    const interval = setInterval(tick, 1000);
  } catch (err) {
    console.error("❌ Countdown Error:", err);
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
