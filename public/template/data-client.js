window.cardData = {
  fullName: "Clix Marketing",
  role: " כרטיסי ביקור דיגיטליים ושיווק לעסקים",

/* ===========================================================
   🎯 Dynamic Offer Popup – 3 Variants (Spring 2025)
   =========================================================== */
offerPopup: {
  enabled: true,           // ✅ הפעלה כללית של מערכת הפופאפים
  repeatAfterDays: 0.0000000000000001,      // כרגע בדיקות – יוצג תמיד
  delaySeconds: 7,         // ⏱️ הצגה אחרי 7 שניות

  items: [
    {
      id: "popup_digital_promo",
      active: true,
      title: "חבילת קידום + כרטיס ביקור דיגיטלי",
      text: `
        <div class="package-box">
          <div class="package-title">מה כלול בחבילה?</div>
          <ul class="package-list">
            <li>כרטיס ביקור דיגיטלי שמופיע בחיפוש בגוגל</li>
            <li>קידום ממומן חכם וממוקד לקהל היעד שלך</li>
            <li>תוכן, עיצוב ומעקב ביצועים מלאים</li>
            <li>ליווי אישי עד להשגת תוצאות אמיתיות</li>
          </ul>
        </div>
      `,
      priceBox: `
        <div class="price-box">
          <span class="discount-tag">הנחה 20%</span>
          <div class="new-price">₪2,689</div>
          <div class="old-price">₪3,300</div>
        </div>
      `,
      buttonText: "אני רוצה את  החבילה! 🚀",
      buttonLink: "https://wa.me/972532407762",
      bgColor: "#ffffff",
      endDate: "2025-10-31T23:59:59Z",
      countdownText: "המבצע תקף רק ל־:",
      layout: {
        order: {
          countdown: 1,  // ✅ טיימר בראש
          title: 2,
          text: 3,
          price: 4,
          button: 5
        }
      },
      version: "spring-2025-v1"
    },

   {
  id: "popup_2",
  active: true,
  title: "קידום ממומן במחיר מבצע מיוחד 💎",
  text: `
    <div class="package-box">
      <div class="package-title">מה כלול בשירות?</div>
      <ul class="package-list">
        <li>הקמה מלאה של קמפיין ממומן בפייסבוק ובאינסטגרם</li>
        <li>ניתוח קהל יעד ומסרים שיווקיים מותאמים לעסק</li>
        <li>הכנת מודעות מקצועיות כולל עיצוב ותוכן</li>
        <li>דוחות ביצועים ושיפורים שבועיים בזמן אמת</li>
      </ul>
    </div>
  `,
  priceBox: `
    <div class="price-box">
      <span class="discount-tag">הנחה 20%</span>
      <div class="new-price">₪1,800</div>
      <div class="old-price">₪2,200</div>
    </div>
  `,
  buttonText: "אני רוצה להתחיל בקידום 🚀",
  buttonLink: "https://wa.me/972532407762",
  bgColor: "#ffffff",
  theme: "light",
  endDate: "2025-10-30T23:59:59Z",
  countdownText: "המבצע מסתיים בעוד:",
  version: "spring-2025-v2"
},

{
  id: "popup_3",
  active: true,
  title: "כרטיס ביקור דיגיטלי עם קידום אורגני בגוגל 🔥",
  text: `
    <div class="package-box">
      <div class="package-title">מה כלול בשירות?</div>
      <ul class="package-list">
        <li>כרטיס ביקור דיגיטלי מעוצב ומקצועי שמופיע בחיפוש בגוגל</li>
        <li>הגדרת מילות מפתח רלוונטיות לעסק אחת לחודשיים</li>
        <li>התאמה מלאה לקידום אורגני (SEO) כולל כותרות ותגיות META</li>
        <li>תמיכה ועדכונים שוטפים לשמירה על דירוג גבוה</li>
      </ul>
    </div>
  `,
  priceBox: `
    <div class="price-box">
      <span class="discount-tag">הנחה 30%</span>
      <div class="new-price">₪1,500</div>
      <div class="old-price">₪2,169</div>

    </div>
  `,
  buttonText: "אני רוצה להופיע בגוגל! 🌐",
  buttonLink: "https://wa.me/972532407762",
  bgColor: "#ffffff",
  theme: "modern",
  endDate: "2025-10-30T23:59:59Z",
  countdownText: "המבצע מסתיים בעוד:",
  version: "spring-2025-v3"
},

  ]
},




theme: {
  bg: {
    url: "/assets/bg/test.jpg",
    size: "cover",         // "contain" או יחידות
    repeat: "no-repeat",   // repeat-x / repeat-y
    positionX: "center",   // "left"/"right"/"50%"
    positionY: "0px",      // "50%" / "20px" וכו'
    opacity: 1,            // 0–1
    blur: "0px",           // למשל "2px"
    scrollFactor: 0.3      // מהירות הפרלקסה (0.2 איטי, 0.5 מהיר)
  }
},

  /* ✅ Title & Favicon */
pageTitle: "כרטיסי ביקור דיגיטליים, שיווק וקידום ממומן לעסקים | Clix Marketing",
  favicon: "https://clix-marketing.co.il/assets/logo/favicon.ico",

  /* ✅ פרטי קשר */
  phone: "053-2407-762",
  email: "nisimelec77@gmail.com",
  phoneDigits: "532407762",
  vcardLink: "./contact.vcf",
  company: "Clix Marketing",
cardUrl: "https://clix-marketing.co.il/",
  vcard: { filename: "contact.vcf" },

  googleAnalyticsId: "G-5S0Q47GFVE",

  /* ✅ פיצ'רים + דגלי אנימציה (מאוחד) */
  features: {
    video: true,
    about: true,
    recommendations: true,
    contactWhatsApp: true,
    facebookLink: true,
    waze: false,
    phone: true,
    instagram: true,
    mail: true,
    tiktok: true,
    sendEmail: true,
    sendWhatsApp: false,

    animationsEnabled: true,   // ✅ חובה להפעיל
    animations: {
      process: "Alpha",        // שם המסלול (Alpha זה ברירת מחדל שלנו)
      openDelay: 0,          // עיכוב לפני P1 (ms)
      stagger: 120,            // סטאגר בין אלמנטים בתוך שלב
      runOnce: true,           // להריץ פעם אחת
      mobileMotionScale: 0.75, // תנועה קצרה יותר במובייל
      thresholds: {            // מתי טריגרים של גלילה (לשלבים P2–P6)
        P2: 0.15,
        P3: 0.15,
        P4: 0.15,
        P5: 0.15,
        P6: 0.10
      }
    }

  },

/* ✅ רשתות חברתיות */
instagramLink: "https://www.instagram.com/clix__marketing?igsh=ZnF2eDIzcmlxaGY5&utm_source=qr",
facebookLink: "https://www.facebook.com/share/17EphvBoGg/?mibextid=wwXIfr",
youtubeLink: "https://www.youtube.com/embed/G-o9zEVxxD0?rel=0&modestbranding=1&playsinline=1",
tiktokLink: "https://www.tiktok.com/@clix_beauty_cards?_t=ZS-8zYXJje2r4r&_r=1",

/* ✅ טקסטים לטפסים */
submitText: "שלח לוואטסאפ",
btnEmailText: "תחזרו אלי",

/* ✅ לוגו/פרופיל */
logoSrc: "/assets/logo/myLogo.jpg",
logoAlt: "לוגו של Clix Marketing",
profileImage: "/assets/logo/myLogo.jpg",
profileImageAlt: "תמונת פרופיל של Clix Marketing",

/* ✅ SEO בסיסי */
metaDescription: "בעל עסק? זה הזמן לעבור לכרטיס ביקור דיגיטלי שנמצא בגוגל, מעוצב אישית ותומך ב־NFC.",
metaKeywords: "כרטיס ביקור דיגיטלי NFC, דוגמאות כרטיס ביקור דיגיטלי, מה זה כרטיס ביקור דיגיטלי, כרטיס דיגיטלי לעסקים, כרטיס ביקור דיגיטלי בזול, כרטיס ביקור דיגיטלי מעוצב, כרטיס ביקור דיגיטלי עם שיתוף, כרטיס ביקור דיגיטלי 2025, כרטיס ביקור דיגיטלי היתרונות",
canonicalHref: "https://clix-marketing.co.il/",
metaRobots: "index, follow",
sitemapHref: "https://clix-marketing.co.il/sitemap.xml",

/* ✅ Open Graph */
ogType: "website",
ogTitle: "כרטיס ביקור דיגיטלי – הדור החדש לעסקים",
ogDescription: "כרטיס דיגיטלי שמופיע בגוגל, תומך ב-NFC, כולל דוגמאות מעוצבות ושיתוף קל. זול יותר מאתר – ומוכן בשבילך במהירות.",
ogImage: "https://clix-marketing.co.il/assets/logo/myLogo.jpg",
ogImageAlt: "לוגו של Clix Marketing",
ogUrl: "https://clix-marketing.co.il/",

/* ✅ Twitter Cards */
twitterCard: "summary_large_image",
twitterTitle: "כרטיס ביקור דיגיטלי NFC – זול, מהיר ומעוצב",
twitterDescription: "גלה דוגמאות לכרטיסי ביקור דיגיטליים שמופיעים בגוגל, תומכים ב־NFC ונותנים לעסק שלך יתרון אמיתי.",
twitterImage: "https://clix-marketing.co.il/assets/logo/myLogo.jpg",

/* ✅ Structured Data – JSON-LD (Focused on Digital Business Card + NFC) */
schema: {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "name": "Clix Marketing",
  "alternateName": "קליקס מרקטינג",
  "inLanguage": "he-IL",
  "description": "Clix Marketing מתמחה בבניית כרטיסי ביקור דיגיטליים לעסקים – כולל דוגמאות חיות, תמיכה ב-NFC לשיתוף בלחיצה, התאמה אישית לעסק והגדרה לנראות בגוגל.",
  "url": "https://clix-marketing.co.il/",
  "logo": "https://clix-marketing.co.il/assets/logo/myLogo.jpg",
  "image": ["https://clix-marketing.co.il/assets/logo/myLogo.jpg"],
  "telephone": "+972-53-2407-762",
  "priceRange": "$$",
  "areaServed": { "@type": "Country", "name": "IL" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "מושב חמד",
    "addressLocality": "חמד",
    "addressRegion": "מרכז",
    "postalCode": "60965",
    "addressCountry": "IL"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": "31.9702", "longitude": "34.8595" },

  /* 🔎 Keywords & Topics */
  "keywords": [
    "כרטיס ביקור דיגיטלי",
    "כרטיס ביקור דיגיטלי NFC",
    "דוגמאות כרטיס ביקור דיגיטלי",
    "מה זה כרטיס ביקור דיגיטלי",
    "כרטיס דיגיטלי לעסקים",
    "כרטיס ביקור דיגיטלי בזול",
    "כרטיס ביקור דיגיטלי מעוצב",
    "כרטיס ביקור דיגיטלי עם שיתוף",
    "כרטיס ביקור דיגיטלי 2025",
    "כרטיס ביקור דיגיטלי היתרונות"
  ],
  "knowsAbout": [
    "NFC לשיתוף כרטיס ביקור דיגיטלי",
    "הופעה בגוגל לכרטיסים דיגיטליים",
    "דוגמאות לכרטיסי ביקור דיגיטליים",
    "התאמה אישית לעסק",
    "UX במובייל לעסקים קטנים"
  ],

  /* 🧩 Service Offer */
  "makesOffer": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "itemOffered": {
      "@type": "Service",
      "name": "בניית כרטיס ביקור דיגיטלי (כולל NFC)",
      "category": "Digital Business Card",
      "provider": { "@type": "Organization", "name": "Clix Marketing" },
      "areaServed": "IL",
      "description": "כרטיס ביקור דיגיטלי מעוצב שמופיע בגוגל, כולל דוגמאות חיות, תמיכה ב-NFC, התאמה אישית והגדרת שיתוף בלחיצה אחת."
    }
  },

  /* 🕘 Opening Hours */
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
    "opens": "09:00",
    "closes": "19:00"
  }],

  /* 🔗 Social */
  "sameAs": [
    "https://www.facebook.com/share/17EphvBoGg/?mibextid=wwXIfr",
    "https://www.instagram.com/clix__marketing?igsh=ZnF2eDIzcmlxaGY5&utm_source=qr",
    "https://youtube.com/@nisimbeng",
    "https://www.tiktok.com/@clix_beauty_cards"
  ],

  /* ▶️ Helpful for link previews / actions */
  "potentialAction": {
    "@type": "ViewAction",
    "target": "https://clix-marketing.co.il/",
    "name": "צפה בכרטיס ביקור דיגיטלי לדוגמה"
  },
  "brand": { "@type": "Brand", "name": "Clix Marketing" }
},

  /* ✅ שיתוף */
  shareOptions: {
    email: true,
    whatsapp: true,
    linkedin: false,
    twitter: true,
    facebook: true,
    telegram: true
  },

  /* ✅ שדות טופס */
  fields: {
    primary: {
      key: "fullName",
      label: "היי שמי",
      placeholder: "מה השם שלך?",
      type: "text",
      inputMode: "text",
      required: true,
      maxLength: 80
    },
    secondary: {
      key: "treatmentType",
      label: "תחום העיסוק שלי הוא",
      placeholder: "באיזה תחום את/ה עוסק/ת?",
      type: "text",
      inputMode: "text",
      required: true,
      maxLength: 80
    },
    message: {
      key: "message",
      label: "הודעה חופשית",
      placeholder: "מה תרצה/י לכתוב?",
      inputMode: "text",
      required: false,
      maxLength: 500
    }
  },
// ✅ About
aboutParagraphs: `
  <p><strong class="quote-symbol">''</strong></p>

  <p data-field="aboutLine1"><strong>ברוכים הבאים ל-Clix Marketing</strong></p>

  <p>
    בעל עסק?<br>
    רוצה שימצאו אותך בחיפוש בגוגל?<br>
    היום מי שאין לו נוכחות דיגיטלית - פשוט לא קיים.
  </p>

  <p>
    כרטיס ביקור דיגיטלי הוא הדרך הכי פשוטה, מהירה וזולה להציג את העסק שלך:<br>
    יצירת קשר, מיקום העסק, המלצות מלקוחות, אודות העסק, וסרטון תדמית - 
    במקום אחד.
  </p>
<p>
    ובתכלס - מי שלא עבר מסע לקוח אמיתי - לא סוגר עסקה,<br>
    ורק מבזבז לך את הזמן.<br> האתר שלנו מעביר את הלקוח הפוטנציאלי  
    תהליך חכם שבו הוא לומד להכיר את העסק שלך צעד אחר צעד,  
     שברגע שהוא שולח הודעה - ההודעה הבאה שלו היא עסקה !
  </p>

`,



accordionTitle1: "▼ למה לבחור בנו",
  accordionText1: `
  <p>
     בניגוד לאתרים גדולים ויקרים
    אצלנו תקבלו כרטיס אישי, מעוצב ונוח לשימוש,<br>
    במחיר נוח שמתאים לכל עסק שחושב רחוק<br>
    ומבין את המשמעות של הדיגיטל.
  </p>`,

  accordionTitle2: "▼ מה תקבלו אצלנו?",
accordionText2: `
  <div class="features-list">
    <p>✔ הופעה בחיפוש בגוגל</p>
    <p>✔ תמיכה בטכנולוגיית NFC</p>
    <p>✔ עיצוב אישי ומותאם לעסק</p>
    <p>✔ אודות העסק + סרטון תדמית</p>
    <p>✔ מערכת המלצות מלקוחות (Swiper)</p>
    <p>✔ טופס וואטסאפ אוטומטי</p>
    <p>✔ כפתורי שיתוף מהירים לרשתות</p>
    <p>✔ קידום ממומן ישירות על האתר</p>
    <p>✔ שירות חידוש מילות מפתח ל־SEO</p>
    <p>✔ דו"ח כניסות חודשי + ניתוח נתונים</p>
  </div>
`,



  scrollToContactText: "קחו אותי להופיעה בגוגל!",
  recommendationsMainTitle: "לקוחות ממליצים",
  videoMainTitle: "קצת עלינו",
  contactFormTitle: "השאירו פרטים<br>ונחזור אליכם בהקדם",
  shareCardTitle: "שיתוף הכרטיס",

  // ✅ Recommendations
  recommendations: [
    { name: "שירי", title: " - מעצבת תכשיטים", text: "הכרטיס הדיגיטלי ש-Clix בנו לי העלה את העסק רמה. ללקוחות קל להגיע אליי מכל ערוץ." },
    { name: "אבי", title: " - בעל סטודיו לכושר", text: "שירות מקצועי ואדיב. תוך שבוע היה כרטיס, קמפיין רץ, ויום צילום עם תכנים מוכנים." },
    { name: "דנה", title: " - קוסמטיקאית", text: "מאז שהתחלתי להשתמש בכרטיס דיגיטלי + פרסום ממומן - היומן מלא. ממליצה בחום!" }
  ]
};
console.log("📦 data-client.js loaded OK");
