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
  /* ============ VIDEO: YouTube only ============ */
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
    return;
  }

  // תמיכה בקישורי watch / youtu.be / embed
  const toEmbed = (url) => {
    if (/\/embed\//.test(url)) return url;
    const id = (url.match(/[?&]v=([A-Za-z0-9_-]{6,})/) ||
                url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/))?.[1] || '';
    return id ? `https://www.youtube.com/embed/${id}` : '';
  };

  const embed = toEmbed(yt);
  if (!embed) { mediaContainer.style.display = 'none'; return; }

  const iframe = document.createElement('iframe');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '315');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('title', data.videoTitle || 'YouTube video');
  iframe.src = `${embed}?rel=0&modestbranding=1&playsinline=1`;

  mediaContainer.innerHTML = '';
  mediaContainer.appendChild(iframe);
  mediaContainer.style.display = '';

  // נגישות
  mediaContainer.setAttribute('role', 'region');
  mediaContainer.setAttribute('aria-label', data.videoAriaLabel || 'סרטון תדמית מיוטיוב');
  mediaContainer.setAttribute('tabindex', '0');
})();


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
  }
/* =========================
   Channel ⇄ Form Field Sync (Dynamic Secondary Field)
   ========================= */
// script-generic.js

(function initChannelFormSync() {
  const data = window.cardData || window.data || {};
  const features = data.features || {};

  // תאימות sendWhatsapp / sendWhatsApp
  const FLAG_SEND_WHATSAPP = (features.sendWhatsapp === true || features.sendWhatsApp === true);
  const FLAG_SEND_EMAIL    = (features.sendEmail === true);

  // ✅ תצורת שדה משני דינמי מתוך DATA (ברירת מחדל = גיל)
  const secondary = Object.assign({
    key: 'age',
    label: 'גיל',
    type: 'number',
    placeholder: 'גיל',
    inputMode: 'numeric',
    min: 1,
    max: 120,
    pattern: '\\d{1,3}',
    maxLength: 3,
    required: true
  }, features.secondaryField || {});

  // ערוץ ברירת מחדל
  const channel =
    (typeof features.formChannel === "string" && features.formChannel.toLowerCase()) ||
    (FLAG_SEND_WHATSAPP ? "whatsapp" : "email");

  // אלמנטים
  const nameEl   = document.getElementById('fullName');
  const phoneEl  = document.getElementById('phoneNumber');
  const secEl    = document.getElementById('secondaryField');
  const msgEl    = document.getElementById('message');

  const wrapPhone = document.getElementById('wrapperPhone') || phoneEl?.closest('.form-field') || null;
  const wrapSec   = document.getElementById('wrapperSecondary') || secEl?.closest('.form-field') || null;

  const labelPhone = document.querySelector('label[for="phoneNumber"]');
  const labelSec   = document.querySelector('label[for="secondaryField"].label-secondary') || document.querySelector('.label-secondary');

  // ▶️ החלת מטא על טלפון
  function applyPhoneMeta() {
    if (!phoneEl) return;
    phoneEl.type = 'tel';
    phoneEl.placeholder = 'טלפון';
    phoneEl.setAttribute('aria-label', 'טלפון');
    phoneEl.setAttribute('inputmode', 'tel');
    phoneEl.removeAttribute('pattern');
    phoneEl.removeAttribute('maxlength');
    if (labelPhone) labelPhone.textContent = (data.labels?.phone || 'טלפון');
  }

  // ▶️ החלת מטא על השדה המשני לפי DATA
  function applySecondaryMeta() {
    if (!secEl) return;

    secEl.type = secondary.type || 'text';
    secEl.placeholder = secondary.placeholder || secondary.label || '';
    secEl.setAttribute('aria-label', secondary.label || '');
    secEl.setAttribute('aria-required', String(!!secondary.required));
    secEl.required = !!secondary.required;

    // ניקוי קודם
    secEl.removeAttribute('min'); secEl.removeAttribute('max');
    secEl.removeAttribute('pattern'); secEl.removeAttribute('maxlength');
    secEl.removeAttribute('inputmode');

    if (secondary.inputMode) secEl.setAttribute('inputmode', secondary.inputMode);
    if (typeof secondary.min !== 'undefined') secEl.setAttribute('min', String(secondary.min));
    if (typeof secondary.max !== 'undefined') secEl.setAttribute('max', String(secondary.max));
    if (secondary.pattern) secEl.setAttribute('pattern', secondary.pattern);
    if (secondary.maxLength) secEl.setAttribute('maxlength', String(secondary.maxLength));

    if (labelSec) labelSec.textContent = secondary.label || '';
  }

  // ▶️ הצגה/הסתרה והחלת מטא לפי ערוץ
  function applyFormChannelUI(nextChannel) {
    const useWhatsapp = nextChannel === 'whatsapp';

    if (wrapSec)   wrapSec.style.display   = useWhatsapp ? '' : 'none';
    if (wrapPhone) wrapPhone.style.display = useWhatsapp ? 'none' : '';

    if (useWhatsapp) {
      applySecondaryMeta();
    } else {
      applyPhoneMeta();
    }
  }

  // ערכים
  function getSecondaryValue() {
    if (secEl && wrapSec && wrapSec.style.display !== 'none') return (secEl.value || '').trim();
    return '';
  }
  function getPhoneValue() {
    if (phoneEl && wrapPhone && wrapPhone.style.display !== 'none') return (phoneEl.value || '').trim();
    return '';
  }

  // החלה ראשונית בטוחה
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyPhoneMeta();
      applySecondaryMeta();
      applyFormChannelUI(channel);
    });
  } else {
    applyPhoneMeta();
    applySecondaryMeta();
    applyFormChannelUI(channel);
  }

  /* ========= שליחה ל־WhatsApp ========= */
  window.sendToWhatsapp = function(event) {
    event?.preventDefault?.();
    window.setFormChannel?.('whatsapp');
    applyFormChannelUI('whatsapp');

    if (features.formChannel && features.formChannel.toLowerCase() !== 'whatsapp') return;

    const name = (nameEl?.value || '').trim();
    const secondaryVal = getSecondaryValue();
    const msg  = (msgEl?.value || '').trim();

    const esc = (v) => encodeURIComponent(v);
    const number = String(data.phoneDigits || '').replace(/\D/g, '') || "0000000000";

    const line = `${secondary.label || 'שדה'}: ${esc(secondaryVal)}`;
    const fullMsg = `שם: ${esc(name)}%0A${line}%0Aהודעה: ${esc(msg)}`;

    window.open(`https://wa.me/972${number}?text=${fullMsg}`, '_blank');
  };

  /* ========= שליחה לאימייל ========= */
  window.sendToEmail = function(event) {
    event?.preventDefault?.();
    window.setFormChannel?.('email');
    applyFormChannelUI('email');

    if (features.formChannel && features.formChannel.toLowerCase() !== 'email') return;
    if (!FLAG_SEND_EMAIL) return;

    const name  = (nameEl?.value || '').trim();
    const phone = getPhoneValue();
    const msg   = (msgEl?.value || '').trim();
    const email = (data.email || '').trim();

    const subject = encodeURIComponent(`פניה מכרטיס ביקור – ${name}`);
    const body = encodeURIComponent(`שם: ${name}\nטלפון: ${phone}\nהודעה: ${msg}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  // סוויצ'ר ידני
  window.setFormChannel = function(nextChannel) {
    const nc = String(nextChannel || '').toLowerCase();
    if (!['whatsapp','email'].includes(nc)) return;
    features.formChannel = nc;
    applyFormChannelUI(nc);
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


  videoContainer.setAttribute('tabindex', '0');
  videoContainer.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      const video = videoContainer.querySelector('video');
      if (video) {
        if (video.paused) video.play(); else video.pause();
      }
    }
  });
}

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
    if (!type) return; // ← הוספתי שמירה: חייב type
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

      // ✅ טקסט משותף לכל השיתופים
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
          // LinkedIn בפועל מתחשב בעיקר ב-url; השאר לא מזיק
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
}// ✅ פקד נגישות – הפעלה/כיבוי מצב נגישות (עם שמירת מצב ו-ARIA)
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




