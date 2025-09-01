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


  logoSrc: "",
  profileImage: "/assets/media/amitNails/amitLogo.jpg",
youtubeLink: "https://www.youtube.com/embed/9YZjFtFK6lc?rel=0&modestbranding=1&playsinline=1",

 facebookLink: "https://www.facebook.com/share/178LGRDcLN/?mibextid=wwXIfr",

features: {
  secondaryField: {
    key: "treatmentType",           // שם לוגי שיישלח בהודעה
    label: "סוג טיפול",             // הכותרת שתופיע וגם תישלח
    type: "text",
    placeholder: "איזה טיפול מעניין אותך",   // הטקסט האפור בתוך התיבה
    inputMode: "text",
    required: true
  },
 


  video: false,
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
    name: " שני גבעונה",
    title: " -  להוסיף",
    text: `היוש רק רציתי להגיד שעשית לי לק פשוט מדהים! אני מאוהבת!`
  },
  {
    name: "הדס אליאב",
    title: " -  להוסיף",
    text: `להוסיף`
  },
  {
    name: " עידית אזולאי",
    title: " -  להוסיף",
    text: ` להוסיף  `
  },
  {
    name: "הדס אליאב",
    title: " -  להוסיף",
    text: `להוסיף`
  },
  {
    name: " עידית אזולאי",
    title: " -  להוסיף",
    text: ` להוסיף  `
  },
],

};
Object.freeze(window.cardData);


console.log("📦 data-client.js loaded OK");
