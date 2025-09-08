window.cardData = {
  fullName: "ניסים בנגייב",
  role: "מייסד ובעלים - Clix Marketing",

  // שדה ייעודי לכותרת האתר
  pageTitle: "ניסים בנגייב | כרטיס ביקור",

  phone: "053-2407-762",
  email: "nisimelec77@gmail.com",
  phoneDigits: "532407762",
  vcardLink: "./contact.vcf",
  company: "Clix Marketing",
  cardUrl: "https://www.clix-marketing.co.il/template/templeye-generic.html#",
  vcard: { filename: "contact.vcf" },

  wazeLink: "https://waze.com/ul/hsv8wxcjtf",
  instagramLink: "https://www.instagram.com/yael_artgallery?igsh=MTJuNzh4NTQ5aDV4YQ%3D%3D&utm_source=qr",
  facebookLink: "https://www.facebook.com/share/178LGRDcLN/?mibextid=wwXIfr",

  logoSrc: "/assets/media/test/logo-ortopok.png",
  profileImage: "/assets/media/test/profile.jpg",
  youtubeLink: "https://www.youtube.com/embed/9YZjFtFK6lc?rel=0&modestbranding=1&playsinline=1",

  // ✅ SEO בסיסי
  metaDescription: "כרטיס ביקור דיגיטלי מקצועי – כל מה שהלקוחות צריכים לדעת עליך במקום אחד: שירותים, המלצות, טפסי יצירת קשר וקישורים ישירים לרשתות החברתיות.",
  metaKeywords: "כרטיס ביקור דיגיטלי, יצירת קשר, טופס וואטסאפ, פרופיל עסקי, שיתוף רשתות חברתיות, לקוחות ממליצים, Clix Marketing",
  canonicalHref: "https://www.clix-marketing.co.il/template/templeye-generic.html",
  metaRobots: "index, follow",

  // ✅ Open Graph
  ogType: "website",
  ogTitle: "כרטיס ביקור דיגיטלי | כל המידע על העסק שלך במקום אחד",
  ogDescription: "בנה לעצמך נוכחות דיגיטלית מרשימה: כרטיס ביקור דיגיטלי עם תמונות, סרטון, טפסי יצירת קשר והמלצות אמיתיות מלקוחות.",
  ogImage: "/assets/media/test/logo-ortopok.png",
  ogImageAlt: "לוגו של Clix Marketing",
  ogUrl: "https://www.clix-marketing.co.il/template/templeye-generic.html",

  // ✅ Twitter Cards
  twitterCard: "summary_large_image",
  twitterTitle: "כרטיס ביקור דיגיטלי – חכם, נגיש ומעוצב",
  twitterDescription: "הכירו את הפתרון החדשני של Clix Marketing – כרטיס ביקור דיגיטלי מותאם אישית עם חיבור ישיר ללקוחות.",
  twitterImage: "/assets/media/test/logo-ortopok.png",

  features: {
    video: true,
    about: true,
    recommendations: true,

    contactWhatsApp: true,
    facebookLink: true,
    waze: true,
    phone: true,
    instagram: true,
    mail: true,

    sendEmail: false,
    sendWhatsApp: true,
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
      placeholder: "מה השם שלך ?   ",
      type: "text",
      inputMode: "text",
      required: true,
      maxLength: 80
    },
    secondary: {
      key: "treatmentType",
      label: " ואני בת ",
      placeholder: " בת כמה ?",
       type: "number",
    inputMode: "numeric",
      required: true,
      maxLength: 80
    },
    message: {
      key: "message",
      label: "הודעה חופשית :  ",
      placeholder: "  בעלת ניסיון בתחום?",
      inputMode: "text",
      required: false,
      maxLength: 500
    },
    submitText: "שליחה"
  },

  // ✅ About
  aboutParagraphs: `
    <p><strong class="quote-symbol">''</strong></p>
    <p data-field="aboutLine1"><strong>ברוכים הבאים ל-Clix Marketing</strong></p>
    <p>אנחנו מתמחים בהקמה מהירה של כרטיסי ביקור דיגיטליים לעסקים קטנים ובינוניים – כלי שיווקי חכם שמרכז את כל המידע שלך במקום אחד.</p>
    <p>בנוסף, אנו מציעים שירותי קידום ממומן בפייסבוק, אינסטגרם וטיקטוק – כדי להביא לקוחות אמיתיים לעסק שלך.</p>
    <p>ימי הצילום שלנו נבנים במיוחד עבורך: תסריט, צילום ועריכה – כדי שהתוכן שלך יהיה מוכן לשיווק בדיגיטל.</p>
    <p><strong>המטרה שלנו:</strong> לחסוך לך זמן, להגדיל את החשיפה, ולגרום ללקוחות חדשים להגיע אליך.</p>
  `,

  accordionTitle1: "▼ למה לבחור בכרטיס ביקור דיגיטלי?",
  accordionText1: `
    <p>כרטיס ביקור דיגיטלי הוא הדרך הקלה ביותר להציג את העסק שלך ללקוחות. 
    כל המידע במקום אחד: טלפון, וואטסאפ, מייל, ניווט, רשתות חברתיות, המלצות ועוד.</p>
  `,
  accordionTitle2: "▼ מה כולל השירות שלנו?",
  accordionText2: `
    <p>הכרטיס כולל עיצוב מותאם אישית, עדכון תוכן שוטף, חיבור לרשתות החברתיות שלך,
    אפשרות לשיתוף בקליק, והטמעת וידאו/גלריה.</p>
  `,

  scrollToContactText: "השאר פרטים ונחזור אליך",
  recommendationsMainTitle: "לקוחות ממליצים",
  videoMainTitle: " קצת עלינו",
  contactFormTitle: "השאירו פרטים<br>ונחזור אליכם בהקדם",
  shareCardTitle: " שיתוף הכרטיס",

  // ✅ Recommendations
  recommendations: [
    {
      name: "שירי",
      title: " - מעצבת תכשיטים",
      text: "הכרטיס הדיגיטלי ש-Clix בנו לי פשוט מעלה את העסק שלי רמה. קל ללקוחות להגיע אלי מכל ערוץ."
    },
    {
      name: "אבי",
      title: " - בעל סטודיו לאימון כושר",
      text: "השירות מקצועי ואדיב. תוך שבוע היה לי כרטיס, פרסום ממומן שרץ, ויום צילום עם תמונות ופוסטים מוכנים."
    },
    {
      name: "דנה",
      title: " - קוסמטיקאית",
      text: "מאז שהתחלתי להשתמש בכרטיס דיגיטלי + פרסום ממומן – היומן שלי מלא. ממליצה בחום!"
    }
  ]
};
console.log("📦 data-client.js loaded OK");
