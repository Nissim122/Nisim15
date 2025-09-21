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

    // --- NEW: שם האנימציה מה-DATA (ולא נוגעים ב-delay) ---
    function applyProfileAnimationNameFromData() {
      const map = window.cardData?.animations || {};
      const fallback = "kf-profile-in"; // שם ברירת המחדל התואם ל-CSS שלך
      getProfileNodes().forEach(node => {
        // מאפשר גם הרחבה עתידית לפי data-anim-target, כרגע "profile"
        const key = node.getAttribute("data-anim-target") || "profile";
        const name = map[key] || map.profile || fallback;

        if (name && name !== "none") {
          // חשוב: לעקוף את ה־shorthand מה-CSS באמצעות animationName
          node.style.animationName = name;
          // במקרה שבעבר קבענו "none"
          node.style.removeProperty("opacity");
          node.style.removeProperty("transform");
        } else {
          // אם אין אנימציה לאלמנט הזה – וודא מצב סופי תקין
          node.style.animationName = "none";
          node.style.opacity = "1";
          node.style.transform = "none";
        }
      });
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

        // --- NEW: ליישם שם האנימציה מה-DATA לפני הכל (חשוב לעקוף את ה-CSS) ---
        applyProfileAnimationNameFromData();

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
        // NEW: לוודא שהשם מיושם גם בחזרה מה-cache (למקרה של שינוי DATA)
        applyProfileAnimationNameFromData();
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
        // NEW: ליישם שוב שם מה-DATA לפני armOnce (אם נחוץ)
        applyProfileAnimationNameFromData();
        armOnce();
      }
    });

    // === BG PARALLAX (single, idempotent, managed by animations.js) ===
    function initParallaxBG(){
      try {
        const cfg  = (window.cardData && window.cardData.theme && window.cardData.theme.bg) || {};
        const root = document.documentElement;
        const bg   = document.querySelector(".parallax-bg");
        if (!bg) return;

        // הזרקת משתני CSS מתוך DATA (אם סופקו)
        if (cfg.url)             root.style.setProperty("--card-bg-image", `url("${cfg.url}")`);
        if (cfg.positionX)       root.style.setProperty("--card-bg-position-x", String(cfg.positionX));
        if (cfg.positionY)       root.style.setProperty("--card-bg-position-y", String(cfg.positionY));
        if (cfg.size)            root.style.setProperty("--card-bg-size", String(cfg.size));
        if (cfg.repeat)          root.style.setProperty("--card-bg-repeat", String(cfg.repeat));
        if (cfg.opacity != null) root.style.setProperty("--card-bg-opacity", String(cfg.opacity));
        if (cfg.blur)            root.style.setProperty("--card-bg-blur", String(cfg.blur));
        if (cfg.scrollFactor != null) bg.style.setProperty("--scroll-factor", String(cfg.scrollFactor));

        // מניעת רישום כפול של מאזינים
        if (bg.__parallaxBound) {
          requestAnimationFrame(apply);
          return;
        }

        const getFactor = () =>
          parseFloat(getComputedStyle(bg).getPropertyValue("--scroll-factor")) || 0.3;

        let rafId = null;
        function apply(){
          const offset = window.scrollY * getFactor();
          bg.style.backgroundPosition = `center ${offset}px`;
          rafId = null;
        }
        function onScroll(){
          if (rafId == null) rafId = requestAnimationFrame(apply);
        }

        // הפעלה ראשונית + מאזינים
        apply();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", () => requestAnimationFrame(apply), { passive: true });
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") requestAnimationFrame(apply);
        });

        bg.__parallaxBound = true;
      } catch (e) {
        console.warn("Anim BG Parallax init error:", e);
      }
    }

    // הפעלה: אם cardReady כבר נורה → להפעיל מיד; אחרת פעם אחת כשיינתן
    if (window.__cardReadyFired) {
      initParallaxBG();
    } else {
      document.addEventListener("cardReady", initParallaxBG, { once: true });
    }

    // חזרה מ-BFCache: לרענן פרלקסה
    window.addEventListener("pageshow", (ev) => {
      if (ev.persisted) initParallaxBG();
    });

  } catch (e) {
    console.warn("Animations init error:", e);
  }

})();
