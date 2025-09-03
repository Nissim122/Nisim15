let recommendationsSwiper = null;
let isInitialized = false; // ← דגל למניעת טעינה כפולה

// ✅ זיהוי סביבת הפקה או רנדר
const isLive = location.hostname.includes("clix-marketing.co.il") || location.hostname.includes("render.com");
console.log("📡 isLive:", isLive);
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
}/* =========================
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
    const cardUrl  = esc(data.cardUrl || location.href);

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
    if (!vcardURL) return false;
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
  replaceAll();
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
  }/* =========================
   Form Fields from DATA + Channel (WhatsApp/Email)
   ========================= */
(function initFormFromData(){
  const root     = window.cardData || {};
  const features = root.features || {};
  const F        = root.fields   || {};

  // ---- דגלי ערוצים + ערוץ התחלתי ----
  const FLAG_WA   = features.sendWhatsapp === true || features.sendWhatsApp === true;
  const FLAG_MAIL = features.sendEmail    === true;
  let channel =
    (typeof features.formChannel === "string" && features.formChannel.toLowerCase()) ||
    (FLAG_WA ? "whatsapp" : "email");

  // ---- קונפיג שדות מה-DATA (עם ברירות מחדל) ----
  const cfgPrimary = Object.assign({
    key: "fullName",
    label: "שם מלא",
    placeholder: "שם מלא",
    type: "text",
    inputMode: "text",
    required: true,
    maxLength: 80
  }, F.primary || {});

  const cfgSecondary = Object.assign({
    key: "customField",
    label: "שדה משני",
    placeholder: "ערך מותאם",
    type: "text",
    inputMode: "text",
    required: false,
    maxLength: 80
  }, F.secondary || {});

  const cfgMessage = Object.assign({
    key: "message",
    label: "הודעה חופשית",
    placeholder: "כתוב/י כאן הודעה",
    inputMode: "text",
    required: false,
    maxLength: 500
  }, F.message || {});

  const submitText = (F.submitText || "שליחה");

  // ---- אלמנטים ----
  const elPrimary     = document.getElementById("fullName");
  const elSecondary   = document.getElementById("secondaryField");
  const elMessage     = document.getElementById("message");
  const elPhone       = document.getElementById("phoneNumber");     // לטובת אימייל
  const wrapSecondary = document.getElementById("wrapperSecondary") || elSecondary?.closest(".form-field") || null;
  const wrapPhone     = document.getElementById("wrapperPhone")     || elPhone?.closest(".form-field")     || null;
  const btnSubmit     = document.getElementById("sendBtn");

  const lblPrimary   = document.querySelector('label[for="fullName"]');
  const lblSecondary = document.querySelector('label[for="secondaryField"].label-secondary') || document.querySelector('label[for="secondaryField"]');
  const lblMessage   = document.querySelector('label[for="message"]');
  const lblPhone     = document.querySelector('label[for="phoneNumber"]');

  // ---- החלת מטא גנרית על input ----
  function applyMetaToInput(el, cfg, labelEl){
    if (!el || !cfg) return;
    ["min","max","pattern","maxlength","inputmode","aria-required","aria-label"].forEach(a=>el.removeAttribute(a));
    if (cfg.type)        el.type = cfg.type;
    if (cfg.placeholder) el.placeholder = cfg.placeholder;
    if (cfg.inputMode)   el.setAttribute("inputmode", cfg.inputMode);
    if (cfg.maxLength)   el.setAttribute("maxlength", String(cfg.maxLength));
    el.required = !!cfg.required;
    el.setAttribute("aria-label", cfg.label || "");
    el.setAttribute("aria-required", String(!!cfg.required));
    if (typeof cfg.min !== "undefined") el.setAttribute("min", String(cfg.min));
    if (typeof cfg.max !== "undefined") el.setAttribute("max", String(cfg.max));
    if (cfg.pattern) el.setAttribute("pattern", cfg.pattern);
    if (labelEl && cfg.label) labelEl.textContent = cfg.label;
  }

  // ---- החלת מטא ספציפי לשדות ----
  function applyPrimaryMeta(){ applyMetaToInput(elPrimary, cfgPrimary, lblPrimary); }
  function applySecondaryMeta(){ applyMetaToInput(elSecondary, cfgSecondary, lblSecondary); }
  function applyMessageMeta(){
    if (!elMessage) return;
    ["maxlength","inputmode","aria-required","aria-label"].forEach(a=>elMessage.removeAttribute(a));
    if (cfgMessage.placeholder) elMessage.placeholder = cfgMessage.placeholder;
    if (cfgMessage.inputMode)   elMessage.setAttribute("inputmode", cfgMessage.inputMode);
    if (cfgMessage.maxLength)   elMessage.setAttribute("maxlength", String(cfgMessage.maxLength));
    elMessage.required = !!cfgMessage.required;
    elMessage.setAttribute("aria-label", cfgMessage.label || "");
    elMessage.setAttribute("aria-required", String(!!cfgMessage.required));
    if (lblMessage && cfgMessage.label) lblMessage.textContent = cfgMessage.label;
  }
  function applyPhoneMeta(){
    if (!elPhone) return;
    elPhone.type = "tel";
    elPhone.placeholder = (root.labels?.phone || "טלפון");
    elPhone.setAttribute("aria-label", (root.labels?.phone || "טלפון"));
    elPhone.setAttribute("inputmode", "tel");
    elPhone.removeAttribute("pattern");
    elPhone.removeAttribute("maxlength");
    if (lblPhone) lblPhone.textContent = (root.labels?.phone || "טלפון");
  }

  // ---- בחירת ערוץ: וואטסאפ מציג שדה משני; אימייל מציג טלפון ----
  function applyChannelUI(next){
    const useWA = next === "whatsapp";
    if (wrapSecondary) wrapSecondary.style.display = useWA ? "" : "none";
    if (wrapPhone)     wrapPhone.style.display     = useWA ? "none" : "";
    if (useWA) { applySecondaryMeta(); } else { applyPhoneMeta(); }
  }

  // ---- ערכי טופס בטוחים ----
  const val = {
    primary:  () => (elPrimary?.value   || "").trim(),
    secondary:() => (wrapSecondary && wrapSecondary.style.display === "none") ? "" : (elSecondary?.value || "").trim(),
    message:  () => (elMessage?.value   || "").trim(),
    phone:    () => (wrapPhone && wrapPhone.style.display === "none") ? "" : (elPhone?.value || "").trim()
  };

  // ---- שליחה לוואטסאפ ----
  window.sendToWhatsapp = function(e){
    e?.preventDefault?.();
    setFormChannel("whatsapp");
    if (!FLAG_WA) return;
    if (features.formChannel && String(features.formChannel).toLowerCase() !== "whatsapp") return;

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
    setFormChannel("email");
    if (!FLAG_MAIL) return;
    if (features.formChannel && String(features.formChannel).toLowerCase() !== "email") return;

    const subject = encodeURIComponent(`פניה מכרטיס ביקור – ${val.primary()}`);
    const body = encodeURIComponent(
      `${cfgPrimary.label}: ${val.primary()}\n` +
      `${(root.labels?.phone || "טלפון")}: ${val.phone()}\n` +  // טלפון כלול בגוף האימייל
      `${cfgSecondary.label}: ${val.secondary()}\n` +
      `${cfgMessage.label}: ${val.message()}`
    );
    const to = (root.email || "").trim();
    if (to) window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  // ---- סוויצ'ר ידני ----
  window.setFormChannel = function(next){
    const nc = String(next||"").toLowerCase();
    if (!["whatsapp","email"].includes(nc)) return;
    features.formChannel = nc;
    channel = nc;
    applyChannelUI(nc);
  };

  // ---- אתחול ----
  function init(){
    applyPrimaryMeta();
    applySecondaryMeta();
    applyMessageMeta();
    applyPhoneMeta();
    if (btnSubmit) btnSubmit.textContent = submitText;

    // הצגת/הסתרת כפתורים לפי פיצ'רים
    const emailBtn = document.querySelector('[data-action="sendEmail"]');
    const waBtn    = document.querySelector('[data-action="sendWhatsApp"], [data-action="sendWhatsapp"]');
    if (emailBtn) emailBtn.style.display = FLAG_MAIL ? "" : "none";
    if (waBtn)    waBtn.style.display    = FLAG_WA   ? "" : "none";

    applyChannelUI(channel);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
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
  const PROD_ORIGIN = "https://www.clix-marketing.co.il";

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


// ✅ פקד נגישות – הפעלה/כיבוי מצב נגישות (עם שמירת מצב ו-ARIA)
(() => {
  const accessibilityBtn = document.getElementById("accessibilityToggle");
  if (!accessibilityBtn) return;

  // החלת המצב בפועל + עדכון ARIA + שמירה
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
  };

  // שחזור מצב אחרון
  const saved = localStorage.getItem("accessibilityMode") === "1";
  applyAccessibility(saved);

  // קליק עכבר
  accessibilityBtn.addEventListener("click", () => {
    const next = !document.body.classList.contains("accessibility-mode");
    applyAccessibility(next);
  });

  // תמיכה במקלדת (Enter / Space)
  accessibilityBtn.setAttribute("tabindex", "0");
  accessibilityBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " " || e.code === "Space") {
      e.preventDefault();
      const next = !document.body.classList.contains("accessibility-mode");
      applyAccessibility(next);
    }
  });
})();




