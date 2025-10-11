let recommendationsSwiper = null;
let isInitialized = false; // ← דגל למניעת טעינה כפולה

// ✅ זיהוי סביבת הפקה או רנדר
const isLive = location.hostname.includes("clix-marketing.co.il") || location.hostname.includes("render.com");
console.log("📡 isLive:", isLive);

// 🔎 SEO: Canonical + OG URL (לפני DOMContentLoaded)
(() => {
  const data = window.cardData || {};
  const pageURL = (() => {
    const u = new URL(window.location.href);
    u.search = ''; u.hash = '';
    return u.origin + u.pathname;
  })();

  // מניעת כפילויות קאנוניקל בדף
  const allCanon = document.querySelectorAll('link[rel="canonical"]');
  allCanon.forEach((n, i) => { if (i > 0) n.remove(); });

  // 1) Canonical
  const canonicalEl = document.querySelector('link[rel="canonical"][data-field="canonicalHref"]');
  if (canonicalEl) {
    let canonical = (typeof data.canonicalHref === 'string' ? data.canonicalHref.trim() : '');
    if (canonical) {
      try {
        const u = new URL(canonical);
        u.search=''; u.hash='';
        const isTemplateGeneric = /\/template\/template-generic\.html$/i.test(u.pathname);
        canonical = isTemplateGeneric ? pageURL : (u.origin + u.pathname);
      } catch { canonical = pageURL; }
    } else { canonical = pageURL; }
    canonicalEl.setAttribute('href', canonical);

    // 2) og:url (אם לא הגיע ב-DATA)
    const ogUrlEl = document.querySelector('meta[property="og:url"][data-field="ogUrl"]');
    const hasOgUrlData = typeof data.ogUrl === 'string' && data.ogUrl.trim() !== '';
    if (ogUrlEl && !hasOgUrlData) ogUrlEl.setAttribute('content', canonical);
  }

  // 3) robots
  const robotsEl = document.querySelector('meta[name="robots"][data-field="metaRobots"]');
  if (robotsEl) {
    const val = (typeof data.metaRobots === 'string' && data.metaRobots.trim()) ? data.metaRobots.trim() : 'index, follow';
    robotsEl.setAttribute('content', val);
  }

  // 4) title / description / keywords
  const titleEl = document.querySelector('title[data-field="pageTitle"]');
  if (titleEl && typeof data.pageTitle === 'string') titleEl.textContent = data.pageTitle;

  const descEl = document.querySelector('meta[name="description"][data-field="metaDescription"]');
  if (descEl && typeof data.metaDescription === 'string') descEl.setAttribute('content', data.metaDescription);

  const kwEl = document.querySelector('meta[name="keywords"][data-field="metaKeywords"]');
  if (kwEl && typeof data.metaKeywords === 'string') kwEl.setAttribute('content', data.metaKeywords);
})();
// 🔧 SEO: Normalize OG Image to absolute URL (append after existing SEO block)
// 🔧 SEO: Normalize OG Image to absolute URL (append after existing SEO block)
(() => {
  const el = document.querySelector('meta[property="og:image"][data-field="ogImage"]');
  if (!el) return;
  const val = (el.getAttribute('content') || '').trim();
  if (!val) return;
  try {
    const abs = new URL(val, location.href).toString();
    el.setAttribute('content', abs);
  } catch {}
})();

// ✅ Ensure <meta name="robots"> exists + apply from DATA (before DOMContentLoaded)
(() => {
  const data = window.cardData || {};
  let tag =
    document.querySelector('meta[name="robots"][data-field="metaRobots"]') ||
    document.querySelector('meta[name="robots"]');

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', 'robots');
    tag.setAttribute('data-field', 'metaRobots');
    document.head.appendChild(tag);
  } else if (!tag.hasAttribute('data-field')) {
    tag.setAttribute('data-field', 'metaRobots');
  }

  const val =
    (typeof data.metaRobots === 'string' && data.metaRobots.trim()) ?
    data.metaRobots.trim() :
    'index, follow';

  tag.setAttribute('content', val);
  console.log('📌 Robots tag ensured:', val);
})();

document.addEventListener("DOMContentLoaded", function () {

  document.body.classList.remove("accessibility-mode");
  document.body.style.filter = "";
  document.body.style.fontSize = "";

  const loader = document.querySelector(".loader-overlay");

  const removeLoader = () => {
    if (loader) {
      loader.classList.add("fade-out");
      setTimeout(() => loader.remove(), 400);
    }
  };
    const isVisuallyReady = () => {
    const mainContent = document.querySelector(".main-content");
    const allImagesLoaded = Array.from(document.images).every(
      (img) => img.complete && img.naturalHeight > 0
    );
    return !!window.cardData && !!mainContent && allImagesLoaded;
  };

  const waitUntilReady = () => {
    const start = Date.now();
    const fallbackTimeout = 2000; // 2 שניות

    const check = () => {
      if (isVisuallyReady()) {
        console.log("✅ הכל נטען ומוצג – מסיר את הספינר");
        removeLoader();
      } else if (Date.now() - start > fallbackTimeout) {
        console.warn("⏱ עברו 10 שניות – מסיר את הספינר כפולבאק");
        removeLoader();
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  };

  window.addEventListener("load", waitUntilReady);

  

  const scrollBtn = document.querySelector('.scroll-to-contact-btn');
const contactForm = document.querySelector('#contactForm');
if (scrollBtn && contactForm) {
  scrollBtn.addEventListener('click', function () {
    contactForm.scrollIntoView({ behavior: 'smooth' });

    // ממתין קצת עד שהגלילה תסתיים, ואז נותן פוקוס לשדה השם
    setTimeout(() => {
      const firstInput = contactForm.querySelector('#fullName');
      if (firstInput) {
        firstInput.focus();
      }
    }, 600); // זמן התאמה לגלילה החלקה
  });
}

});
function formatForWa(phoneDigits = "") {
  const raw = String(phoneDigits).replace(/\D/g, "");
  const noLeadingZeros = raw.replace(/^0+/, "");
  return noLeadingZeros.startsWith("972") ? noLeadingZeros : `972${noLeadingZeros}`;
}


/* =========================
   vCard Auto from DATA – no anchor required
   ========================= */
(() => {
  // שמירה מקומית על אובייקטים כדי לשחרר כתובות קודמות
  let vcardBlob = null;
  let vcardURL  = null;

  // מילוט בסיסי לערכי vCard
  const esc = (v) => String(v ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .trim();

  // נורמליזציה של טלפון ל־+972XXXXXXXXX (ללא תוצאה אם אין ספרות)
  const normalizeILPhone = (digits) => {
    const raw = String(digits || "").replace(/\D/g, "");
    const noLeadingZeros = raw.replace(/^0+/, "");
    if (!noLeadingZeros) return ""; // לא להחזיר +972 ריק
    return noLeadingZeros.startsWith("972") ? `+${noLeadingZeros}` : `+972${noLeadingZeros}`;
  };

  // בניית טקסט vCard מ־window.cardData
  function buildVCard(data) {
    if (!data) return null;

    const fullName = esc(data.fullName || "");
    const parts    = fullName.split(/\s+/);
    const first    = esc(parts[0] || "");
    const last     = esc(parts.slice(1).join(" "));
    const phone    = normalizeILPhone(data.phoneDigits || data.phone || "");
    const email    = esc(data.email || "");
    const role     = esc(data.role || data.jobTitle || "");
    const company  = esc(data.company || data.org || "");
// ✅ הפקת URL אוטומטית לפי סביבת העבודה
const cardUrl = (() => {
  try {
    // 1. דומיין הפקה קבוע
const base = "https://clix-marketing.co.il";
    // 2. נורמליזציה של הנתיב הנוכחי (ללא / בסוף)
    const path = location.pathname.replace(/\/+$/, "");
    // ✅ 3. שימוש קבוע בבסיס ההפקה — גם בלוקאל וגם בפרודקשן
    const full = base + path;
    return esc(full);
  } catch {
    return esc(location.href);
  }
})();


    // שדות אופציונליים ייכנסו רק אם מולאו
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      fullName ? `FN:${fullName}` : "",
      (first || last) ? `N:${last};${first};;;` : "",
      phone ? `TEL;TYPE=CELL:${phone}` : "",
      email ? `EMAIL:${email}` : "",
      role ? `TITLE:${role}` : "",
      company ? `ORG:${company}` : "",
      cardUrl ? `URL:${cardUrl}` : "",
      "END:VCARD",
    ].filter(Boolean);

    return lines.join("\n");
  }

  // יצירת Blob ו־URL (עם ניקוי משאבים קודמים)
  function createVCardBlobAndURL(data) {
    const content = buildVCard(data);
    if (!content) return { blob: null, url: null };

    if (vcardURL) URL.revokeObjectURL(vcardURL);
    vcardBlob = new Blob([content], { type: "text/vcard;charset=utf-8" });
    vcardURL  = URL.createObjectURL(vcardBlob);
    return { blob: vcardBlob, url: vcardURL };
  }

  // הצמדה אוטומטית לכל אלמנט רלוונטי בדף
  function attachVCardToAnchors(url) {
    if (!url) return;

    // 1) עוגן מפורש אם קיים (תמיכה לאחור)
    const legacy = document.getElementById("vcardDownload");
    if (legacy) {
      legacy.href = url;
      legacy.download = (window.cardData?.vcard?.filename || "contact.vcf");
    }

    // 2) כל כפתור/קישור שמוגדר כ"הוסף איש קשר"
    //    - לפי data-field="addContact" או data-action="addContact"
    document.querySelectorAll('[data-field="addContact"], [data-action="addContact"]').forEach(a => {
      if (a.tagName === "A") {
        a.href = url;
        a.setAttribute("download", (window.cardData?.vcard?.filename || "contact.vcf"));
      }
    });
  }

  // הורדה מיידית תכנותית (לא תלויה ב־DOM)
 function triggerVCardDownload(filename = "contact.vcf") {
  // ✅ אם אין URL פעיל – ניצור חדש לפני הורדה
  if (!vcardURL) {
    const res = window.VCardAPI?.refresh?.();
    if (!res?.url) return false;
  }

  const a = document.createElement("a");
  a.href = vcardURL;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  return true;
}


  // רענון מלא: יצירה + הצמדה + עדכון cardData.vcardLink
  function refreshVCard() {
    if (!window.cardData) return { url: null, blob: null };
    const { blob, url } = createVCardBlobAndURL(window.cardData);
    if (url) {
      // נעדכן גם במבנה הנתונים לשימוש כללי (תואם ל-replaceAll הקיים)
      window.cardData.vcardLink = url;
      attachVCardToAnchors(url);
    }
    return { blob, url };
  }

  // חשיפת API גלובלי לשימוש חיצוני
  window.VCardAPI = {
    refresh: refreshVCard,
    getURL: () => vcardURL,
    getBlob: () => vcardBlob,
    download: (filename) => triggerVCardDownload(filename),
  };

  // אתחול אוטומטי כשהעמוד מוכן ו־cardData קיים
  const init = () => {
    if (!window.cardData) return;
    refreshVCard();
  };

  // תמיכה גם ב־DOMContentLoaded וגם ב־load (כיסוי החזרות מהיסטוריה)
  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("pageshow", init);
  window.addEventListener("load", init);
})();

// ✅ טעינה גם כשחוזרים מהיסטוריה
window.addEventListener("pageshow", function () {
  if (window.cardData && !isInitialized) {
    console.log("🔁 Page show – מטעין מחדש את ה־DOM");
    const loadEvent = new Event("load");
    window.dispatchEvent(loadEvent);
  }
});
window.addEventListener("load", function () {
  if (isInitialized) {
    console.log("⚠️ כבר הותחל - מדלג על טעינה חוזרת");
    return;
  }

  console.log("✅ window.load");

  const data = window.cardData;
  if (!data) {
    console.error("❌ window.cardData לא קיים!");
    return;
  }
// ✅ Structured Data JSON-LD injection (with duplicate prevention)
if (data.schema) {
  // בדיקה אם כבר קיים בלוק JSON-LD בעמוד
  const existingLD = document.querySelector('script[type="application/ld+json"]');
  if (!existingLD) {
    const ldJson = document.createElement("script");
    ldJson.type = "application/ld+json";
    ldJson.textContent = JSON.stringify(data.schema, null, 2);
    document.head.appendChild(ldJson);
    console.log("✅ JSON-LD schema injected from DATA");
  } else {
    console.log("⚠️ JSON-LD כבר קיים — לא מוזרק שוב מה-DATA");
  }
}

// ✅ האזנה לכפתור שמירת איש קשר (vCard)
document.addEventListener("click", (e) => {
  const btn = e.target.closest('[data-field="addContact"], [data-action="addContact"]');
  if (!btn) return;

  e.preventDefault();

const filename = window.cardData?.vcard?.filename || "contact.vcf";
const vcfURL   = window.cardData?.vcard?.url || window.cardData?.vcardLink || `/data/${filename}`;
const isChrome = /chrome|crios/i.test(navigator.userAgent);

// ✅ תיקון: מניעת שגיאות ב־www — נורמליזציה חכמה
const cleanOrigin = window.location.origin.startsWith("https://www.")
  ? window.location.origin.replace("https://www.", "https://")
  : window.location.origin;

  // אם יש API פעיל נעדיף אותו
  if (window.VCardAPI?.download) {
    console.log("📇 שימוש ב־VCardAPI.download()");
    window.VCardAPI.download(filename);
    return;
  }

  // אם מדובר בכרום (בעיקר באנדרואיד / iOS) — נפתח בטאב חדש
  if (isChrome) {
    console.log("📂 Chrome מזוהה – פתיחת הקובץ בטאב חדש");
    const fullUrl = vcfURL.startsWith("http")
      ? vcfURL
      : `${cleanOrigin.replace(/\/$/, "")}/${vcfURL.replace(/^\//, "")}`;
    window.open(fullUrl, "_blank");
    return;
  }

  // ✅ דפדפנים אחרים – הורדה ישירה
  try {
    const a = document.createElement("a");
    a.href = vcfURL;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    console.log("📥 הורדת vCard ישירה הופעלה");
  } catch (err) {
    console.error("❌ שגיאה בהורדה:", err);
    window.open(vcfURL, "_blank"); // fallback
  }
});


  











/* ✅ Google Analytics Dynamic Injection */
if (data.googleAnalyticsId) {
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${data.googleAnalyticsId}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(){ dataLayer.push(arguments); };
  gtag("js", new Date());

  // ✅ קונפיג אנליטיקס עם Debug Mode רק בלוקאל
  const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);
  const GA_ID = data.googleAnalyticsId;

  // שולח page_view פעם אחת בלבד
  if (!window.__gaPageViewSent) {
    gtag("config", GA_ID, {
      debug_mode: isLocal,
      send_page_view: true
    });
    window.__gaPageViewSent = true;
  } else {
    gtag("config", GA_ID, { send_page_view: false });
  }

  // ✅ מדידת זמן בדף
  let engagedMs = 0, last = null, vis = !document.hidden;
  const now = () => performance.now();
  const start = () => { if (vis && last == null) last = now(); };
  const stop  = () => { if (last != null) { engagedMs += now() - last; last = null; } };

  document.addEventListener("visibilitychange", () => { 
    vis = !document.hidden; 
    vis ? start() : stop(); 
  });

  window.addEventListener("pagehide", () => {
    stop();
    gtag("event", "time_spent", { engaged_ms: Math.round(engagedMs) });
  });

  start();/* ✅ YouTube PLAY Tracking (drop-in בתוך script-generic.js, בלי למחוק קיים) */
/* ✅ GA4 YouTube Tracking – robust on fresh load (drop-in, hardened) */
(function trackYouTubePlayRobust(){
  const iframeSel    = '.video-section iframe[data-field="youtubeEmbed"], .video-section .video-container iframe';
  const containerSel = '.video-section .video-container';
  const isLocal      = ["localhost","127.0.0.1","127.0.0.1:5500"].includes(location.host);

  /* 🔎 GA Live Logger (כמו בקונסול) */
  try {
    if (!window.__gaLiveLoggerAttached) {
      window.dataLayer = window.dataLayer || [];
      const _push = window.dataLayer.push.bind(window.dataLayer);
      window.dataLayer.push = function(){
        try { console.warn("📡 GA:", ...arguments); } catch(_) {}
        return _push(...arguments);
      };
      window.__gaLiveLoggerAttached = true;
      console.log("✅ live GA logger attached");
    }
  } catch(_) {}

  // ---- small utils ----
  const once = (key, fn) => {
    if (window.__ytOnce && window.__ytOnce[key]) return;
    window.__ytOnce = window.__ytOnce || {};
    window.__ytOnce[key] = true;
    try { fn(); } catch(_){}
  };

  function waitFor(pred, {interval=120, timeout=10000} = {}){
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      const id = setInterval(() => {
        try{
          const v = pred();
          if (v) { clearInterval(id); resolve(v); }
          else if (Date.now() - t0 > timeout) { clearInterval(id); resolve(null); }
        }catch(e){ clearInterval(id); reject(e); }
      }, interval);
    });
  }

  function sendGA(eventName, payload){
    if (typeof window.gtag !== 'function') return;
    const debug = isLocal ? { debug_mode: true } : {};
    window.gtag('event', eventName, { ...payload, ...debug });
  }

  // ---- load YT Iframe API once ----
  function injectYT(){
    once('ytApiInjected', () => {
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function(){
        try { if (typeof prev === 'function') prev(); } catch(_){}
        const cbs = (window.__ytReadyCbs || []).splice(0);
        cbs.forEach(cb => { try{ cb(); }catch(_){ } });
      };
    });
  }
  window.__ytReadyCbs = window.__ytReadyCbs || [];
  function onYTReady(cb){ window.__ytReadyCbs.push(cb); }

  /* 🧩 forceParams: הכרחת enablejsapi+origin + reload קשיח */
  function forceParams(iframe){
    try{
      const current = iframe.getAttribute('src') || '';
      if (!current) return false;
      const u = new URL(current, location.href);
      const hostpath = (u.hostname + u.pathname);
      if (!/youtube(?:-nocookie)?\.com\/embed\//.test(hostpath)) return false;

      const before = u.toString();
      if (!u.searchParams.has('enablejsapi')) u.searchParams.set('enablejsapi','1');
      if (!u.searchParams.has('origin') && /^https?:/.test(location.origin)) {
        u.searchParams.set('origin', location.origin);
      }
      const after = u.toString();
      if (after !== before) {
        // flip ל-about:blank כדי לאלץ רענון אמיתי של ה-iframe
        iframe.__ytRewrote = true;
        iframe.setAttribute('src', 'about:blank');
        // microtask → החזרה לערך החדש
        queueMicrotask(() => iframe.setAttribute('src', after));
        console.log("[Video] 🔁 rewrite src →", after);
      } else {
        console.log("[Video] ✅ params ok:", after);
      }
      return true;
    }catch(_){ return false; }
  }

  // ---- de-dupe window for rapid duplicate events ----
  const SEND_GAP_MS = 1200;
  let lastSig = "", lastAt = 0;
  function shouldSend(sig){
    const now = Date.now();
    if (sig === lastSig && (now - lastAt) < SEND_GAP_MS) return false;
    lastSig = sig; lastAt = now; return true;
  }

  function sendPlayEvent(player, iframe, source){
    let duration = 0, current = 0;
    try{
      duration = Number(player?.getDuration?.() || 0);
      current  = Number(player?.getCurrentTime?.() || 0);
    }catch(_){}
    const base = {
      video_title: iframe.getAttribute('title') || 'Video',
      video_url: iframe.getAttribute('src') || '',
      current_time: Math.round(current),
      duration: Math.round(duration),
      page_title: document.title || '',
      card_name: window.cardData?.fullName || 'Unknown',
      event_source: source
    };
    const sig = `play|${base.video_url}|${source}|${base.current_time}`;
    if (!shouldSend(sig)) return;
    sendGA('video_play', base);
    console && console.warn && console.warn('▶️ video_play sent', base);
  }

  function sendClickEvent(iframe){
    const base = {
      video_title: iframe.getAttribute('title') || 'Video',
      video_url: iframe.getAttribute('src') || '',
      page_title: document.title || '',
      card_name: window.cardData?.fullName || 'Unknown',
      event_source: 'fallback'
    };
    const sig = `click|${base.video_url}`;
    if (!shouldSend(sig)) return;
    sendGA('video_click', base);
    console && console.warn && console.warn('👉 video_click (fallback) sent', base);
  }

  /* ♿️ נטרול aria-hidden חוסם מעל הנגן (מונע אזהרת focus) */
  function uncloackA11y(iframe){
    try{
      const anc = iframe.closest('[aria-hidden="true"], [inert]');
      if (anc) {
        if (anc.hasAttribute('aria-hidden')) anc.removeAttribute('aria-hidden');
        if (anc.hasAttribute('inert')) anc.removeAttribute('inert');
        console.log("[Video] ♿ removed blocking aria-hidden/inert on ancestor");
      }
    }catch(_){}
  }

  // ---- bind one iframe (idempotent) ----
  function bindIframe(iframe){
    if (!iframe || iframe.__ytBindMounted) return;
    iframe.__ytBindMounted = true;

    if (!iframe.hasAttribute('tabindex')) iframe.setAttribute('tabindex','0'); // a11y
    uncloackA11y(iframe);

    // fallback click on container (pointerdown for iOS)
    const container = iframe.closest(containerSel) || iframe.parentElement;
    if (container && !container.__ytPointerBound){
      container.__ytPointerBound = true;
      container.addEventListener('pointerdown', (ev) => {
        if (!container.contains(ev.target)) return;
        sendClickEvent(iframe);
      }, { passive:true, capture:true });
      console.log("✅ fallback pointerdown bound");
    }

    const ok = forceParams(iframe);
    if (!ok) return; // נמתין ל-src תקין

    injectYT();
    onYTReady(() => {
      if (!window.YT || !YT.Player) return;
      if (iframe.__ytPlayerBound) return;
      iframe.__ytPlayerBound = true;

      const player = new YT.Player(iframe, {
        events: {
          onStateChange: (ev) => {
            if (ev?.data === YT.PlayerState.PLAYING) {
              sendPlayEvent(ev.target, iframe, 'yt_api');
            }
          }
        }
      });
      iframe.__ytPlayerInstance = player;
      console && console.log && console.log('✅ YT.Player bound');
    });
  }

  // ---- wait for GA + DOM + iframe src then bind ----
  async function bootstrap(){
    if (document.readyState === 'loading') {
      await new Promise(res => document.addEventListener('DOMContentLoaded', res, {once:true}));
    }

    // ודא gtag קיים לפני שליחת אירוע ראשון
    await waitFor(() => typeof window.gtag === 'function', {interval:150, timeout:8000});

    // bind ראשוני
    document.querySelectorAll(iframeSel).forEach(ifr => { if (ifr.getAttribute('src')) bindIframe(ifr); });

    // observe הזרקות/שינויים מאוחרים
    const root = document.querySelector('.video-section') || document.body;
    const mo = new MutationObserver((muts) => {
      document.querySelectorAll(iframeSel).forEach(ifr => {
        if (ifr.getAttribute('src') && !ifr.__ytPlayerBound) bindIframe(ifr);
      });
      muts.forEach(m => {
        if (m.type === 'attributes' && (m.attributeName === 'src' || m.attributeName === 'aria-hidden') && m.target.matches?.(iframeSel)) {
          bindIframe(m.target);
        }
      });
    });
    mo.observe(root, { subtree:true, childList:true, attributes:true, attributeFilter:['src','aria-hidden'] });

    // safety: periodic rebinder (עד ~12.5s)
    let ticks = 0;
    const rebinder = setInterval(() => {
      const ifr = document.querySelector(iframeSel);
      if (ifr && ifr.getAttribute('src') && !ifr.__ytPlayerBound) bindIframe(ifr);
      if (++ticks > 100) clearInterval(rebinder);
    }, 125);

    console && console.log && console.log('🟢 GA4 YouTube tracker ready.');
  }

  bootstrap();
})();

/* ✅ GA4 – Recommendations (Swiper) Tracking */
(function trackRecommendationsGA4(){
  if (window.__recGAInitDone__) return;
  window.__recGAInitDone__ = true;

  const onReady = (fn) =>
    (document.readyState === "loading")
      ? document.addEventListener("DOMContentLoaded", fn, { once: true })
      : fn();

  function sendGA(eventName, payload){
    if (typeof window.gtag !== "function") return;
    try {
      const debug = (typeof isLocal !== "undefined" && isLocal) ? { debug_mode: true } : {};
      window.gtag("event", eventName, { ...payload, ...debug });
      console.warn("📡 GA:", ["event", eventName, payload]);
    } catch(_){}
  }

  function getSlideLabel(slideEl, fallbackIndex){
    const aria = slideEl?.getAttribute?.("aria-label");
    if (aria) return aria;
    const did = slideEl?.getAttribute?.("data-rec-id");
    if (did) return `rec:${did}`;
    return `Slide ${fallbackIndex}`;
  }

  onReady(async () => {
    const section = document.querySelector('section.recommendations-section[data-analytics="recommendations"]');
    if (!section) return;

    const swiperContainer = section.querySelector('.swiper.recommendations-swiper[data-analytics="recommendationsCarousel"]');
    const paginationEl    = section.querySelector('.swiper-pagination.recommendations-pagination[data-analytics="recommendationsPagination"]');
    const wrapperEl       = section.querySelector('#recommendationSlides.swiper-wrapper');
    if (!swiperContainer || !paginationEl || !wrapperEl) return;

    // חכה ל־Swiper אם נטען מאוחר
    let tries = 0;
    while (typeof window.Swiper === "undefined" && tries++ < 80) { await new Promise(r=>setTimeout(r,125)); }
    if (typeof window.Swiper === "undefined") { console.warn("Swiper not found – skip GA tracking."); return; }

    // קח אינסטנס קיים (el.swiper) או אתחל חדש, ואז חשוף ל־window
    let recSwiper = window.recommendationsSwiper || swiperContainer.swiper || null;
    if (!recSwiper) {
      recSwiper = new Swiper(swiperContainer, {
        pagination: { el: paginationEl, clickable: true }
      });
    }
    window.recommendationsSwiper = recSwiper;

    // שינוי שקופית – Swipe/Drag/Keyboard/Autoplay
    recSwiper.on("slideChange", (sw) => {
      const realIndex  = sw.realIndex ?? sw.activeIndex ?? 0;
      const humanIndex = realIndex + 1;
      const total      = sw.slides?.length || wrapperEl.children.length || 0;
      const slideEl    = sw.slides?.[sw.activeIndex];
      const label      = getSlideLabel(slideEl, humanIndex);

      sendGA("recommendation_slide", {
        event_category: "Recommendations",
        interaction_type: "slideChange",
        slide_index: humanIndex,
        slide_total: total,
        slide_label: label
      });
    });

    // צפייה ראשונית
    const fireInitView = (sw) => {
      const realIndex  = sw.realIndex ?? sw.activeIndex ?? 0;
      const humanIndex = realIndex + 1;
      const slideEl    = sw.slides?.[sw.activeIndex];
      const label      = getSlideLabel(slideEl, humanIndex);
      sendGA("recommendation_slide", {
        event_category: "Recommendations",
        interaction_type: "initView",
        slide_index: humanIndex,
        slide_label: label
      });
    };
    if (recSwiper.initialized === true) { fireInitView(recSwiper); }
    else { recSwiper.on("afterInit", fireInitView); }

    // קליק על נקודת פגינציה – מתעד מקור פעולה
    paginationEl.addEventListener("click", () => {
      queueMicrotask(() => {
        const sw         = window.recommendationsSwiper || swiperContainer.swiper;
        if (!sw) return;
        const realIndex  = sw.realIndex ?? sw.activeIndex ?? 0;
        const humanIndex = realIndex + 1;
        const slideEl    = sw.slides?.[sw.activeIndex];
        const label      = getSlideLabel(slideEl, humanIndex);

        sendGA("recommendation_slide", {
          event_category: "Recommendations",
          interaction_type: "paginationClick",
          slide_index: humanIndex,
          slide_label: label
        });
      });
    }, { passive: true });
        console.log("🟢 Recommendations GA tracker ready.");

  });
})();

/* ✅ GA4 – Track ANY click inside contact form */
(function trackAllContactFormClicks(){
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('#contactForm form');
    if (!form) return;

    form.addEventListener("click", (ev) => {
      // נוודא שלא שולחים כפול (אפשר להרחיב לסוגי אלמנטים ספציפיים אם תרצה)
      const payload = {
        event_category: 'Form Actions',
        contact_channel: "formClick",   // 👈 תמיד אותו ערך
        value: 1,
        transport_type: 'beacon'
      };

      console.log("📡 GA:", ['event', 'contact_click', payload]);
      if (typeof window.gtag === "function") {
        try { window.gtag('event', 'contact_click', payload); } catch(_){}
      }
    });
  });
})();




// 🧲 מעקב אחרי קליקים – contact_* + מצטבר contact_click
const textOf = (el, max = 60) =>
  (el.innerText || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, max);

document.addEventListener("click", (e) => {
  const t = e.target.closest('[data-track="click"],a,button,[role="button"]');
  if (!t) return;
    // ✅ חריג: אל תעכב הורדה של איש קשר (vCard)
  if (t.matches('[data-field="addContact"], [data-action="addContact"], #vcardDownload')) {
  console.log("📇 הורדת איש קשר — דילוג על GA בלבד");
  // לא מחזירים return כדי לא לחסום הורדה
  return true; // ← רק סימון לוגי, לא עצירה של קליק
}



  const href = t.tagName === "A" ? (t.getAttribute("href") || "").toLowerCase() : "";
  const type = (t.dataset.type || t.getAttribute("data-field") || "").trim().toLowerCase();

  const common = {
    element_id: t.id || undefined,
    element_role: t.getAttribute("role") || t.tagName.toLowerCase(),
    element_href: href || undefined,
    element_field: t.getAttribute("data-field") || undefined,
    element_label: t.getAttribute("aria-label") || undefined,
    element_text: textOf(t),
    page_title: document.title || "",
    card_name: window.cardData?.fullName || "Unknown"
  };

  // 🔒 FORCE: כל קליק בתוך טופס יצירת קשר → contact_click עם sendFormE
  if (t.closest('#contactForm form')) {
    const payload = { sendFormE: "1", ...common };  // 👈 שדה מותאם
    console && console.log && console.log("📡 GA:", ['event', 'sendFormE_click', payload]);
    gtag("event", "sendFormE_click", payload);
    return;
  }

  // 🪗 אקורדיון
  if (t.classList.contains("elementor-tab-title")) {
    const titleText = (t.querySelector(".elementor-toggle-title")?.textContent || t.textContent || "")
      .trim().replace(/\s+/g, " ").slice(0, 80);

    gtag("event", "accordion_click", {
      ...common,
      accordion_title: titleText,
      accordion_id: t.id || undefined,
      accordion_key: t.getAttribute("data-tab") || undefined,
      aria_controls: t.getAttribute("aria-controls") || undefined
    });
    return;
  }

  // ערוצי יצירת קשר (מחוץ לטופס)
  let ev = null;
  if (href.startsWith("tel:") || type === "phone")                           ev = "contact_phone";
  else if (href.startsWith("mailto:") || type === "email")                   ev = "contact_email";
  else if (href.includes("wa.me") || type === "whatsapp")                    ev = "contact_whatsapp";
  else if (href.includes("facebook.com")  || type === "facebook")            ev = "contact_facebook";
  else if (href.includes("instagram.com") || type === "instagram")           ev = "contact_instagram";
  else if (href.includes("tiktok.com")    || type === "tiktok")              ev = "contact_tiktok";
  else if (href.includes("t.me") || href.includes("telegram.me") || type==="telegram")
                                                                              ev = "contact_telegram";
  else if (type === "directions" || href.startsWith("geo:") || href.includes("maps.google"))
                                                                              ev = "contact_directions";
  else if (type === "website" || href.startsWith("http"))                    ev = "contact_website";
  else if (type === "addcontact" || t.id === "vcardDownload")                ev = "add_contact";
  else if (t.classList.contains("scroll-to-contact-btn") || type === "scroll_to_contact_click")
                                                                              ev = "scroll_to_contact_click";

  if (ev) {
    gtag("event", ev, common);
    if (ev.startsWith("contact_")) {
      gtag("event", "contact_click", { contact_type: ev.replace("contact_",""), ...common });
    }
    return;
  }

  gtag("event", "click_generic", common);
});

// 📨 form_submit
document.addEventListener("submit", (e) => {
  const f = e.target.closest('form[data-track="form"]'); 
  if (!f) return;
  gtag("event", "form_submit", {
    form_id: f.id || undefined,
    form_name: f.getAttribute("name") || undefined,
    page_title: document.title || "",
    card_name: window.cardData?.fullName || "Unknown"
  });
});

}
/* 🔚 Google Analytics */














  isInitialized = true;

document.querySelectorAll("[data-switch]").forEach(el => {
  const key = el.dataset.switch;
  if (data.features?.[key] !== true) el.remove();
});

// --- מעודכן: replaceAll + תמיכה מלאה בתמונות/קישורים ---
const replaceAll = () => {
  document.querySelectorAll("[data-field]").forEach(el => {
    const field = el.dataset.field;
    let value = data?.[field];

    if (field === "mediaTitle" && (!value || value.trim() === "")) {
      value = "גלריית תמונות";
    }

    // 🆕 favicon fallback
    if (field === "favicon") {
      el.setAttribute("href", value || "/assets/logo/favicon.ico");
      return;
    }

if (value === undefined || value === null) {
  // אם זה <a> לוואטסאפ או SMS – נבנה בכל מקרה
  const tag = el.tagName;
  if (tag === "A") {
    switch (field) {
      case "whatsapp": {
        const wa = String(data.phoneDigits || "").replace(/\D/g, "").replace(/^0+/, "");
        if (wa) {
          el.href = `https://wa.me/972${wa}`;
          el.setAttribute("target", "_blank");
          el.setAttribute("rel", "noopener");
        }
        break;
      }
      case "sms": {
        const sms = String(data.phoneDigits || "").replace(/\D/g, "").replace(/^0+/, "");
        if (sms) {
          el.href = `sms:+972${sms}`;
        }
        break;
      }
    }
  }
  return;
}

(() => {
  const data = window.cardData || {};
  const features = data.features || {};
  const mediaContainer = document.querySelector('[data-field="videoSrc"]');
  if (!mediaContainer) return;

  // ✅ FIX: מניעת ריצה כפולה שיוצרת כמה iframes
  if (mediaContainer.dataset.videoInit === '1') return;
  mediaContainer.dataset.videoInit = '1';

  const yt = (typeof data.youtubeLink === 'string') ? data.youtubeLink.trim() : '';
  const shouldShow = (features.video === true && yt !== '');

  if (!shouldShow) {
    mediaContainer.style.display = 'none';
    mediaContainer.innerHTML = '';
    console.log("[Video] ❌ Hidden (feature off or no link).", { feature: features.video, yt });
    return;
  }

  // תמיכה בקישורי watch / youtu.be / embed (ללא שינוי מהותי)
  const toEmbed = (url) => {
    if (/\/embed\//.test(url)) return url;
    const id = (url.match(/[?&]v=([A-Za-z0-9_-]{6,})/) ||
                url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/))?.[1] || '';
    return id ? `https://www.youtube.com/embed/${id}` : '';
  };

  const embedBase = toEmbed(yt);
  if (!embedBase) { 
    mediaContainer.style.display = 'none';
    console.log("[Video] ❌ Invalid YouTube link:", yt);
    return; 
  }

  // ✅ נרמול פרמטרים עם URLSearchParams — מונע כפילויות
  let finalSrc = embedBase;
  try {
    const u = new URL(embedBase, location.href);
    const p = u.searchParams;

    // שומר פרמטרים קיימים ומוודא ערכים רצויים, ללא כפילות
    if (!p.has('rel'))            p.set('rel', '0');            else p.set('rel', '0');
    if (!p.has('modestbranding')) p.set('modestbranding', '1'); else p.set('modestbranding', '1');
    if (!p.has('playsinline'))    p.set('playsinline', '1');    else p.set('playsinline', '1');

    u.search = p.toString(); // מבטיח מפתח יחיד לכל פרמטר
    finalSrc = u.toString();
  } catch (e) {
    // נפילה נדירה בבניית URL — נ fallback ללא כפילות ידנית
    const hasQ = embedBase.includes('?');
    const alreadyHasRel            = /[?&]rel=/.test(embedBase);
    const alreadyHasModestBranding = /[?&]modestbranding=/.test(embedBase);
    const alreadyHasPlaysinline    = /[?&]playsinline=/.test(embedBase);

    const extra = [];
    if (!alreadyHasRel)            extra.push('rel=0');
    if (!alreadyHasModestBranding) extra.push('modestbranding=1');
    if (!alreadyHasPlaysinline)    extra.push('playsinline=1');

    finalSrc = embedBase + (extra.length ? (hasQ ? '&' : '?') + extra.join('&') : '');
  }

  console.log("[Video] ℹ️ Input:", yt);
  console.log("[Video] ℹ️ Embed base:", embedBase);
  console.log("[Video] ✅ Final src:", finalSrc);

  // ✅ FIX: מנקה כל IFRAME קיים בתוך הקונטיינר לפני יצירת חדש
  mediaContainer.querySelectorAll('iframe').forEach(el => el.remove());

  const iframe = document.createElement('iframe');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '315');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('title', data.videoTitle || 'YouTube video');
  iframe.style.width = '100%';
  iframe.style.aspectRatio = '16/9';
  iframe.src = finalSrc;

  mediaContainer.innerHTML = '';
  mediaContainer.appendChild(iframe);
  mediaContainer.style.display = '';

  // נגישות
  mediaContainer.setAttribute('role', 'region');
  mediaContainer.setAttribute('aria-label', data.videoAriaLabel || 'סרטון תדמית מיוטיוב');
  mediaContainer.setAttribute('tabindex', '0');
})();


const tag = el.tagName;

// ✅ הוספה חדשה: META / LINK
if (tag === "META") {
  if (value) el.setAttribute("content", value);
  return;
}
if (tag === "LINK") {
  if (value) el.setAttribute("href", value);
  return;
}

if (tag === "IMG") {
  el.src = value;
} else if (tag === "A") {
  switch (field) {
    case "phone":
      el.href = `tel:${value}`;
      break;
    case "email":
      el.href = `mailto:${value}`;
      break;
    case "whatsapp": {
      const wa = String(data.phoneDigits || "").replace(/\D/g, "").replace(/^0+/, "");
      el.href = `https://wa.me/972${wa}`;
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      break;
    }
    case "sms": {
      const sms = String(data.phoneDigits || "").replace(/\D/g, "").replace(/^0+/, "");
      el.href = `sms:+972${sms}`;
      break;
    }
    case "addContact":
      el.href = data.vcardLink || "#";
      break;
    case "facebookLink":
      el.href = value;
      break;
    default:
      el.href = value;
  }
} else {
      el.innerHTML = value;
    }
  });
}; //
  document.title = data.pageTitle || "כרטיס ביקור דיגיטלי";
  document.body.dataset.whatsapp = data.phone;
  document.body.dataset.email = data.email;

  // === FullName bind (now + on cardReady + retry) ===
  (function bindFullName(){
    function setName(name){
      if (!name) return;
      document.querySelectorAll('[data-field="fullName"]').forEach(el => {
        el.textContent = name;
      });
    }

    const nowName = (window.cardData?.fullName || "").trim();
    setName(nowName);

    document.addEventListener("cardReady", () => {
      const v = (window.cardData?.fullName || "").trim();
      setName(v);
    });

    let tries = 0, id = setInterval(() => {
      const v = (window.cardData?.fullName || "").trim();
      if (v) { setName(v); clearInterval(id); }
      if (++tries >= 20) clearInterval(id);
    }, 150);
  })();

replaceAll();
if (window.VCardAPI) window.VCardAPI.refresh(); // ✅ רענון קובץ איש קשר לאחר הזרקת נתונים
const swiperEl = document.querySelector('.recommendations-swiper');

  const recWrapper = document.getElementById('recommendationSlides');
  const recData = (data.recommendations || []).filter(rec => rec?.name && rec?.text);

if (!swiperEl || recData.length === 0) {
  swiperEl?.remove();
} else {
  recWrapper.innerHTML = recData.map(rec => `
    <div class="swiper-slide">
      <div class="elementor-testimonial">
        <div class="testimonial-top">
          <span class="elementor-testimonial__name">${rec.name}</span>
          <span class="elementor-testimonial__title">${rec.title || ''}</span>
        </div>
        <div class="testimonial-middle">
          <div class="elementor-testimonial__content">
            <span class="elementor-testimonial__text">${rec.text}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  recommendationsSwiper = new Swiper('.recommendations-swiper', {
  slidesPerView: 1,
  spaceBetween: 16,
  loop: true,
  threshold: 5,     // ✅ קל יותר להתחיל גרירה
  touchRatio: 1.5,  // ✅ רגישות גבוהה יותר לגרירה
  allowSlidePrev: true,
  allowSlideNext: true,

  pagination: {
  el: '.recommendations-pagination',
  clickable: true,
},
    autoHeight: false,
    direction: 'horizontal',
    speed: 700
  });
}
// הסתרת פאגינציה אם יש פחות מ-2 המלצות
if (document.querySelectorAll('#recommendationSlides .swiper-slide').length <= 1) {
  document.querySelector('.recommendations-pagination').style.display = 'none';
}

if (recommendationsSwiper) {
  document.querySelectorAll(".elementor-testimonial").forEach(testimonial => {
    const textEl = testimonial.querySelector(".elementor-testimonial__text");
    if (!textEl) return;
    const fullText = textEl.innerText.trim();
    if (fullText.length > 300) {
      const readMore = document.createElement("span");
      readMore.className = "read-more";
      readMore.textContent = "עוד";
      readMore.addEventListener("click", () => {
        testimonial.classList.toggle("expanded");
        readMore.textContent = testimonial.classList.contains("expanded") ? "סגור" : "עוד";
        recommendationsSwiper.updateAutoHeight(300);
      });
      testimonial.appendChild(readMore);
    }
  });
}
if (recommendationsSwiper) {
  // תמיכה במעבר בין המלצות עם מקלדת
  const prevBtn = document.querySelector('.swiper-button-prev');
  const nextBtn = document.querySelector('.swiper-button-next');

  if (prevBtn) {
    prevBtn.setAttribute('tabindex', '0');
    prevBtn.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
        recommendationsSwiper.slidePrev();
      }
    });
  }

  if (nextBtn) {
    nextBtn.setAttribute('tabindex', '0');
    nextBtn.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
        recommendationsSwiper.slideNext();
      }
    });
  }
  
  /* =========================
   Form Fields from DATA (Bind by keys from DATA)
   ========================= */
(function initFormFromData(){
  const root     = window.cardData || {};
  const features = root.features || {};
  const F        = root.fields   || {};

  // ---- דגלי ערוצים (רק לשליטה בכפתורים) ----
  const FLAG_WA   = features.sendWhatsapp === true || features.sendWhatsApp === true;
  const FLAG_MAIL = features.sendEmail    === true;

  // ---- קונפיג שדות מה-DATA (עם ברירות מחדל) ----
  const cfgPrimary = Object.assign({
    key: "fullName", label: "שם מלא", placeholder: "שם מלא",
    type: "text", inputMode: "text", required: true, maxLength: 80
  }, F.primary || {});

  const cfgSecondary = Object.assign({
    key: "customField", label: "שדה משני", placeholder: "ערך מותאם",
    type: "text", inputMode: "text", required: false, maxLength: 80
  }, F.secondary || {});

  const cfgMessage = Object.assign({
    key: "message", label: "הודעה חופשית", placeholder: "כתוב/י כאן הודעה",
    inputMode: "text", required: false, maxLength: 500
  }, F.message || {});

  const submitText = (F.submitText || "שליחה");

  // ---- איתור אלמנט לפי key (id / name / data-key) עם נפילה אחורה ל-IDs גנריים ----
  function findFieldElement(cfg, fallbackId){
    if (!cfg || !cfg.key) return document.getElementById(fallbackId);
    const key = String(cfg.key).trim();
    return (
      document.getElementById(key) ||
      document.querySelector(`[name="${CSS.escape(key)}"]`) ||
      document.querySelector(`[data-key="${CSS.escape(key)}"]`) ||
      document.getElementById(fallbackId) || null
    );
  }
  function findLabelFor(el, explicitFor){
    if (!el) return null;
    const id = el.id || explicitFor;
    return (
      (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) ||
      el.closest('.form-field')?.querySelector('label') || null
    );
  }

  // ---- אלמנטים (דינמי לפי keys) ----
  const elPrimary   = findFieldElement(cfgPrimary,   "fullName");
  const elSecondary = findFieldElement(cfgSecondary, "secondaryField");
  const elMessage   = findFieldElement(cfgMessage,   "message");
  const btnSubmit   = document.getElementById("sendBtn");

  const lblPrimary   = findLabelFor(elPrimary,   "fullName");
  const lblSecondary = findLabelFor(elSecondary, "secondaryField");
  const lblMessage   = findLabelFor(elMessage,   "message");

  // ---- החלת מטא גנרית ----
  function applyMetaToInput(el, cfg, labelEl){
    if (!el || !cfg) return;
    // אם אין id לאלמנט – נגדיר את ה-id לפי ה-key כדי ש-for יעבוד
    if (!el.id) el.id = String(cfg.key || "").trim() || el.id || "";

    // ניקוי שאריות/Autofill
    el.removeAttribute('value'); el.value = '';
    ["min","max","pattern","maxlength","inputmode","aria-required","aria-label","autocomplete"].forEach(a=>el.removeAttribute(a));

    if (cfg.type && el.tagName !== "TEXTAREA") el.type = cfg.type;
    if (cfg.placeholder) el.placeholder = cfg.placeholder;
    if (cfg.inputMode)   el.setAttribute("inputmode", cfg.inputMode);
    if (cfg.maxLength)   el.setAttribute("maxlength", String(cfg.maxLength));
    el.required = !!cfg.required;
    el.setAttribute("aria-label", cfg.label || "");
    el.setAttribute("aria-required", String(!!cfg.required));
    if (typeof cfg.min !== "undefined") el.setAttribute("min", String(cfg.min));
    if (typeof cfg.max !== "undefined") el.setAttribute("max", String(cfg.max));
    if (cfg.pattern) el.setAttribute("pattern", cfg.pattern);
    el.setAttribute("autocomplete","off");

    // עדכון label תואם
    if (labelEl) {
      labelEl.setAttribute('for', el.id);
      if (cfg.label) labelEl.textContent = cfg.label;
    }
  }

  function init(){
    applyMetaToInput(elPrimary,   cfgPrimary,   lblPrimary);
    applyMetaToInput(elSecondary, cfgSecondary, lblSecondary);
    applyMetaToInput(elMessage,   cfgMessage,   lblMessage);
    if (btnSubmit) btnSubmit.textContent = submitText;

    // כפתורים לפי פיצ'רים
    const emailBtn = document.querySelector('[data-action="sendEmail"]');
    const waBtn    = document.querySelector('[data-action="sendWhatsApp"], [data-action="sendWhatsapp"]');
    if (emailBtn) emailBtn.style.display = FLAG_MAIL ? "" : "none";
    if (waBtn)    waBtn.style.display    = FLAG_WA   ? "" : "none";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // ---- ערכים לשילוח ----
  const val = {
    primary:   () => (elPrimary?.value   || "").trim(),
    secondary: () => (elSecondary?.value || "").trim(),
    message:   () => (elMessage?.value   || "").trim()
  };

  // ---- שליחה לוואטסאפ ----
  window.sendToWhatsapp = function(e){
    e?.preventDefault?.();
    if (!FLAG_WA) return;

    const esc = encodeURIComponent;
    const num = String(root.phoneDigits || "").replace(/\D/g,"").replace(/^0+/, "");
    const msg =
      `${cfgPrimary.label}: ${esc(val.primary())}%0A` +
      `${cfgSecondary.label}: ${esc(val.secondary())}%0A` +
      `${cfgMessage.label}: ${esc(val.message())}`;

    if (num) window.open(`https://wa.me/972${num}?text=${msg}`, "_blank");
  };

  // ---- שליחה לאימייל ----
  window.sendToEmail = function(e){
    e?.preventDefault?.();
    if (!FLAG_MAIL) return;

    const subject = encodeURIComponent(`פניה מכרטיס ביקור – ${val.primary()}`);
    const body = encodeURIComponent(
      `${cfgPrimary.label}: ${val.primary()}\n` +
      `${cfgSecondary.label}: ${val.secondary()}\n` +
      `${cfgMessage.label}: ${val.message()}`
    );
    const to = (root.email || "").trim();
    if (to) window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };
})();

/* ============ הסתרת כפתורים לפי פיצ'רים ============ */
(function toggleActionButtons() {
  const data = window.cardData || window.data || {};
  const features = data.features || {};
  const emailBtn = document.querySelector('[data-action="sendEmail"]');
  const waBtn    = document.querySelector('[data-action="sendWhatsApp"], [data-action="sendWhatsapp"]');
  if (emailBtn && !features.sendEmail) emailBtn.style.display = 'none';
  if (waBtn && !(features.sendWhatsapp || features.sendWhatsApp)) waBtn.style.display = 'none';
})();


document.querySelectorAll('.elementor-tab-title').forEach((toggle) => {
  // שמירה על ההתנהגות הקיימת עם עכבר
  toggle.addEventListener('click', function () {
    handleAccordionToggle(this);
  });

  // הוספת תמיכה ב־Enter ו־Space
  toggle.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ' || event.code === 'Space') {
      event.preventDefault(); // מונע גלילה
      handleAccordionToggle(this);
    }
  });
});

function handleAccordionToggle(element) {
  const isActive = element.classList.contains('elementor-active');
  const tabContentId = element.getAttribute('aria-controls');
  const tabContent = document.getElementById(tabContentId);

  document.querySelectorAll('.elementor-tab-title').forEach(el => {
    el.classList.remove('elementor-active');
    el.setAttribute('aria-expanded', 'false');
    el.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.elementor-tab-content').forEach(el => el.setAttribute('hidden', true));

  if (!isActive) {
    element.classList.add('elementor-active');
    element.setAttribute('aria-expanded', 'true');
    element.setAttribute('aria-selected', 'true');
    tabContent.removeAttribute('hidden');
  }
}


/* =========================
   Share Buttons – script-generic.js
   ========================= */
(function initShareButtons(){
  const PROD_ORIGIN = "https://clix-marketing.co.il";

  function buildPublicUrlFromLocal(href){
    try {
      if (location.protocol === "file:") {
        return PROD_ORIGIN + href.replace(/^file:\/\//, "").replace(/^[^/]+/, "");
      }
      const u = new URL(href);
      if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
        return PROD_ORIGIN + u.pathname + u.search + u.hash;
      }
      return href;
    } catch {
      return href;
    }
  }

  function getShareableUrl(){
    const explicit = window.cardData?.publicShareUrl && String(window.cardData.publicShareUrl).trim();
    const current  = location.href;
    return explicit || buildPublicUrlFromLocal(current);
  }



  document.querySelectorAll('.share-buttons a').forEach(button => {
    const type = button.dataset.type;
    if (!type) return;
    const shareOptions = window.cardData?.shareOptions || {};
    if (shareOptions[type] === false) {
      button.style.display = 'none';
      return;
    }

    button.addEventListener('click', function (e) {
      e.preventDefault();

      const rawUrl    = getShareableUrl().replace(/\s+/g, '').replace(/#$/, '');
      const rawTitle  = document.title || '';
      const safeUrl   = encodeURIComponent(rawUrl);
      const safeTitle = encodeURIComponent(rawTitle);

      const fullName  = (window.cardData?.fullName || "").trim();
      const shareText = `כרטיס ביקור – ${fullName}\n${rawUrl}`;
      const safeShareText = encodeURIComponent(shareText);

      let shareUrl = "#";
      switch (type) {
        case "whatsapp":
          shareUrl = `https://wa.me/?text=${safeShareText}`;
          break;
        case "telegram":
          shareUrl = `https://t.me/share/url?url=${safeUrl}&text=${encodeURIComponent("כרטיס ביקור – " + fullName)}`;
          break;
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${safeUrl}&quote=${safeShareText}`;
          break;
        case "linkedin":
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${safeUrl}&summary=${safeShareText}`;
          break;
        case "twitter":
        case "x":
          shareUrl = `https://twitter.com/intent/tweet?url=${safeUrl}&text=${safeShareText}`;
          break;
        case "email":
          shareUrl = `mailto:?subject=${encodeURIComponent("כרטיס ביקור – " + fullName)}&body=${safeShareText}`;
          break;
        
          case "instagram":
          case "ig":
            if (navigator.share) {
              // יפתח חלון שיתוף מערכת (אם מותקן אינסטגרם – יופיע שם)
              navigator.share({
                title: `כרטיס ביקור – ${fullName}`,
                text: `כרטיס ביקור – ${fullName}`,
                url: rawUrl
              }).catch(()=>{});
            } else {
              // פולבאק – העתקה + פתיחת אינסטגרם
              copyToClipboard(rawUrl).then(() => toast('הקישור הועתק – הדבק אותו באינסטגרם.'));
              window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
            }
            return;

        default:
          const existing = button.getAttribute('href') || '#';
          shareUrl = existing !== '#' ? existing : rawUrl;
          break;
      }

      if (shareUrl && shareUrl !== '#') {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
      }
    });
  });
})();
}
});


function createVideoElement(container) {
  const videoElement = document.createElement("video");
  videoElement.setAttribute("controls", "");
  videoElement.setAttribute("playsinline", "");
  videoElement.setAttribute("preload", "metadata");
  videoElement.classList.add("video-element");

  const sourceElement = document.createElement("source");
  sourceElement.src = window.cardData.videoSrc;
  sourceElement.type = "video/mp4";

  videoElement.appendChild(sourceElement);
  container.innerHTML = "";
  container.appendChild(videoElement);
}
(() => {
  const accessibilityBtn = document.getElementById("accessibilityToggle");
  if (!accessibilityBtn) return;

  // הפעל/כבה מצב נגישות
  const applyAccessibility = (on) => {
    if (on) {
      document.body.classList.add("accessibility-mode");
      document.body.style.filter = "contrast(1.2)";
      document.body.style.fontSize = "110%";
    } else {
      document.body.classList.remove("accessibility-mode");
      document.body.style.filter = "";
      document.body.style.fontSize = "";
    }
    accessibilityBtn.setAttribute("aria-pressed", on ? "true" : "false");
    localStorage.setItem("accessibilityMode", on ? "1" : "0");

    // כיבוי פרלקסה מיידי
    const bg = document.querySelector(".card .parallax-bg");
    if (bg) bg.style.backgroundPosition = "center top";
    window.dispatchEvent(
      new CustomEvent("parallax:toggle", { detail: { enabled: !on } })
    );
  };

  // שחזור מצב אחרון
  const saved = localStorage.getItem("accessibilityMode") === "1";
  applyAccessibility(saved);

  // קליק כפתור
  accessibilityBtn.addEventListener("click", () => {
    const next = !document.body.classList.contains("accessibility-mode");
    applyAccessibility(next);
  });

  // תמיכה במקלדת
  accessibilityBtn.setAttribute("tabindex", "0");
  accessibilityBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " " || e.code === "Space") {
      e.preventDefault();
      const next = !document.body.classList.contains("accessibility-mode");
      applyAccessibility(next);
    }
  });
})();





