window.cardData = {
  fullName: "Clix Marketing",
  role: "בניית כרטיסי ביקור דיגיטליים ושיווק לעסקים",

  // ✅ Title & Favicon
  pageTitle: "Clix Marketing | כרטיסי ביקור דיגיטליים ושיווק לעסקים",
  favicon: "https://clix-marketing.co.il/assets/logo/favicon.ico",

  // ✅ פרטי קשר
  phone: "053-2407-762",
  email: "nisimelec77@gmail.com",
  phoneDigits: "532407762",
  vcardLink: "./contact.vcf",
  company: "Clix Marketing",
  cardUrl: "https://clix-marketing.co.il/template/template-generic.html",
  vcard: { filename: "contact.vcf" },

  googleAnalyticsId: "G-5S0Q47GFVE",


  // ✅ רשתות חברתיות
  instagramLink: "https://www.instagram.com/clix__marketing?igsh=ZnF2eDIzcmlxaGY5&utm_source=qr",
  facebookLink: "https://www.facebook.com/share/17EphvBoGg/?mibextid=wwXIfr",
  youtubeLink: "https://www.youtube.com/embed/9YZjFtFK6lc?rel=0&modestbranding=1&playsinline=1",
  tiktokLink: "https://www.tiktok.com/@clix_beauty_cards?_t=ZS-8zYXJje2r4r&_r=1",

  // ✅ טקסטים לטפסים
  submitText: "שלח לוואטסאפ",
  btnEmailText: "תחזרו אלי",

  // ✅ לוגו ותמונת פרופיל עם alt
  logoSrc: "/assets/logo/myLogo.jpg",
  logoAlt: "לוגו של Clix Marketing",
  profileImage: "/assets/logo/myLogo.jpg",
  profileImageAlt: "תמונת פרופיל של Clix Marketing",

  // ✅ SEO בסיסי
  metaDescription: "כרטיסי ביקור דיגיטליים לעסקים: בנייה מקצועית, חיבור מהיר לוואטסאפ, טפסי יצירת קשר, המלצות ושיתוף לרשתות החברתיות. פתרון מלא לנוכחות דיגיטלית ממוקדת המרות עם Clix Marketing.",
  metaKeywords: "כרטיס ביקור דיגיטלי, דיגיטל לעסקים, טופס וואטסאפ, המלצות לקוחות, שיתוף ברשתות, Clix Marketing, קידום ממומן",
  canonicalHref: "https://clix-marketing.co.il/template/template-generic.html",
  metaRobots: "index, follow",
  sitemapHref: "https://clix-marketing.co.il/sitemap.xml",

  // ✅ Open Graph
  ogType: "website",
  ogTitle: "כרטיסי ביקור דיגיטליים – Clix Marketing",
  ogDescription: "כל המידע של העסק שלך במקום אחד: יצירת קשר, וידאו, המלצות ושיתוף. נבנה מהר, נראה מצוין, עובד בשבילך.",
  ogImage: "https://clix-marketing.co.il/assets/logo/myLogo.jpg",
  ogImageAlt: "לוגו של Clix Marketing",
  ogUrl: "https://clix-marketing.co.il/template/template-generic.html",

  // ✅ Twitter Cards
  twitterCard: "summary_large_image",
  twitterTitle: "Clix Marketing – כרטיסי ביקור דיגיטליים לעסקים",
  twitterDescription: "בנו כרטיס ביקור דיגיטלי ממיר וקדמו את העסק עם פתרונות חכמים של Clix Marketing.",
twitterImage: "https://clix-marketing.co.il/assets/logo/myLogo.jpg",

  // ✅ Structured Data – Schema.org JSON-LD
  schema: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Clix Marketing",
    "alternateName": "קליקס מרקטינג",
    "description": "Clix Marketing מתמחה בכרטיסי ביקור דיגיטליים לעסקים קטנים, קידום ממומן ובניית נוכחות דיגיטלית מקצועית.",
    "url": "https://www.clix-marketing.co.il",
    "logo": "https://www.clix-marketing.co.il/assets/logo/myLogo.jpg",
    "image": [
      "https://www.clix-marketing.co.il/assets/logo/myLogo.jpg"
    ],
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
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
        "opens": "09:00",
        "closes": "19:00"
      }
    ],
    "sameAs": [
  "https://www.facebook.com/share/17EphvBoGg/?mibextid=wwXIfr",
  "https://www.instagram.com/clix__marketing?igsh=ZnF2eDIzcmlxaGY5&utm_source=qr",
  "https://youtube.com/@nisimbeng",
  "https://www.tiktok.com/@clix_beauty_cards"
]


  },

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
    sendWhatsApp: false
  },

  shareOptions: {
    email: true,
    whatsapp: true,
    linkedin: false,
    twitter: true,
    facebook: true,
    telegram: true
  },

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
    <p>אנחנו מתמחים בהקמה מהירה של כרטיסי ביקור דיגיטליים לעסקים קטנים ובינוניים – כלי שמרכז את כל המידע שלך במקום אחד.</p>
    <p>בנוסף, אנו מציעים שירותי קידום ממומן בפייסבוק, אינסטגרם וטיקטוק – כדי להביא לקוחות אמיתיים לעסק שלך.</p>
    <p>ימי הצילום שלנו נבנים במיוחד עבורך: תסריט, צילום ועריכה – כדי שהתוכן שלך יהיה מוכן לשיווק בדיגיטל.</p>
    <p><strong>המטרה שלנו:</strong> לחסוך לך זמן, להגדיל חשיפה ולהביא פניות איכותיות.</p>
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
