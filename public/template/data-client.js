window.cardData = {
  fullName: "Clix Marketing",
  role: "בניית כרטיסי ביקור דיגיטליים ושיווק לעסקים",

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
  pageTitle: "Clix Marketing | כרטיסי ביקור דיגיטליים ושיווק לעסקים",
  favicon: "https://clix-marketing.co.il/assets/logo/favicon.ico",

  /* ✅ פרטי קשר */
  phone: "053-2407-762",
  email: "nisimelec77@gmail.com",
  phoneDigits: "532407762",
  vcardLink: "./contact.vcf",
  company: "Clix Marketing",
  cardUrl: "https://clix-marketing.co.il/template/template-generic.html",
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

    animationsEnabled: true,       // ← מדליק שכבת האנימציות
    animationStartDelayMs: 0       // דיליי גלובלי לכל האנימציות (ms)
  },

  /* ✅ מיפוי אנימציות לפי target */
  animations: {
    profile: "kf-profile-slide-in-left", // data-anim-target="profile"
    header:  "kf-zoom-fade",             // data-anim-target="header"
    cta:     "kf-slide-right"            // data-anim-target="cta"
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
  canonicalHref: "https://clix-marketing.co.il/template/template-generic.html",
  metaRobots: "index, follow",
  sitemapHref: "https://clix-marketing.co.il/sitemap.xml",

  /* ✅ Open Graph */
  ogType: "website",
ogTitle: "כרטיס ביקור דיגיטלי – הדור החדש לעסקים",
ogDescription: "כרטיס דיגיטלי שמופיע בגוגל, תומך ב-NFC, כולל דוגמאות מעוצבות ושיתוף קל. זול יותר מאתר – ומוכן בשבילך במהירות.",
  ogImage: "https://clix-marketing.co.il/assets/logo/myLogo.jpg",
  ogImageAlt: "לוגו של Clix Marketing",
  ogUrl: "https://clix-marketing.co.il/template/template-generic.html",

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
  "url": "https://clix-marketing.co.il",
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
    "target": "https://clix-marketing.co.il/template/template-generic.html",
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

<p>בעל עסק?  
רוצה שימצאו אותך בחיפוש בגוגל?  
היום מי שאין לו נוכחות דיגיטלית – פשוט לא קיים.</p>

<p>כרטיס ביקור דיגיטלי הוא הדרך הכי פשוטה, מהירה וזולה להציג את העסק שלך:  
טלפון, וואטסאפ, מיקום, המלצות (ובתכלס – כל מה שרק תרצו) –  
במקום אחד.</p>

<p>והכי חשוב – בניגוד לאתרים גדולים ויקרים,  
אצלנו תקבלו כרטיס אישי, מעוצב ונוח לשימוש,  
במחיר נוח שמתאים לכל עסק שחושב רחוק  
ומבין את המשמעות של הדיגיטל.</p>
  `,

  accordionTitle1: "▼ למה לבחור בכרטיס ביקור דיגיטלי?",
  accordionText1: `
    <p>כרטיס ביקור דיגיטלי מרכז ללקוח את כל הדרכים ליצור קשר – טלפון, וואטסאפ, מייל, ניווט, רשתות, המלצות ועוד – בעמוד אחד מהיר ונוח.</p>
  `,
  accordionTitle2: "▼ מה כולל השירות שלנו?",
  accordionText2: `
    <p>עיצוב מותאם אישית, עדכון תוכן, חיבור לרשתות, שיתוף בקליק, הטמעת וידאו/גלריה ותמיכה מלאה.</p>
  `,

  scrollToContactText: "השאר פרטים ונחזור אליך",
  recommendationsMainTitle: "לקוחות ממליצים",
  videoMainTitle: "קצת עלינו",
  contactFormTitle: "השאירו פרטים<br>ונחזור אליכם בהקדם",
  shareCardTitle: "שיתוף הכרטיס",

  // ✅ Recommendations
  recommendations: [
    { name: "שירי", title: " - מעצבת תכשיטים", text: "הכרטיס הדיגיטלי ש-Clix בנו לי העלה את העסק רמה. ללקוחות קל להגיע אליי מכל ערוץ." },
    { name: "אבי", title: " - בעל סטודיו לכושר", text: "שירות מקצועי ואדיב. תוך שבוע היה כרטיס, קמפיין רץ, ויום צילום עם תכנים מוכנים." },
    { name: "דנה", title: " - קוסמטיקאית", text: "מאז שהתחלתי להשתמש בכרטיס דיגיטלי + פרסום ממומן – היומן מלא. ממליצה בחום!" }
  ]
};
console.log("📦 data-client.js loaded OK");
