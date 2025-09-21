/* assets/animations/animations.js
 * 🎬 Animation Gate (v1) — Profile In only
 * תנאים להפעלה: features.animationsEnabled === true + isInitialized + cardReady
 * שימוש: סמן אלמנט(ים) עם [data-anim][data-anim-target="profile"] ואופציונלי data-anim-delay="400ms"
 */
(function () {
  try {
    // --- הגדרות בסיס ---
    const enabled = (window.cardData?.features?.animationsEnabled === true);
    if (!enabled) return; // ברירת מחדל: כבוי, לא עושים כלום

    const START_DELAY_MS = Number(window.cardData?.features?.animationStartDelayMs ?? 0);
    const DEBUG = false;
    const log = (...a) => DEBUG && console.log("🎬 AnimGate:", ...a);

    // --- עוזר המתנה קטן ---
    function waitFor(pred, { interval = 60, timeout = 15000 } = {}) {
      return new Promise((resolve, reject) => {
        const t0 = Date.now();
        const id = setInterval(() => {
          try {
            if (pred()) { clearInterval(id); resolve(true); }
            else if (Date.now() - t0 > timeout) { clearInterval(id); reject(new Error("timeout")); }
          } catch (e) { clearInterval(id); reject(e); }
        }, interval);
      });
    }

    // --- בחירת אלמנטים ל"כניסת פרופיל" ---
    function getProfileNodes() {
      return Array.from(document.querySelectorAll('[data-anim][data-anim-target="profile"]'));
    }

    // --- אימות טעינת תמונות בפרופיל ---
    function profileImagesLoaded() {
      const nodes = getProfileNodes();
      if (!nodes.length) return true;
      const imgs = nodes.flatMap(n => {
        const inner = Array.from(n.querySelectorAll("img"));
        return n.tagName === "IMG" ? [n, ...inner] : inner;
      });
      if (!imgs.length) return true;
      return imgs.every(img => img.complete && img.naturalWidth > 0);
    }

    // --- החלת דיליי פר־אלמנט (data-anim-delay) ---
    function applyPerElementDelays() {
      getProfileNodes().forEach(node => {
        const d = node.getAttribute("data-anim-delay");
        if (d && !node.__animDelayApplied) {
          node.style.animationDelay = d.trim(); // "400ms" / "0.25s"
          node.__animDelayApplied = true;
        }
      });
    }

    // --- שחרור גלובלי (CSS שלך כבר על pause/play) ---
    function release() {
      document.body.classList.add("anim-ready");
      log("released");
    }

    // --- מעקב אם cardReady נורה לפני שהמאזין עלה ---
    const origDispatch = document.dispatchEvent.bind(document);
    document.dispatchEvent = function (ev) {
      if (ev && ev.type === "cardReady") { window.__cardReadyFired = true; }
      return origDispatch(ev);
    };

    // --- הזרימה הראשית ---
    async function armOnce() {
      try {
        // DOM מוכן
        await waitFor(() => document.readyState !== "loading", { timeout: 10000 });
        // דגל אתחול מוכן
        await waitFor(() => window.isInitialized === true, { timeout: 15000 });

        // המתנה ל-cardReady (או פולבק קצר)
        if (!window.__cardReadyFired) {
          await new Promise(res => {
            const to = setTimeout(res, 3000);
            document.addEventListener("cardReady", () => { clearTimeout(to); res(); }, { once: true });
          });
        }

        // החלת דיליי פר־אלמנט לפני ריצה
        applyPerElementDelays();

        // להמתין לטעינת תמונות הפרופיל
        if (!profileImagesLoaded()) {
          await waitFor(() => profileImagesLoaded(), { timeout: 8000 }).catch(() => { /* נמשיך גם אם נכשל */ });
        }

        // דיליי גלובלי אופציונלי
        if (START_DELAY_MS > 0) {
          await new Promise(r => setTimeout(r, START_DELAY_MS));
        }

        // לשחרר בפריים הבא לרינדור נקי
        requestAnimationFrame(() => requestAnimationFrame(release));
      } catch (e) {
        console.warn("Anim gate error:", e.message);
        // גם במקרה תקלה — לא נתקע את הדף
        release();
      }
    }

    // --- BFCache: חזרה אחורה/קדימה ---
    window.addEventListener("pageshow", (ev) => {
      if (ev.persisted) {
        document.body.classList.remove("anim-ready");
        requestAnimationFrame(() =>
          requestAnimationFrame(() => document.body.classList.add("anim-ready"))
        );
      }
    });

    // --- להריץ עכשיו פעם אחת ---
    armOnce();

    // --- אם הטאב היה מוסתר — לנסות שוב כשנראה ---
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && !document.body.classList.contains("anim-ready")) {
        armOnce();
      }
    });
  } catch (e) {
    console.warn("Animations init error:", e);
  }
})();
