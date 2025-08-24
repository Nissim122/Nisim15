window.cardData = {
fullName: " דמדדו",
role: "אומנות הציפורניים סטודיו ואקדמיה",

// שדה ייעודי לכותרת האתר
pageTitle: " דמגגו | כרטיס ביקור",

  phone: "054-8787-702",
  email: "yaelartgallery@gmail.com",
  phoneDigits: "548787702",
  vcardLink: "./contact.vcf",
  company: "Cardly",
  cardUrl: "https://www.clix-marketing.co.il/cards/yaelNails/yael.html#",
  vcard: { filename: "contact.vcf" },
  wazeLink: "https://waze.com/ul/hsv8wxcjtf",
  instagramLink: "https://www.instagram.com/yael_artgallery?igsh=MTJuNzh4NTQ5aDV4YQ%3D%3D&utm_source=qr",

  logoSrc: "/assets/media/test/logo-ortopok.png",
  profileImage: "/assets/media/test/profile.jpg",
<<<<<<< Updated upstream
  videoSrc: "/assets/media/test/mov_bbb.mp4",
=======
youtubeLink: "https://www.youtube.com/embed/9YZjFtFK6lc?rel=0&modestbranding=1&playsinline=1",
>>>>>>> Stashed changes
 facebookLink: "https://www.facebook.com/share/178LGRDcLN/?mibextid=wwXIfr",

 customFormMessage: true, // ✅ מפעיל את הסקריפט
  formMessageTemplate: "היי, קוראים לי {fullName}{agePart}. {msg}",

features: {
  

    secondaryField: {
      key: "city",
      label: "עיר",              // כאן אתה קובע איזה טקסט יוצג (label + בהודעה)
      type: "text",
      placeholder: "הכנס עיר",
      inputMode: "text",
      required: true
    },
  video: true,
  about: true,
  recommendations: true,

  contactWhatsApp: true, 
  facebookLink: true,
  waze: true,
  phone: true,
  instagram: true,
  mail : true,

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


  aboutParagraphs: `
<p><strong class="quote-symbol">''</strong></p>
<p data-field="aboutLine1"><strong>נעים מאוד, אני הילה סבן מאור עקיבא</strong></p>


  <p>במהלך השנים צברתי ידע וכלים מעשיים בתחומי הייעוץ, התמיכה וההדרכה, תוך דגש על שילוב בין מקצועיות גבוהה לגישה אנושית ונגישה.</p>
  <p>אני מאמין בשיתוף פעולה מלא עם הלקוח, שמירה על שקיפות ובניית תהליך ברור עם מטרות מוגדרות ותוצאות מדידות.</p>
  <p><strong>החזון שלי</strong> הוא להעניק לכל אדם כלים מעשיים לשיפור איכות חייו, חיזוק הביטחון העצמי והרחבת היכולות האישיות.</p>

  <p class="align-right">• ליווי אישי וצמיחה אישית</p>
  <p class="align-right">• פיתוח מיומנויות והתמודדות עם אתגרים</p>
  <p class="align-right">• בניית תוכניות מותאמות אישית לצרכי הלקוח</p>
  <p class="align-right">• מתן ייעוץ וכלים לשיפור הרגלים והתנהלות יומיומית</p>
`
,

  accordionTitle1: "▼ הגישה שלי בטיפול הרגשי",
  accordionText1: `
    <p>אני משלבת כלים מעולמות ה־CBT לצד הקשבה פעילה ורגישה.</p>
    <p>הטיפול מותאם אישית לכל אחד, מתוך אמונה ביכולת של כל אדם לחולל שינוי אמיתי כשהוא מקבל ליווי בגובה העיניים.</p>
  `,
  accordionTitle2: "▼ למי השירות מתאים?",
  accordionText2: `
    <p>הטיפול שלי מיועד להורים, ילדים, מתבגרים, נשים וגברים המתמודדים עם אתגר רגשי, לחץ נפשי או תקיעות רגשית.</p>
    <p>גם מי שמעוניין בהתפתחות אישית, חיזוק תקשורת זוגית או שיפור הורות ימצא מקום מכיל, מדויק ומקדם.</p>
  `,

  scrollToContactText: "השאר פרטים ונחזור אליך",
  recommendationsMainTitle: "לקוחות ממליצים",
  videoMainTitle: " קצת עלי",
  contactFormTitle: "השאירו פרטים<br>ואחזור אליכם בהקדם",
  shareCardTitle: " שיתוף הכרטיס",




    recommendations: [
  { 
    name: "נועה", 
    title: " - אם לילד עם צרכים מיוחדים", // כותרת ממליץ
    text: "הילה עזרה לי להבין את הילד שלי מחדש. בזכות הכלים שלה הצלחתי ליצור קשר עמוק יותר ולהרגיש ביטחון בדרך." 
  },
  { 
    name: "רוני", 
    title: "- אב וכותב תוכן", 
    text: "הגישה שלך שינתה לנו את הבית. בזכות השיחות איתך הצלחנו להבין את עצמנו טוב יותר, להתמודד עם קשיים יומיומיים, לחזק את הקשר שלנו כהורים ולהעניק לילדים תחושת ביטחון. התמיכה שלך הייתה מעשית, מחזקת, ואפשרה לנו לצמוח ולהתפתח יחד עם כל המשפחה." 
  },
  { 
    name: "אנונימי", 
    title: "- לקוח מרוצה", 
    text: "החוויה הייתה מדהימה. תודה רבה. התהליך שעברתי איתך היה משמעותי הרבה מעבר לציפיות שלי. בכל פגישה הרגשתי שינוי אמיתי – כלים שהשפיעו על חיי היומיום, שיחות שהעמיקו את ההבנה שלי והובילו לתחושת חיבור ושקט פנימי. התמיכה שלך הייתה עקבית, מקצועית, מלאה באכפתיות והובילה לפריצת דרך אמיתית." 
  }
]



};

console.log("📦 data-client.js loaded OK");
