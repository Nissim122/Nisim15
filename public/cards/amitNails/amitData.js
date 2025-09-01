window.cardData = {
fullName: " עמית אבן צור",
role: "   להוסיף",

// שדה ייעודי לכותרת האתר
pageTitle: "  עמית אבן צור | כרטיס ביקור",

  phone: "054-9151-945",
  email: "amitezur@gmail.com",
  phoneDigits: "549151945",
  vcardLink: "./contact.vcf",
  company: "Clix Marketing",
  cardUrl: "https://www.clix-marketing.co.il/cards/amitNails/amit.html#",
  vcard: { filename: "contact.vcf" },

wazeLink: "https://waze.com/ul/hsv8wxcjtf",
  instagramLink: "https://www.instagram.com/amit.evenzur.nails?igsh=bGVzbGlhOTI4ZzI5&utm_source=qr",


  logoSrc: "/assets/media/yaelNails/yaelBackground.jpg",
  profileImage: "/assets/media/yaelNails/yaelLogo.png",
youtubeLink: "https://www.youtube.com/embed/9YZjFtFK6lc?rel=0&modestbranding=1&playsinline=1",

 facebookLink: "https://www.facebook.com/share/178LGRDcLN/?mibextid=wwXIfr",

features: {
  secondaryField: {
    key: "street",               // שם לוגי שיישלח בהודעה
    label: "האם יש ניסיון ?",               // הכותרת שתופיע וגם תישלח
    type: "text",
    placeholder: " האם יש ניסיון ?",    // הטקסט האפור בתוך התיבה
    inputMode: "text",
    required: true
  },
 
  // ...שאר הפיצ'רים


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
<strong class="quote-symbol">''</strong>

<p data-field="aboutLine1"><strong class="fw-700">שמי עמית אבן צור</strong></p>
<p data-field="aboutLine2"><strong class="fw-700">   להוסיף</strong></p>
`,
accordionTitle1:  "▼  להוסיף ",
accordionText1: `
  <p>להוסיף</p>
`,


accordionTitle2: "▼  להוסיף ",
accordionText2: `
  <p>להוסיף</p>
`,




scrollToContactText: "השאירי פרטים ונחזור אלייך",
recommendationsMainTitle: "מה הבוגרות מספרות",
videoMainTitle: "קצת עלי",
contactFormTitle: "השאירי פרטים<br>ואחזור אלייך בהקדם",
shareCardTitle: "שיתוף הכרטיס",

recommendations: [
  {
    name: "שלי הידנה",
    title: " - קורס מתחילות",
    text: `תודה רבההה 💕🎊🎉
תמיד הייתי עושה לעצמי ציפורניים אבל אף פעם לא יצא כזה יפה,
והכל בזכותך שלימדת והיית סובלנית 🙏
מחכה כבר להתעסק במקצוע הזה כל היוםם!`
  },
  {
    name: "הדס אליאב",
    title: " - השתלמות מקצועיות",
    text: `יעלוש המדהימה ♥️
תודה רבה על קורס בנייה בטיפסים ג׳ל הכי מושלם שיכולתי לבקש!
על הסבלנות, היחס החם והיד החופשית 🙌🏻
לא מובן מאליו בכלל.
אוהבת מלאאא, מוכשרת בטירוף 🫶🏻`
  },
  {
    name: "אורית אשורוב",
    title: " - מניקוריסטית",
    text: `היה לי התענוג והעונג ללמוד ממך! ❤️
את מהממת ומוכשרת, וכיף לי שיצא לי להכיר אותך ולקחת ממך טיפים שווים!
כל כך נהניתי מכל רגע, את לא רק מורה מדהימה אלא גם בן אדם עם וייב מושלם!
תודה על הסבלנות, ההשקעה והאווירה הכיפית 🙏
בטוחה שעוד נפגש לעוד סיגריה בהמשך! ☺️`
  },
  {
      name: "עמית אבן-צור",
      title: " - השתלמות מקצועיות",
      text: "היי יעל חן,\nהיה לי מדהים בקורס אצלך!!! את כל כך מקצועית ומלמדת בכל מא׳ עד ת׳.\nרציתי להגיד לך שעוד לא יצא לי ללמוד במקום כל כך יסודי, בו את משקיעה בכל אחת ואחת ומוודאת שיש לה את כל הכלים להמשיך הלאה!\nתודה על הכל ❤️❤️❤️"
    },
],

};
Object.freeze(window.cardData);


console.log("📦 data-client.js loaded OK");
