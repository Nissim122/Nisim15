/* ===========================================================
   📦 Offer Popup – Smart Reappear Logic
   =========================================================== */

function showOfferPopup(data) {
  try {
    const storageKey = "offerPopupLastShown";
    const versionKey = "offerPopupVersion";

    // גרסה נוכחית (hash או מזהה תוכן)
    const currentVersion =
      data.version ||
      `${data.title || ""}_${data.text || ""}_${data.buttonText || ""}`.trim();

    // שליפת נתוני עבר
    const lastShown = Number(sessionStorage.getItem(storageKey)) || 0;
    const lastVersion = sessionStorage.getItem(versionKey) || "";
    const repeatAfter = Number(data.repeatAfterHours) || 24; // שעות

    const hoursPassed = (Date.now() - lastShown) / (1000 * 60 * 60);

    // ✅ תנאי ההצגה:
    const shouldShow =
      hoursPassed >= repeatAfter || currentVersion !== lastVersion;

    if (!shouldShow) {
      console.log(
        `⏳ הפופאפ לא יוצג (עברו רק ${hoursPassed.toFixed(
          2
        )} שעות, ואין שינוי תוכן)`
      );
      return;
    }

    // מחיקה של מופעים קודמים
    document.querySelectorAll(".offer-popup, .offer-overlay").forEach(el => el.remove());

    // יצירת רקע
    const overlay = document.createElement("div");
    overlay.className = "offer-overlay";

    // יצירת הפופאפ
    const popup = document.createElement("div");
    popup.className = "offer-popup";
    popup.innerHTML = `
      <button class="offer-close" aria-label="סגור פופאפ">✖</button>
      <div class="offer-content" style="background-image:url('${data.bgImage || ""}')">
        <div class="offer-text-wrap">
          <h2 class="offer-title">${data.title || "מבצע מיוחד 🎁"}</h2>
          <p class="offer-text">${data.text || "קבלו 25% הנחה על כל השירותים שלנו!"}</p>
          <a href="${data.buttonLink || "#"}" class="offer-btn" target="_blank">${data.buttonText || "אני רוצה"}</a>
        </div>
      </div>
    `;

    // הוספה ל־DOM
    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    requestAnimationFrame(() => {
      overlay.classList.add("active");
      popup.classList.add("visible");
    });

    console.log("🎯 הפופאפ מוצג מעל כל הדף (סגירה רק באיקס)");

    // סגירה רק באיקס
    const close = () => {
      popup.classList.remove("visible");
      overlay.classList.remove("active");
      setTimeout(() => {
        overlay.remove();
        popup.remove();

        // שמירת זמן וגרסה נוכחית
        sessionStorage.setItem(storageKey, Date.now());
        sessionStorage.setItem(versionKey, currentVersion);
        console.log(
          `🕒 הפופאפ נסגר – ייפתח שוב רק אם יעברו ${repeatAfter} שעות או שתוכן חדש יוגדר`
        );
      }, 400);
    };

    popup.querySelector(".offer-close").addEventListener("click", close);
  } catch (err) {
    console.error("❌ OfferPopup Error:", err);
  }
}
