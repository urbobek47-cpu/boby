/**
 * Fixture catalog data. Realistic Hebrew, real price bands (§5.2:
 * ceramics ₪49–399, jewelry ₪110–550, originals ₪1,000–5,000). Money in
 * integer agorot (§5.5).
 *
 * Expanded dataset containing 25 artists and 85 artworks for visual design
 * and masonry feed evaluation.
 */
import type { Artist, Artwork } from "./types";

const noaBarak: Artist = {
  slug: "noa-barak",
  displayName: { he: "נועה ברק", en: "Noa Barak" },
  location: { he: "פרדס חנה", en: "Pardes Hanna" },
  bio: {
    he: "נועה עובדת מהסטודיו שלה בפרדס חנה, עם חימר מקומי ושכבות דקות של גלזורה מינרלית. כל כלי נבנה ביד ונשרף פעמיים — הצבע הסופי מתגלה רק אחרי השרפה השנייה, ולכן אין שתי יצירות זהות.",
    en: "Noa works from her studio in Pardes Hanna with local clay and thin layers of mineral glaze. Each piece is hand-built and twice-fired — the final colour only reveals itself after the second firing, so no two pieces are alike.",
  },
  portraitPublicId: "/mock/studio-noa.jpg",
};

const yaelStudio: Artist = {
  slug: "yael-druk",
  displayName: { he: "יעל דרוק", en: "Yael Druk" },
  location: { he: "תל אביב", en: "Tel Aviv" },
  bio: {
    he: "יעל מדפיסה בהדפס רשת ידני במהדורות קטנות וממוספרות, על נייר כותנה כבד. כל הדפס נחתם וממוספר בעיפרון.",
    en: "Yael screen-prints by hand in small numbered editions on heavy cotton paper. Each print is signed and numbered in pencil.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
};

const danWood: Artist = {
  slug: "dan-avidan",
  displayName: { he: "דן אבידן", en: "Dan Avidan" },
  location: { he: "רמת השרון", en: "Ramat HaSharon" },
  bio: {
    he: "דן עובד בעץ אגוז וזית ממקור מקומי, ומייצר כל פריט לפי הזמנה — כך שאפשר להתאים את המידות למרחב שלכם.",
    en: "Dan works in locally sourced walnut and olive wood, making each piece to order so the dimensions can be matched to your space.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
};

const michalAlon: Artist = {
  slug: "michal-alon",
  displayName: { he: "מיכל אלון", en: "Michal Alon" },
  location: { he: "עין הוד", en: "Ein Hod" },
  bio: {
    he: "מיכל יוצרת כלי קרמיקה פיסוליים בהשראת חופי הכרמל והדיונות. הכלים שלה מתאפיינים בגלזורות מט בגווני חול, מלח ים וטרקוטה.",
    en: "Michal creates sculptural ceramic vessels inspired by the Carmel coast. Her pieces feature matte glazes in sand, sea salt, and terracotta tones.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
};

const avnerCohen: Artist = {
  slug: "avner-cohen",
  displayName: { he: "אבנר כהן", en: "Avner Cohen" },
  location: { he: "ירושלים", en: "Jerusalem" },
  bio: {
    he: "אבנר הוא צורף אומן ואמן יודאיקה עכשווית ברובע היהודי בירושלים. עבודותיו משלבות כסף טהור 925 וריקועי פטיש מסורתיים.",
    en: "Avner is a master silversmith and contemporary Judaica artist based in Jerusalem's Jewish Quarter, blending sterling silver with traditional hammer techniques.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
};

const shiraLevi: Artist = {
  slug: "shira-levi",
  displayName: { he: "שירה לוי", en: "Shira Levi" },
  location: { he: "גליל עליון", en: "Upper Galilee" },
  bio: {
    he: "שירה מציירת בשמן ואקריליק על קנווס פשתן גולמי. ציוריה עוסקים בשדות הפתוחים, באור הגלילי ובשינויי העונות.",
    en: "Shira paints in oil and acrylic on raw linen canvases. Her paintings reflect Galilee open fields, light, and seasonal shifts.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
};

const tamarFriedman: Artist = {
  slug: "tamar-friedman",
  displayName: { he: "תמר פרידמן", en: "Tamar Friedman" },
  location: { he: "צפת", en: "Safed" },
  bio: {
    he: "תמר אורגת שטיחי קיר וטקסטיל אמנותי מכותנה וצמר כבשים ישראלי על נול עץ עתיק בסמטאות צפת העתיקה.",
    en: "Tamar weaves wall hangings and fine textiles from Israeli sheep's wool on an ancient wooden loom in Safed's historic alleyways.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
};

const itamarGoldstein: Artist = {
  slug: "itamar-goldstein",
  displayName: { he: "איתמר גולדשטיין", en: "Itamar Goldstein" },
  location: { he: "קרית טבעון", en: "Kiryat Tivon" },
  bio: {
    he: "איתמר מפסל בברונזה, פליז ואבן גיר מקומית. עבודותיו מציגות קווים אורגניים ופיסול מינימליסטי שקט.",
    en: "Itamar sculpts in bronze, brass, and local limestone, creating quiet organic forms and minimalist sculptures.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
};

const amitRaz: Artist = {
  slug: "amit-raz",
  displayName: { he: "עמית רז", en: "Amit Raz" },
  location: { he: "מצפה רמון", en: "Mitzpe Ramon" },
  bio: {
    he: "עמית יוצר כלים מפורצלן לבן וזכוכית מותכת במצפה רמון. צורות הכלים מושפעות מסלעי המכתש ומסערות החול המדבריות.",
    en: "Amit crafts white porcelain vessels and fused glass in Mitzpe Ramon, drawing form from crater rocks and desert sandstorms.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
};

const doritShacham: Artist = {
  slug: "dorit-shacham",
  displayName: { he: "דורית שחם", en: "Dorit Shacham" },
  location: { he: "יפו", en: "Jaffa" },
  bio: {
    he: "דורית צורפת תכשיטים בזהב 18 קראט ובשילוב אבני חן גולמיות. כל פריט מיוצר בעבודת יד יחידנית בסטודיו שלה ביפו העתיקה.",
    en: "Dorit crafts 18k gold jewelry with raw gemstones. Every piece is handcrafted individually in her Old Jaffa studio.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
};

const adiNavon: Artist = {
  slug: "adi-navon",
  displayName: { he: "עדי נבון", en: "Adi Navon" },
  location: { he: "כליל", en: "Klil" },
  bio: {
    he: "עדי יוצרת קערות וכדי חמר בטכניקת ראקו יפנית עתיקה בשילוב עשן, נחושת וגלזורה מינרלית מוזהבת.",
    en: "Adi crafts clay bowls and vases using the ancient Japanese Raku technique with smoke, copper, and golden mineral glazes.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
};

const yuvalArad: Artist = {
  slug: "yuval-arad",
  displayName: { he: "יובל ארד", en: "Yuval Arad" },
  location: { he: "זכרון יעקב", en: "Zichron Yaakov" },
  bio: {
    he: "יובל חורט בעץ זית ואגוז עתיק. הוא מתמקד בחשיפת טקסטורת הסיבים הטבעית וביצירת חפצי לבוש ובית ייחודיים.",
    en: "Yuval turns ancient olive and walnut wood, focusing on revealing natural grain textures in unique home objects.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
};

const roniKatz: Artist = {
  slug: "roni-katz",
  displayName: { he: "רוני כץ", en: "Roni Katz" },
  location: { he: "חיפה", en: "Haifa" },
  bio: {
    he: "רוני מציירת בצבעי מים ואקריליק. עבודותיה עוסקות במפגש בין ההר לים, באור האורבני ובאדריכלות החיפאית.",
    en: "Roni paints in watercolor and acrylic, exploring the meeting of mountain and sea and Haifa's urban light.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
};

const liorBenDavid: Artist = {
  slug: "lior-ben-david",
  displayName: { he: "ליאור בן-דוד", en: "Lior Ben-David" },
  location: { he: "באר שבע", en: "Be'er Sheva" },
  bio: {
    he: "ליאור מחרש ומפסל בברזל, נחושת ופליז. גופי התאורה והפמוטים שלו משלבים אסתטיקה תעשייתית עם נשמה מדברית.",
    en: "Lior hand-forges iron, copper, and brass. His sculptural lighting and candlesticks combine industrial aesthetics with desert soul.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80",
};

const anatShapira: Artist = {
  slug: "anat-shapira",
  displayName: { he: "ענת שפירא", en: "Anat Shapira" },
  location: { he: "גבעתיים", en: "Givatayim" },
  bio: {
    he: "ענת מעצבת תכשיטי כסף סטרלינג 925 בטקסטורות גיאומטריות נקיות. עבודותיה מתאפיינות בגימור מט מוברש.",
    en: "Anat designs 925 sterling silver jewelry with clean geometric textures and brushed matte finishes.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80",
};

const giladOren: Artist = {
  slug: "gilad-oren",
  displayName: { he: "גילעד אורן", en: "Gilad Oren" },
  location: { he: "רמת הגולן", en: "Golan Heights" },
  bio: {
    he: "גילעד יוצר כלי קרמיקה בשריפת עצים ממושכת בתנור אנאגאמה ברמת הגולן. האפר והלהבות מותירים רשמים ייחודיים על כל כלי.",
    en: "Gilad fires ceramics in an Anagama wood kiln in the Golan Heights. Ash and flames leave unique firing marks on every piece.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
};

const orlyMizrachi: Artist = {
  slug: "orly-mizrachi",
  displayName: { he: "אורלי מזרחי", en: "Orly Mizrachi" },
  location: { he: "רחובות", en: "Rehovot" },
  bio: {
    he: "אורלי יוצרת עבודות טקסטיל תלת-ממדיות בשילוב רקמה ידנית, ליבוד צמר וחוטי כותנה מוזהבים.",
    en: "Orly creates 3D textile artwork combining hand embroidery, wool felting, and golden cotton threads.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
};

const hadarShachar: Artist = {
  slug: "hadar-shachar",
  displayName: { he: "הדר שחר", en: "Hadar Shachar" },
  location: { he: "נס ציונה", en: "Ness Ziona" },
  bio: {
    he: "הדר מעצבת חפצי יודאיקה עכשווית מבטון אדריכלי, פליז מוברש ועץ אלון.",
    en: "Hadar designs contemporary Judaica from architectural concrete, brushed brass, and oak wood.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
};

const arielWeinberg: Artist = {
  slug: "ariel-weinberg",
  displayName: { he: "אריאל ויינברג", en: "Ariel Weinberg" },
  location: { he: "הרצליה", en: "Herzliya" },
  bio: {
    he: "אריאל מציירת בסגנון אקספרסיבי מופשט בשכבות שמן עבות ובטכניקת סכין ציור (פלטה).",
    en: "Ariel paints in abstract expressionism using heavy oil layers and palette knife techniques.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
};

const netaShor: Artist = {
  slug: "neta-shor",
  displayName: { he: "נטע שור", en: "Neta Shor" },
  location: { he: "כפר סבא", en: "Kfar Saba" },
  bio: {
    he: "נטע יוצרת ספלים, קערות וכלי הגשה מפורצלן עדין בטכניקת האבניים ובצבעוניות פסטלית רכה.",
    en: "Neta throws delicate porcelain mugs, bowls, and serving pieces on the wheel in soft pastel colors.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
};

const guyStern: Artist = {
  slug: "guy-stern",
  displayName: { he: "גיא שטרן", en: "Guy Stern" },
  location: { he: "הוד השרון", en: "Hod HaSharon" },
  bio: {
    he: "גיא מחרט ומגלף חפצי עץ שימושיים מעצי ברוש, שיזף ואורן שנאספו לאחר גזם מקומי.",
    en: "Guy turns and carves functional wooden objects from locally salvaged cypress, jujube, and pine.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80",
};

const roeyAloni: Artist = {
  slug: "roey-aloni",
  displayName: { he: "רועי אלוני", en: "Roey Aloni" },
  location: { he: "ראש פינה", en: "Rosh Pinna" },
  bio: {
    he: "רועי מפסל באבן בזלת גלילית קשה ובאלמנטים מנחושת מלוטשת בטכניקת סתתות ידנית.",
    en: "Roey sculpts Galilean basalt stone and polished copper elements using manual stone-cutting methods.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
};

const michaelKraus: Artist = {
  slug: "michael-kraus",
  displayName: { he: "מיכאל קראוס", en: "Michael Kraus" },
  location: { he: "נהריה", en: "Nahariya" },
  bio: {
    he: "מיכאל יוצר הדפסי מונטייפ ותחריטים במהדורות מוגבלות בהשראת חופי הגליל המערבי והים الתיכון.",
    en: "Michael creates monotype prints and limited edition etchings inspired by Western Galilee shores.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
};

const maayanLevin: Artist = {
  slug: "maayan-levin",
  displayName: { he: "מעין לוין", en: "Maayan Levin" },
  location: { he: "אשקלון", en: "Ashkelon" },
  bio: {
    he: "מעין מעצבת שרשראות, עגילים שטוחים וצמידים מזהב 14 קראט ואבני טורמלין צבעוניות.",
    en: "Maayan designs 14k gold necklaces, earrings, and bracelets set with colorful tourmaline gems.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
};

const talBarLev: Artist = {
  slug: "tal-bar-lev",
  displayName: { he: "טל בר-לב", en: "Tal Bar-Lev" },
  location: { he: "אילת", en: "Eilat" },
  bio: {
    he: "טל יוצר קערות ולוחות זכוכית פיסוליים בשריפת פיוזינג בחום גבוה עם פיגמנטים מינרליים מדבריים.",
    en: "Tal creates sculptural glass bowls and panels using high-fire fusing with desert mineral pigments.",
  },
  portraitPublicId: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
};

const artworks: Artwork[] = [

  {
    slug: "kaarat-adama",
    title: { he: "קערת אדמה", en: "Earth Bowl" },
    story: {
      he: "קערה שנבנתה ביד מחומר מקומי, עם שכבות דקות של גלזורה מינרלית שנשרפו פעמיים. סימני השרפה משתנים מכלי לכלי והופכים כל אחת ליחידה — הגוונים החמים בשוליים הם תוצאה של האש, לא של צבע שנוסף.",
      en: "A hand-built bowl in local clay, with thin layers of mineral glaze fired twice. The firing marks differ from piece to piece and make each one unique — the warm tones at the rim come from the fire, not from added colour.",
    },
    materials: {
      he: ["חימר מקומי", "גלזורה מינרלית"],
      en: ["Local clay", "Mineral glaze"],
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "available",
    dimensions: { heightCm: 11, widthCm: 24, depthCm: 24, weightGrams: 820 },
    priceAgorot: 34000,
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "/mock/earth-bowl.jpg", aspectRatio: 4 / 5, role: "primary", caption: { he: "קערת קרמיקה רחבה בגוון חול עם שפה בגוון טרקוטה", en: "Broad sand-toned ceramic bowl with a terracotta rim" } },
    ],
    artist: noaBarak,
  },
  {
    slug: "yareach-print",
    title: { he: "ירח מלא", en: "Full Moon" },
    story: {
      he: "הדפס רשת בשלושה צבעים על נייר כותנה 300 גרם. מהדורה מוגבלת של 25 עותקים, חתוכה וממוספרת בעיפרון. הנייר הוא 100% כותנה עם שוליים טבעיים.",
      en: "Three-colour screen print on 300gsm cotton paper. Limited edition of 25 copies, signed and numbered in pencil. The paper is 100% cotton with deckle edges.",
    },
    materials: {
      he: ["נייר כותנה 300 גרם", "דיוני רשת על בסיס מים"],
      en: ["300gsm cotton paper", "Water-based screen inks"],
    },
    discipline: "painting",
    category: { he: "הדפס", en: "Print" },
    inventoryKind: "LIMITED_EDITION",
    availability: "available",
    editionSize: 25,
    editionNumber: 4,
    dimensions: { heightCm: 40, widthCm: 30, weightGrams: 150 },
    priceAgorot: 28000,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "/mock/yareach-print.jpg", aspectRatio: 3 / 4, role: "primary", caption: { he: "הדפס רשת מינימליסטי של עיגול טרקוטה על רקע שמנת", en: "Minimalist screen print of a terracotta circle on cream" } },
    ],
    artist: yaelStudio,
  },
  {
    slug: "gavia-etz",
    title: { he: "גביע עץ", en: "Wooden Goblet" },
    story: {
      he: "גביע שנחרט מענף עץ זית שנאסף לאחר גיזום מטע בגליל. הגימור הוא שמן חריע טבעי ושעוות דבורים, ללא חומרים סינתטיים. מתאים לשימוש קר בלבד.",
      en: "A goblet turned from an olive branch collected after pruning a Galilean grove. Finished with natural safflower oil and beeswax, free of synthetics. Suitable for cold use only.",
    },
    materials: {
      he: ["עץ זית מקומי", "שעוות דבורים"],
      en: ["Local olive wood", "Beeswax"],
    },
    discipline: "wood",
    category: { he: "עץ", en: "Wood" },
    inventoryKind: "MADE_TO_ORDER",
    availability: "available",
    leadTimeDays: 14,
    dimensions: { heightCm: 16, widthCm: 8, depthCm: 8, weightGrams: 220 },
    priceAgorot: 19000,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "/mock/wooden-goblet.jpg", aspectRatio: 3 / 4, role: "primary", caption: { he: "גביע עץ זית חרוט ביד עם טקסטורת סיבים טבעית", en: "Hand-turned olive wood goblet with natural grain" } },
    ],
    artist: danWood,
  },
  {
    slug: "kaarat-erev",
    title: { he: "קערת ערב", en: "Evening Bowl" },
    story: {
      he: "קערת חמר שחור עם גלזורה כהה ועמוקה. הניגוד בין הפנים המבריק לבחור המט המשתקף מאיר את טקסטורת החימר הגולמי.",
      en: "Black clay bowl with a deep dark glaze. The contrast between glossy interior and matte exterior brings out raw clay texture.",
    },
    materials: {
      he: ["חמר שחור", "גלזורה כהה"],
      en: ["Black clay", "Dark glaze"],
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "reserved",
    dimensions: { heightCm: 9, widthCm: 20, depthCm: 20, weightGrams: 650 },
    priceAgorot: 31000,
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "/mock/evening-bowl.jpg", aspectRatio: 4 / 5, role: "primary", caption: { he: "קערת חמר כהה עם גלזורת לילה עמוקה", en: "Dark clay bowl with deep night glaze" } },
    ],
    artist: noaBarak,
  },
  {
    slug: "tzalachat-nof",
    title: { he: "צלחת נוף", en: "Landscape Plate" },
    story: {
      he: "צלחת הגשה שטוחה עם גלזורה בגוון חול. יצירה יחידה שנמכרה — אך יש עבודות נוספות מאותה סדרה.",
      en: "A flat serving plate with a sand-toned glaze. A unique piece that has sold — but there are more works from the same series.",
    },
    materials: { he: ["חימר לבן", "גלזורה מט"], en: ["White clay", "Matte glaze"] },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "sold",
    dimensions: { heightCm: 3, widthCm: 28, depthCm: 28, weightGrams: 900 },
    priceAgorot: 26000,
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "/mock/landscape-plate.jpg", aspectRatio: 1, role: "primary", caption: { he: "צלחת קרמיקה עם נוף מופשט בגוני חול, מרווה וטרקוטה", en: "Ceramic plate with an abstract landscape in sand, sage and terracotta" } },
    ],
    artist: noaBarak,
  },
  {
    slug: "art-ceramics-1",
    title: { he: "אגרטל גלים #1", en: "Wave Vase #1" },
    story: {
      he: "אגרטל קרמיקה שנבנה ביד בהשראת תנועת גלי הים בחוף הבונים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Hand-built ceramic vase inspired by wave motion on Habonim beach. Original handcrafted work from the studio."
    },
    materials: {
      he: ["חימר מקומי", "גלזורה מבריקה"],
      en: ["Local clay", "Gloss glaze"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "LIMITED_EDITION",
    availability: "reserved",
    editionSize: 20, editionNumber: 1,
    
    dimensions: { heightCm: 15, widthCm: 12, weightGrams: 300 },
    priceAgorot: 38000,
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "אגרטל גלים", en: "Wave Vase" } }
    ],
    artist: noaBarak,
  },
  {
    slug: "art-ceramics-2",
    title: { he: "ספל חול #1", en: "Sand Mug #1" },
    story: {
      he: "ספל קפה עדין מפורצלן בטקסטורת חול מוברשת. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Delicate porcelain coffee mug with a brushed sand texture. Original handcrafted work from the studio."
    },
    materials: {
      he: ["פורצלן לבן"],
      en: ["White porcelain"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 16, widthCm: 13, weightGrams: 350 },
    priceAgorot: 16500,
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "ספל חול", en: "Sand Mug" } }
    ],
    artist: yaelStudio,
  },
  {
    slug: "art-ceramics-3",
    title: { he: "כד מדבר #1", en: "Desert Vessel #1" },
    story: {
      he: "כד פיסולי שנשרף בשריפת ראקו עם סימני עשן ייחודיים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Sculptural Raku-fired vessel with unique smoke patterns. Original handcrafted work from the studio."
    },
    materials: {
      he: ["חמר אדום", "גלזורת מט"],
      en: ["Red clay", "Matte glaze"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 17, widthCm: 14, weightGrams: 400 },
    priceAgorot: 54000,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1576020688413-40a2a194917a?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.6, role: "primary", caption: { he: "כד מדבר", en: "Desert Vessel" } }
    ],
    artist: danWood,
  },
  {
    slug: "art-ceramics-4",
    title: { he: "צלחת הגשה עגולה #1", en: "Round Serving Platter #1" },
    story: {
      he: "צלחת הגשה רחבה בטקסטורת אבניים ידנית. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Broad serving platter with wheel-thrown texture. Original handcrafted work from the studio."
    },
    materials: {
      he: ["חימר לבן"],
      en: ["White clay"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 18, widthCm: 15, weightGrams: 450 },
    priceAgorot: 35500,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.33, role: "primary", caption: { he: "צלחת הגשה עגולה", en: "Round Serving Platter" } }
    ],
    artist: michalAlon,
  },
  {
    slug: "art-ceramics-5",
    title: { he: "אגרטל אדמה גבוה #1", en: "Tall Earth Vase #1" },
    story: {
      he: "אגרטל גבוה ואלגנטי בגווני טרקוטה טבעיים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Tall, elegant vase in natural terracotta shades. Original handcrafted work from the studio."
    },
    materials: {
      he: ["חימר אדום מקומי"],
      en: ["Local red clay"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 19, widthCm: 16, weightGrams: 500 },
    priceAgorot: 52000,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.55, role: "primary", caption: { he: "אגרטל אדמה גבוה", en: "Tall Earth Vase" } }
    ],
    artist: avnerCohen,
  },
  {
    slug: "art-painting-6",
    title: { he: "שדות גליל #2", en: "Galilee Fields #2" },
    story: {
      he: "ציור שמן מופשט המבטא את ירוק השדות ואור השקיעה בגליל. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Abstract oil painting expressing field greens and Galilee sunset light. Original handcrafted work from the studio."
    },
    materials: {
      he: ["שמן על קנווס פשתן"],
      en: ["Oil on linen canvas"]
    },
    discipline: "painting",
    category: { he: "ציור", en: "Painting" },
    inventoryKind: "LIMITED_EDITION",
    availability: "available",
    editionSize: 20, editionNumber: 6,
    
    dimensions: { heightCm: 20, widthCm: 17, weightGrams: 550 },
    priceAgorot: 192500,
    shippingSizeBand: "LARGE",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "שדות גליל", en: "Galilee Fields" } }
    ],
    artist: shiraLevi,
  },
  {
    slug: "art-painting-7",
    title: { he: "אור מדברי #2", en: "Desert Light #2" },
    story: {
      he: "קומפוזיציה פנורמית רחבה בגווני זהב, חול ואוקר מדברי. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Wide panoramic composition in gold, sand, and desert ochre. Original handcrafted work from the studio."
    },
    materials: {
      he: ["אקריליק ושמן"],
      en: ["Acrylic and oil"]
    },
    discipline: "painting",
    category: { he: "ציור", en: "Painting" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 21, widthCm: 18, weightGrams: 600 },
    priceAgorot: 255000,
    shippingSizeBand: "LARGE",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.6, role: "primary", caption: { he: "אור מדברי", en: "Desert Light" } }
    ],
    artist: tamarFriedman,
  },
  {
    slug: "art-painting-8",
    title: { he: "נוף מופשט #4 #2", en: "Abstract Landscape #4 #2" },
    story: {
      he: "עבודה פיגורטיבית-מופשטת בשכבות צבע עבות ובמרקם רץ. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Figurative-abstract work in thick paint layers and rich texture. Original handcrafted work from the studio."
    },
    materials: {
      he: ["אקריליק על בד"],
      en: ["Acrylic on canvas"]
    },
    discipline: "painting",
    category: { he: "ציור", en: "Painting" },
    inventoryKind: "MADE_TO_ORDER",
    availability: "available",
    
    leadTimeDays: 14,
    dimensions: { heightCm: 22, widthCm: 19, weightGrams: 650 },
    priceAgorot: 145000,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "נוף מופשט #4", en: "Abstract Landscape #4" } }
    ],
    artist: itamarGoldstein,
  },
  {
    slug: "art-painting-9",
    title: { he: "זריחה בים #2", en: "Sunrise at Sea #2" },
    story: {
      he: "ציור צבעי מים רך ומלא אור על נייר ארש 300 גרם. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Soft, light-filled watercolor painting on Arches 300gsm paper. Original handcrafted work from the studio."
    },
    materials: {
      he: ["צבעי מים על נייר"],
      en: ["Watercolor on paper"]
    },
    discipline: "painting",
    category: { he: "ציור", en: "Painting" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 23, widthCm: 20, weightGrams: 700 },
    priceAgorot: 97500,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.67, role: "primary", caption: { he: "זריחה בים", en: "Sunrise at Sea" } }
    ],
    artist: amitRaz,
  },
  {
    slug: "art-wood-10",
    title: { he: "קערת זית פיסולית #2", en: "Sculptural Olive Bowl #2" },
    story: {
      he: "קערה שנחרטה מגוש עץ זית עתיק בן מאות שנים בגליל. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Bowl turned from a block of centuries-old Galilee olive wood. Original handcrafted work from the studio."
    },
    materials: {
      he: ["עץ זית עתיק"],
      en: ["Ancient olive wood"]
    },
    discipline: "wood",
    category: { he: "עץ", en: "Wood" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 24, widthCm: 21, weightGrams: 750 },
    priceAgorot: 63000,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.33, role: "primary", caption: { he: "קערת זית פיסולית", en: "Sculptural Olive Bowl" } }
    ],
    artist: doritShacham,
  },
  {
    slug: "art-wood-11",
    title: { he: "לוח חיתוך אגוז #3", en: "Walnut Cutting Board #3" },
    story: {
      he: "לוח הגשה וחיתוך בעבודת יד בגימור שמן מזון טבעי. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Handmade serving and cutting board finished with natural food-safe oil. Original handcrafted work from the studio."
    },
    materials: {
      he: ["עץ אגוז אמריקאי"],
      en: ["American walnut"]
    },
    discipline: "wood",
    category: { he: "עץ", en: "Wood" },
    inventoryKind: "LIMITED_EDITION",
    availability: "available",
    editionSize: 20, editionNumber: 11,
    
    dimensions: { heightCm: 25, widthCm: 22, weightGrams: 800 },
    priceAgorot: 39500,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "לוח חיתוך אגוז", en: "Walnut Cutting Board" } }
    ],
    artist: adiNavon,
  },
  {
    slug: "art-wood-12",
    title: { he: "פסל עץ מינימליסטי #3", en: "Minimalist Wood Sculpture #3" },
    story: {
      he: "פסל עץ דקורטיבי בגימור מט חלק בעבודת גילוף ידנית. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Decorative wooden sculpture in a smooth matte finish, hand-carved. Original handcrafted work from the studio."
    },
    materials: {
      he: ["עץ אלון ממוחזר"],
      en: ["Reclaimed oak"]
    },
    discipline: "wood",
    category: { he: "עץ", en: "Wood" },
    inventoryKind: "UNIQUE",
    availability: "reserved",
    
    
    dimensions: { heightCm: 26, widthCm: 23, weightGrams: 850 },
    priceAgorot: 99000,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "פסל עץ מינימליסטי", en: "Minimalist Wood Sculpture" } }
    ],
    artist: yuvalArad,
  },
  {
    slug: "art-jewelry-13",
    title: { he: "טבעת זהב וטורמלין #3", en: "Gold & Tourmaline Ring #3" },
    story: {
      he: "טבעת זהב בעבודת צורפות ידנית משובצת אבן טורמלין גולמית. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Hand-forged gold ring set with a raw green tourmaline gemstone. Original handcrafted work from the studio."
    },
    materials: {
      he: ["זהב 14 קראט", "טורמלין ירוק"],
      en: ["14k gold", "Green tourmaline"]
    },
    discipline: "jewelry",
    category: { he: "תכשיטים", en: "Jewelry" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 27, widthCm: 24, weightGrams: 900 },
    priceAgorot: 54500,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "טבעת זהב וטורמלין", en: "Gold & Tourmaline Ring" } }
    ],
    artist: roniKatz,
  },
  {
    slug: "art-jewelry-14",
    title: { he: "שרשרת כסף מוברש #3", en: "Brushed Silver Necklace #3" },
    story: {
      he: "תליון כסף בעל טקסטורה גיאומטרית עדינה וגימור מט. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Silver pendant with fine geometric texture and matte finish. Original handcrafted work from the studio."
    },
    materials: {
      he: ["כסף סטרלינג 925"],
      en: ["925 Sterling silver"]
    },
    discipline: "jewelry",
    category: { he: "תכשיטים", en: "Jewelry" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 28, widthCm: 25, weightGrams: 950 },
    priceAgorot: 44000,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.8, role: "primary", caption: { he: "שרשרת כסף מוברש", en: "Brushed Silver Necklace" } }
    ],
    artist: liorBenDavid,
  },
  {
    slug: "art-jewelry-15",
    title: { he: "עגילי זהב גיאומטריים #3", en: "Geometric Gold Earrings #3" },
    story: {
      he: "עגילי תלייה קלילים בזהב צהוב 18 קראט בעיצוב עכשווי. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Lightweight drop earrings in 18k yellow gold with contemporary design. Original handcrafted work from the studio."
    },
    materials: {
      he: ["זהב 18 קראט"],
      en: ["18k gold"]
    },
    discipline: "jewelry",
    category: { he: "תכשיטים", en: "Jewelry" },
    inventoryKind: "MADE_TO_ORDER",
    availability: "available",
    
    leadTimeDays: 14,
    dimensions: { heightCm: 29, widthCm: 26, weightGrams: 1000 },
    priceAgorot: 36000,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "עגילי זהב גיאומטריים", en: "Geometric Gold Earrings" } }
    ],
    artist: anatShapira,
  },
  {
    slug: "art-sculpture-16",
    title: { he: "פסל ברונזה אורגני #4", en: "Organic Bronze Sculpture #4" },
    story: {
      he: "פסל ברונזה קטן במהדורה מוגבלת של 8 עותקים בלבד. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Small bronze sculpture in a limited edition of only 8 copies. Original handcrafted work from the studio."
    },
    materials: {
      he: ["ברונזה יצוקה"],
      en: ["Cast bronze"]
    },
    discipline: "sculpture",
    category: { he: "פיסול", en: "Sculpture" },
    inventoryKind: "LIMITED_EDITION",
    availability: "available",
    editionSize: 20, editionNumber: 1,
    
    dimensions: { heightCm: 30, widthCm: 27, weightGrams: 1050 },
    priceAgorot: 342500,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "פסל ברונזה אורגני", en: "Organic Bronze Sculpture" } }
    ],
    artist: giladOren,
  },
  {
    slug: "art-sculpture-17",
    title: { he: "פיסול אבן גלילית #4", en: "Galilean Stone Sculpture #4" },
    story: {
      he: "עבודת סתתות ידנית באבן גיר גלילית בעלת טקסטורת מאובנים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Manual stone-cutting in Galilean limestone featuring fossil textures. Original handcrafted work from the studio."
    },
    materials: {
      he: ["אבן גיר מקומית"],
      en: ["Local limestone"]
    },
    discipline: "sculpture",
    category: { he: "פיסול", en: "Sculpture" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 31, widthCm: 28, weightGrams: 1100 },
    priceAgorot: 295000,
    shippingSizeBand: "LARGE",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.8, role: "primary", caption: { he: "פיסול אבן גלילית", en: "Galilean Stone Sculpture" } }
    ],
    artist: orlyMizrachi,
  },
  {
    slug: "art-textile-18",
    title: { he: "שטיח קיר צמר #4", en: "Wool Wall Hanging #4" },
    story: {
      he: "אריגת יד עשירה בטקסטורות מכותנה וצמר כבשים ישראלי. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Hand-woven textile rich in textures from cotton and Israeli wool. Original handcrafted work from the studio."
    },
    materials: {
      he: ["צמר כבשים", "חוטי כותנה"],
      en: ["Sheep's wool", "Cotton yarn"]
    },
    discipline: "textile",
    category: { he: "טקסטיל", en: "Textile" },
    inventoryKind: "UNIQUE",
    availability: "sold",
    
    
    dimensions: { heightCm: 32, widthCm: 29, weightGrams: 1150 },
    priceAgorot: 117500,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.33, role: "primary", caption: { he: "שטיח קיר צמר", en: "Wool Wall Hanging" } }
    ],
    artist: hadarShachar,
  },
  {
    slug: "art-textile-19",
    title: { he: "תמונת טקסטיל מוזהבת #4", en: "Golden Textile Art #4" },
    story: {
      he: "עבודת ליבוד צמר ורקמת חוטי זהב עדינה במסגרת עץ. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Wool felt and gold thread embroidery framed in natural wood. Original handcrafted work from the studio."
    },
    materials: {
      he: ["כותנה ממוחזרת", "חוט זהב"],
      en: ["Recycled cotton", "Gold thread"]
    },
    discipline: "textile",
    category: { he: "טקסטיל", en: "Textile" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 33, widthCm: 30, weightGrams: 1200 },
    priceAgorot: 95000,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "תמונת טקסטיל מוזהבת", en: "Golden Textile Art" } }
    ],
    artist: arielWeinberg,
  },
  {
    slug: "art-judaica-20",
    title: { he: "פמוטי כסף מרוקעים #4", en: "Hammered Silver Candlesticks #4" },
    story: {
      he: "זוג פמוטי שבת בריקוע פטיש ידני ומסורתי בירושלים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Pair of Shabbat candlesticks with traditional hand hammering in Jerusalem. Original handcrafted work from the studio."
    },
    materials: {
      he: ["כסף טהור 925"],
      en: ["925 Fine silver"]
    },
    discipline: "judaica",
    category: { he: "יודאיקה", en: "Judaica" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 34, widthCm: 31, weightGrams: 1250 },
    priceAgorot: 177500,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.33, role: "primary", caption: { he: "פמוטי כסף מרוקעים", en: "Hammered Silver Candlesticks" } }
    ],
    artist: netaShor,
  },
  {
    slug: "art-judaica-21",
    title: { he: "מזוזת בטון ופליז #5", en: "Concrete & Brass Mezuzah #5" },
    story: {
      he: "מזוזה בעיצוב ארכיטקטוני נקי מבטון מוברש ופליז מוזהב. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Clean architectural mezuzah crafted from concrete and gold brass. Original handcrafted work from the studio."
    },
    materials: {
      he: ["בטון אדריכלי", "פליז מוברש"],
      en: ["Architectural concrete", "Brushed brass"]
    },
    discipline: "judaica",
    category: { he: "יודאיקה", en: "Judaica" },
    inventoryKind: "LIMITED_EDITION",
    availability: "available",
    editionSize: 20, editionNumber: 6,
    
    dimensions: { heightCm: 35, widthCm: 12, weightGrams: 1300 },
    priceAgorot: 43000,
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "מזוזת בטון ופליז", en: "Concrete & Brass Mezuzah" } }
    ],
    artist: guyStern,
  },
  {
    slug: "art-ceramics-22",
    title: { he: "אגרטל גלים #5", en: "Wave Vase #5" },
    story: {
      he: "אגרטל קרמיקה שנבנה ביד בהשראת תנועת גלי הים בחוף הבונים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Hand-built ceramic vase inspired by wave motion on Habonim beach. Original handcrafted work from the studio."
    },
    materials: {
      he: ["חימר מקומי", "גלזורה מבריקה"],
      en: ["Local clay", "Gloss glaze"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "MADE_TO_ORDER",
    availability: "available",
    
    leadTimeDays: 14,
    dimensions: { heightCm: 36, widthCm: 13, weightGrams: 1350 },
    priceAgorot: 38000,
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "אגרטל גלים", en: "Wave Vase" } }
    ],
    artist: roeyAloni,
  },
  {
    slug: "art-ceramics-23",
    title: { he: "ספל חול #5", en: "Sand Mug #5" },
    story: {
      he: "ספל קפה עדין מפורצלן בטקסטורת חול מוברשת. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Delicate porcelain coffee mug with a brushed sand texture. Original handcrafted work from the studio."
    },
    materials: {
      he: ["פורצלן לבן"],
      en: ["White porcelain"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "reserved",
    
    
    dimensions: { heightCm: 37, widthCm: 14, weightGrams: 1400 },
    priceAgorot: 16500,
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "ספל חול", en: "Sand Mug" } }
    ],
    artist: michaelKraus,
  },
  {
    slug: "art-ceramics-24",
    title: { he: "כד מדבר #5", en: "Desert Vessel #5" },
    story: {
      he: "כד פיסולי שנשרף בשריפת ראקו עם סימני עשן ייחודיים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Sculptural Raku-fired vessel with unique smoke patterns. Original handcrafted work from the studio."
    },
    materials: {
      he: ["חמר אדום", "גלזורת מט"],
      en: ["Red clay", "Matte glaze"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 38, widthCm: 15, weightGrams: 1450 },
    priceAgorot: 54000,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1576020688413-40a2a194917a?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.6, role: "primary", caption: { he: "כד מדבר", en: "Desert Vessel" } }
    ],
    artist: maayanLevin,
  },
  {
    slug: "art-ceramics-25",
    title: { he: "צלחת הגשה עגולה #5", en: "Round Serving Platter #5" },
    story: {
      he: "צלחת הגשה רחבה בטקסטורת אבניים ידנית. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Broad serving platter with wheel-thrown texture. Original handcrafted work from the studio."
    },
    materials: {
      he: ["חימר לבן"],
      en: ["White clay"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 39, widthCm: 16, weightGrams: 1500 },
    priceAgorot: 35500,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.33, role: "primary", caption: { he: "צלחת הגשה עגולה", en: "Round Serving Platter" } }
    ],
    artist: talBarLev,
  },
  {
    slug: "art-ceramics-26",
    title: { he: "אגרטל אדמה גבוה #6", en: "Tall Earth Vase #6" },
    story: {
      he: "אגרטל גבוה ואלגנטי בגווני טרקוטה טבעיים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Tall, elegant vase in natural terracotta shades. Original handcrafted work from the studio."
    },
    materials: {
      he: ["חימר אדום מקומי"],
      en: ["Local red clay"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "LIMITED_EDITION",
    availability: "available",
    editionSize: 20, editionNumber: 11,
    
    dimensions: { heightCm: 15, widthCm: 17, weightGrams: 1550 },
    priceAgorot: 52000,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.55, role: "primary", caption: { he: "אגרטל אדמה גבוה", en: "Tall Earth Vase" } }
    ],
    artist: noaBarak,
  },
  {
    slug: "art-painting-27",
    title: { he: "שדות גליל #6", en: "Galilee Fields #6" },
    story: {
      he: "ציור שמן מופשט המבטא את ירוק השדות ואור השקיעה בגליל. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Abstract oil painting expressing field greens and Galilee sunset light. Original handcrafted work from the studio."
    },
    materials: {
      he: ["שמן על קנווס פשתן"],
      en: ["Oil on linen canvas"]
    },
    discipline: "painting",
    category: { he: "ציור", en: "Painting" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 16, widthCm: 18, weightGrams: 1600 },
    priceAgorot: 192500,
    shippingSizeBand: "LARGE",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "שדות גליל", en: "Galilee Fields" } }
    ],
    artist: yaelStudio,
  },
  {
    slug: "art-painting-28",
    title: { he: "אור מדברי #6", en: "Desert Light #6" },
    story: {
      he: "קומפוזיציה פנורמית רחבה בגווני זהב, חול ואוקר מדברי. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Wide panoramic composition in gold, sand, and desert ochre. Original handcrafted work from the studio."
    },
    materials: {
      he: ["אקריליק ושמן"],
      en: ["Acrylic and oil"]
    },
    discipline: "painting",
    category: { he: "ציור", en: "Painting" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 17, widthCm: 19, weightGrams: 1650 },
    priceAgorot: 255000,
    shippingSizeBand: "LARGE",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.6, role: "primary", caption: { he: "אור מדברי", en: "Desert Light" } }
    ],
    artist: danWood,
  },
  {
    slug: "art-painting-29",
    title: { he: "נוף מופשט #4 #6", en: "Abstract Landscape #4 #6" },
    story: {
      he: "עבודה פיגורטיבית-מופשטת בשכבות צבע עבות ובמרקם רץ. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Figurative-abstract work in thick paint layers and rich texture. Original handcrafted work from the studio."
    },
    materials: {
      he: ["אקריליק על בד"],
      en: ["Acrylic on canvas"]
    },
    discipline: "painting",
    category: { he: "ציור", en: "Painting" },
    inventoryKind: "MADE_TO_ORDER",
    availability: "available",
    
    leadTimeDays: 14,
    dimensions: { heightCm: 18, widthCm: 20, weightGrams: 1700 },
    priceAgorot: 145000,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "נוף מופשט #4", en: "Abstract Landscape #4" } }
    ],
    artist: michalAlon,
  },
  {
    slug: "art-painting-30",
    title: { he: "זריחה בים #6", en: "Sunrise at Sea #6" },
    story: {
      he: "ציור צבעי מים רך ומלא אור על נייר ארש 300 גרם. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Soft, light-filled watercolor painting on Arches 300gsm paper. Original handcrafted work from the studio."
    },
    materials: {
      he: ["צבעי מים על נייר"],
      en: ["Watercolor on paper"]
    },
    discipline: "painting",
    category: { he: "ציור", en: "Painting" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 19, widthCm: 21, weightGrams: 1750 },
    priceAgorot: 97500,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.67, role: "primary", caption: { he: "זריחה בים", en: "Sunrise at Sea" } }
    ],
    artist: avnerCohen,
  },
  {
    slug: "art-wood-31",
    title: { he: "קערת זית פיסולית #7", en: "Sculptural Olive Bowl #7" },
    story: {
      he: "קערה שנחרטה מגוש עץ זית עתיק בן מאות שנים בגליל. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Bowl turned from a block of centuries-old Galilee olive wood. Original handcrafted work from the studio."
    },
    materials: {
      he: ["עץ זית עתיק"],
      en: ["Ancient olive wood"]
    },
    discipline: "wood",
    category: { he: "עץ", en: "Wood" },
    inventoryKind: "LIMITED_EDITION",
    availability: "available",
    editionSize: 20, editionNumber: 1,
    
    dimensions: { heightCm: 20, widthCm: 22, weightGrams: 300 },
    priceAgorot: 63000,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.33, role: "primary", caption: { he: "קערת זית פיסולית", en: "Sculptural Olive Bowl" } }
    ],
    artist: shiraLevi,
  },
  {
    slug: "art-wood-32",
    title: { he: "לוח חיתוך אגוז #7", en: "Walnut Cutting Board #7" },
    story: {
      he: "לוח הגשה וחיתוך בעבודת יד בגימור שמן מזון טבעי. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Handmade serving and cutting board finished with natural food-safe oil. Original handcrafted work from the studio."
    },
    materials: {
      he: ["עץ אגוז אמריקאי"],
      en: ["American walnut"]
    },
    discipline: "wood",
    category: { he: "עץ", en: "Wood" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 21, widthCm: 23, weightGrams: 350 },
    priceAgorot: 39500,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "לוח חיתוך אגוז", en: "Walnut Cutting Board" } }
    ],
    artist: tamarFriedman,
  },
  {
    slug: "art-wood-33",
    title: { he: "פסל עץ מינימליסטי #7", en: "Minimalist Wood Sculpture #7" },
    story: {
      he: "פסל עץ דקורטיבי בגימור מט חלק בעבודת גילוף ידנית. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Decorative wooden sculpture in a smooth matte finish, hand-carved. Original handcrafted work from the studio."
    },
    materials: {
      he: ["עץ אלון ממוחזר"],
      en: ["Reclaimed oak"]
    },
    discipline: "wood",
    category: { he: "עץ", en: "Wood" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 22, widthCm: 24, weightGrams: 400 },
    priceAgorot: 99000,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "פסל עץ מינימליסטי", en: "Minimalist Wood Sculpture" } }
    ],
    artist: itamarGoldstein,
  },
  {
    slug: "art-jewelry-34",
    title: { he: "טבעת זהב וטורמלין #7", en: "Gold & Tourmaline Ring #7" },
    story: {
      he: "טבעת זהב בעבודת צורפות ידנית משובצת אבן טורמלין גולמית. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Hand-forged gold ring set with a raw green tourmaline gemstone. Original handcrafted work from the studio."
    },
    materials: {
      he: ["זהב 14 קראט", "טורמלין ירוק"],
      en: ["14k gold", "Green tourmaline"]
    },
    discipline: "jewelry",
    category: { he: "תכשיטים", en: "Jewelry" },
    inventoryKind: "UNIQUE",
    availability: "reserved",
    
    
    dimensions: { heightCm: 23, widthCm: 25, weightGrams: 450 },
    priceAgorot: 54500,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "טבעת זהב וטורמלין", en: "Gold & Tourmaline Ring" } }
    ],
    artist: amitRaz,
  },
  {
    slug: "art-jewelry-35",
    title: { he: "שרשרת כסף מוברש #7", en: "Brushed Silver Necklace #7" },
    story: {
      he: "תליון כסף בעל טקסטורה גיאומטרית עדינה וגימור מט. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Silver pendant with fine geometric texture and matte finish. Original handcrafted work from the studio."
    },
    materials: {
      he: ["כסף סטרלינג 925"],
      en: ["925 Sterling silver"]
    },
    discipline: "jewelry",
    category: { he: "תכשיטים", en: "Jewelry" },
    inventoryKind: "UNIQUE",
    availability: "sold",
    
    
    dimensions: { heightCm: 24, widthCm: 26, weightGrams: 500 },
    priceAgorot: 44000,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.8, role: "primary", caption: { he: "שרשרת כסף מוברש", en: "Brushed Silver Necklace" } }
    ],
    artist: doritShacham,
  },
  {
    slug: "art-jewelry-36",
    title: { he: "עגילי זהב גיאומטריים #8", en: "Geometric Gold Earrings #8" },
    story: {
      he: "עגילי תלייה קלילים בזהב צהוב 18 קראט בעיצוב עכשווי. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Lightweight drop earrings in 18k yellow gold with contemporary design. Original handcrafted work from the studio."
    },
    materials: {
      he: ["זהב 18 קראט"],
      en: ["18k gold"]
    },
    discipline: "jewelry",
    category: { he: "תכשיטים", en: "Jewelry" },
    inventoryKind: "LIMITED_EDITION",
    availability: "available",
    editionSize: 20, editionNumber: 6,
    
    dimensions: { heightCm: 25, widthCm: 27, weightGrams: 550 },
    priceAgorot: 36000,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "עגילי זהב גיאומטריים", en: "Geometric Gold Earrings" } }
    ],
    artist: adiNavon,
  },
  {
    slug: "art-sculpture-37",
    title: { he: "פסל ברונזה אורגני #8", en: "Organic Bronze Sculpture #8" },
    story: {
      he: "פסל ברונזה קטן במהדורה מוגבלת של 8 עותקים בלבד. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Small bronze sculpture in a limited edition of only 8 copies. Original handcrafted work from the studio."
    },
    materials: {
      he: ["ברונזה יצוקה"],
      en: ["Cast bronze"]
    },
    discipline: "sculpture",
    category: { he: "פיסול", en: "Sculpture" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 26, widthCm: 28, weightGrams: 600 },
    priceAgorot: 342500,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "פסל ברונזה אורגני", en: "Organic Bronze Sculpture" } }
    ],
    artist: yuvalArad,
  },
  {
    slug: "art-sculpture-38",
    title: { he: "פיסול אבן גלילית #8", en: "Galilean Stone Sculpture #8" },
    story: {
      he: "עבודת סתתות ידנית באבן גיר גלילית בעלת טקסטורת מאובנים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Manual stone-cutting in Galilean limestone featuring fossil textures. Original handcrafted work from the studio."
    },
    materials: {
      he: ["אבן גיר מקומית"],
      en: ["Local limestone"]
    },
    discipline: "sculpture",
    category: { he: "פיסול", en: "Sculpture" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 27, widthCm: 29, weightGrams: 650 },
    priceAgorot: 295000,
    shippingSizeBand: "LARGE",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.8, role: "primary", caption: { he: "פיסול אבן גלילית", en: "Galilean Stone Sculpture" } }
    ],
    artist: roniKatz,
  },
  {
    slug: "art-textile-39",
    title: { he: "שטיח קיר צמר #8", en: "Wool Wall Hanging #8" },
    story: {
      he: "אריגת יד עשירה בטקסטורות מכותנה וצמר כבשים ישראלי. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Hand-woven textile rich in textures from cotton and Israeli wool. Original handcrafted work from the studio."
    },
    materials: {
      he: ["צמר כבשים", "חוטי כותנה"],
      en: ["Sheep's wool", "Cotton yarn"]
    },
    discipline: "textile",
    category: { he: "טקסטיל", en: "Textile" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 28, widthCm: 30, weightGrams: 700 },
    priceAgorot: 117500,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.33, role: "primary", caption: { he: "שטיח קיר צמר", en: "Wool Wall Hanging" } }
    ],
    artist: liorBenDavid,
  },
  {
    slug: "art-textile-40",
    title: { he: "תמונת טקסטיל מוזהבת #8", en: "Golden Textile Art #8" },
    story: {
      he: "עבודת ליבוד צמר ורקמת חוטי זהב עדינה במסגרת עץ. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Wool felt and gold thread embroidery framed in natural wood. Original handcrafted work from the studio."
    },
    materials: {
      he: ["כותנה ממוחזרת", "חוט זהב"],
      en: ["Recycled cotton", "Gold thread"]
    },
    discipline: "textile",
    category: { he: "טקסטיל", en: "Textile" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 29, widthCm: 31, weightGrams: 750 },
    priceAgorot: 95000,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "תמונת טקסטיל מוזהבת", en: "Golden Textile Art" } }
    ],
    artist: anatShapira,
  },
  {
    slug: "art-judaica-41",
    title: { he: "פמוטי כסף מרוקעים #9", en: "Hammered Silver Candlesticks #9" },
    story: {
      he: "זוג פמוטי שבת בריקוע פטיש ידני ומסורתי בירושלים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Pair of Shabbat candlesticks with traditional hand hammering in Jerusalem. Original handcrafted work from the studio."
    },
    materials: {
      he: ["כסף טהור 925"],
      en: ["925 Fine silver"]
    },
    discipline: "judaica",
    category: { he: "יודאיקה", en: "Judaica" },
    inventoryKind: "LIMITED_EDITION",
    availability: "available",
    editionSize: 20, editionNumber: 11,
    
    dimensions: { heightCm: 30, widthCm: 12, weightGrams: 800 },
    priceAgorot: 177500,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.33, role: "primary", caption: { he: "פמוטי כסף מרוקעים", en: "Hammered Silver Candlesticks" } }
    ],
    artist: giladOren,
  },
  {
    slug: "art-judaica-42",
    title: { he: "מזוזת בטון ופליז #9", en: "Concrete & Brass Mezuzah #9" },
    story: {
      he: "מזוזה בעיצוב ארכיטקטוני נקי מבטון מוברש ופליז מוזהב. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Clean architectural mezuzah crafted from concrete and gold brass. Original handcrafted work from the studio."
    },
    materials: {
      he: ["בטון אדריכלי", "פליז מוברש"],
      en: ["Architectural concrete", "Brushed brass"]
    },
    discipline: "judaica",
    category: { he: "יודאיקה", en: "Judaica" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 31, widthCm: 13, weightGrams: 850 },
    priceAgorot: 43000,
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "מזוזת בטון ופליז", en: "Concrete & Brass Mezuzah" } }
    ],
    artist: orlyMizrachi,
  },
  {
    slug: "art-ceramics-43",
    title: { he: "אגרטל גלים #9", en: "Wave Vase #9" },
    story: {
      he: "אגרטל קרמיקה שנבנה ביד בהשראת תנועת גלי הים בחוף הבונים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Hand-built ceramic vase inspired by wave motion on Habonim beach. Original handcrafted work from the studio."
    },
    materials: {
      he: ["חימר מקומי", "גלזורה מבריקה"],
      en: ["Local clay", "Gloss glaze"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "MADE_TO_ORDER",
    availability: "available",
    
    leadTimeDays: 14,
    dimensions: { heightCm: 32, widthCm: 14, weightGrams: 900 },
    priceAgorot: 38000,
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "אגרטל גלים", en: "Wave Vase" } }
    ],
    artist: hadarShachar,
  },
  {
    slug: "art-ceramics-44",
    title: { he: "ספל חול #9", en: "Sand Mug #9" },
    story: {
      he: "ספל קפה עדין מפורצלן בטקסטורת חול מוברשת. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Delicate porcelain coffee mug with a brushed sand texture. Original handcrafted work from the studio."
    },
    materials: {
      he: ["פורצלן לבן"],
      en: ["White porcelain"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 33, widthCm: 15, weightGrams: 950 },
    priceAgorot: 16500,
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "ספל חול", en: "Sand Mug" } }
    ],
    artist: arielWeinberg,
  },
  {
    slug: "art-ceramics-45",
    title: { he: "כד מדבר #9", en: "Desert Vessel #9" },
    story: {
      he: "כד פיסולי שנשרף בשריפת ראקו עם סימני עשן ייחודיים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Sculptural Raku-fired vessel with unique smoke patterns. Original handcrafted work from the studio."
    },
    materials: {
      he: ["חמר אדום", "גלזורת מט"],
      en: ["Red clay", "Matte glaze"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "reserved",
    
    
    dimensions: { heightCm: 34, widthCm: 16, weightGrams: 1000 },
    priceAgorot: 54000,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1576020688413-40a2a194917a?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.6, role: "primary", caption: { he: "כד מדבר", en: "Desert Vessel" } }
    ],
    artist: netaShor,
  },
  {
    slug: "art-ceramics-46",
    title: { he: "צלחת הגשה עגולה #10", en: "Round Serving Platter #10" },
    story: {
      he: "צלחת הגשה רחבה בטקסטורת אבניים ידנית. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Broad serving platter with wheel-thrown texture. Original handcrafted work from the studio."
    },
    materials: {
      he: ["חימר לבן"],
      en: ["White clay"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "LIMITED_EDITION",
    availability: "available",
    editionSize: 20, editionNumber: 1,
    
    dimensions: { heightCm: 35, widthCm: 17, weightGrams: 1050 },
    priceAgorot: 35500,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.33, role: "primary", caption: { he: "צלחת הגשה עגולה", en: "Round Serving Platter" } }
    ],
    artist: guyStern,
  },
  {
    slug: "art-ceramics-47",
    title: { he: "אגרטל אדמה גבוה #10", en: "Tall Earth Vase #10" },
    story: {
      he: "אגרטל גבוה ואלגנטי בגווני טרקוטה טבעיים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Tall, elegant vase in natural terracotta shades. Original handcrafted work from the studio."
    },
    materials: {
      he: ["חימר אדום מקומי"],
      en: ["Local red clay"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 36, widthCm: 18, weightGrams: 1100 },
    priceAgorot: 52000,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.55, role: "primary", caption: { he: "אגרטל אדמה גבוה", en: "Tall Earth Vase" } }
    ],
    artist: roeyAloni,
  },
  {
    slug: "art-painting-48",
    title: { he: "שדות גליל #10", en: "Galilee Fields #10" },
    story: {
      he: "ציור שמן מופשט המבטא את ירוק השדות ואור השקיעה בגליל. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Abstract oil painting expressing field greens and Galilee sunset light. Original handcrafted work from the studio."
    },
    materials: {
      he: ["שמן על קנווס פשתן"],
      en: ["Oil on linen canvas"]
    },
    discipline: "painting",
    category: { he: "ציור", en: "Painting" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 37, widthCm: 19, weightGrams: 1150 },
    priceAgorot: 192500,
    shippingSizeBand: "LARGE",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "שדות גליל", en: "Galilee Fields" } }
    ],
    artist: michaelKraus,
  },
  {
    slug: "art-painting-49",
    title: { he: "אור מדברי #10", en: "Desert Light #10" },
    story: {
      he: "קומפוזיציה פנורמית רחבה בגווני זהב, חול ואוקר מדברי. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Wide panoramic composition in gold, sand, and desert ochre. Original handcrafted work from the studio."
    },
    materials: {
      he: ["אקריליק ושמן"],
      en: ["Acrylic and oil"]
    },
    discipline: "painting",
    category: { he: "ציור", en: "Painting" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 38, widthCm: 20, weightGrams: 1200 },
    priceAgorot: 255000,
    shippingSizeBand: "LARGE",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.6, role: "primary", caption: { he: "אור מדברי", en: "Desert Light" } }
    ],
    artist: maayanLevin,
  },
  {
    slug: "art-painting-50",
    title: { he: "נוף מופשט #4 #10", en: "Abstract Landscape #4 #10" },
    story: {
      he: "עבודה פיגורטיבית-מופשטת בשכבות צבע עבות ובמרקם רץ. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Figurative-abstract work in thick paint layers and rich texture. Original handcrafted work from the studio."
    },
    materials: {
      he: ["אקריליק על בד"],
      en: ["Acrylic on canvas"]
    },
    discipline: "painting",
    category: { he: "ציור", en: "Painting" },
    inventoryKind: "MADE_TO_ORDER",
    availability: "available",
    
    leadTimeDays: 14,
    dimensions: { heightCm: 39, widthCm: 21, weightGrams: 1250 },
    priceAgorot: 145000,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "נוף מופשט #4", en: "Abstract Landscape #4" } }
    ],
    artist: talBarLev,
  },
  {
    slug: "art-painting-51",
    title: { he: "זריחה בים #11", en: "Sunrise at Sea #11" },
    story: {
      he: "ציור צבעי מים רך ומלא אור על נייר ארש 300 גרם. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Soft, light-filled watercolor painting on Arches 300gsm paper. Original handcrafted work from the studio."
    },
    materials: {
      he: ["צבעי מים על נייר"],
      en: ["Watercolor on paper"]
    },
    discipline: "painting",
    category: { he: "ציור", en: "Painting" },
    inventoryKind: "LIMITED_EDITION",
    availability: "available",
    editionSize: 20, editionNumber: 6,
    
    dimensions: { heightCm: 15, widthCm: 22, weightGrams: 1300 },
    priceAgorot: 97500,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.67, role: "primary", caption: { he: "זריחה בים", en: "Sunrise at Sea" } }
    ],
    artist: noaBarak,
  },
  {
    slug: "art-wood-52",
    title: { he: "קערת זית פיסולית #11", en: "Sculptural Olive Bowl #11" },
    story: {
      he: "קערה שנחרטה מגוש עץ זית עתיק בן מאות שנים בגליל. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Bowl turned from a block of centuries-old Galilee olive wood. Original handcrafted work from the studio."
    },
    materials: {
      he: ["עץ זית עתיק"],
      en: ["Ancient olive wood"]
    },
    discipline: "wood",
    category: { he: "עץ", en: "Wood" },
    inventoryKind: "UNIQUE",
    availability: "sold",
    
    
    dimensions: { heightCm: 16, widthCm: 23, weightGrams: 1350 },
    priceAgorot: 63000,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.33, role: "primary", caption: { he: "קערת זית פיסולית", en: "Sculptural Olive Bowl" } }
    ],
    artist: yaelStudio,
  },
  {
    slug: "art-wood-53",
    title: { he: "לוח חיתוך אגוז #11", en: "Walnut Cutting Board #11" },
    story: {
      he: "לוח הגשה וחיתוך בעבודת יד בגימור שמן מזון טבעי. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Handmade serving and cutting board finished with natural food-safe oil. Original handcrafted work from the studio."
    },
    materials: {
      he: ["עץ אגוז אמריקאי"],
      en: ["American walnut"]
    },
    discipline: "wood",
    category: { he: "עץ", en: "Wood" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 17, widthCm: 24, weightGrams: 1400 },
    priceAgorot: 39500,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "לוח חיתוך אגוז", en: "Walnut Cutting Board" } }
    ],
    artist: danWood,
  },
  {
    slug: "art-wood-54",
    title: { he: "פסל עץ מינימליסטי #11", en: "Minimalist Wood Sculpture #11" },
    story: {
      he: "פסל עץ דקורטיבי בגימור מט חלק בעבודת גילוף ידנית. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Decorative wooden sculpture in a smooth matte finish, hand-carved. Original handcrafted work from the studio."
    },
    materials: {
      he: ["עץ אלון ממוחזר"],
      en: ["Reclaimed oak"]
    },
    discipline: "wood",
    category: { he: "עץ", en: "Wood" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 18, widthCm: 25, weightGrams: 1450 },
    priceAgorot: 99000,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "פסל עץ מינימליסטי", en: "Minimalist Wood Sculpture" } }
    ],
    artist: michalAlon,
  },
  {
    slug: "art-jewelry-55",
    title: { he: "טבעת זהב וטורמלין #11", en: "Gold & Tourmaline Ring #11" },
    story: {
      he: "טבעת זהב בעבודת צורפות ידנית משובצת אבן טורמלין גולמית. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Hand-forged gold ring set with a raw green tourmaline gemstone. Original handcrafted work from the studio."
    },
    materials: {
      he: ["זהב 14 קראט", "טורמלין ירוק"],
      en: ["14k gold", "Green tourmaline"]
    },
    discipline: "jewelry",
    category: { he: "תכשיטים", en: "Jewelry" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 19, widthCm: 26, weightGrams: 1500 },
    priceAgorot: 54500,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "טבעת זהב וטורמלין", en: "Gold & Tourmaline Ring" } }
    ],
    artist: avnerCohen,
  },
  {
    slug: "art-jewelry-56",
    title: { he: "שרשרת כסף מוברש #12", en: "Brushed Silver Necklace #12" },
    story: {
      he: "תליון כסף בעל טקסטורה גיאומטרית עדינה וגימור מט. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Silver pendant with fine geometric texture and matte finish. Original handcrafted work from the studio."
    },
    materials: {
      he: ["כסף סטרלינג 925"],
      en: ["925 Sterling silver"]
    },
    discipline: "jewelry",
    category: { he: "תכשיטים", en: "Jewelry" },
    inventoryKind: "LIMITED_EDITION",
    availability: "reserved",
    editionSize: 20, editionNumber: 11,
    
    dimensions: { heightCm: 20, widthCm: 27, weightGrams: 1550 },
    priceAgorot: 44000,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.8, role: "primary", caption: { he: "שרשרת כסף מוברש", en: "Brushed Silver Necklace" } }
    ],
    artist: shiraLevi,
  },
  {
    slug: "art-jewelry-57",
    title: { he: "עגילי זהב גיאומטריים #12", en: "Geometric Gold Earrings #12" },
    story: {
      he: "עגילי תלייה קלילים בזהב צהוב 18 קראט בעיצוב עכשווי. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Lightweight drop earrings in 18k yellow gold with contemporary design. Original handcrafted work from the studio."
    },
    materials: {
      he: ["זהב 18 קראט"],
      en: ["18k gold"]
    },
    discipline: "jewelry",
    category: { he: "תכשיטים", en: "Jewelry" },
    inventoryKind: "MADE_TO_ORDER",
    availability: "available",
    
    leadTimeDays: 14,
    dimensions: { heightCm: 21, widthCm: 28, weightGrams: 1600 },
    priceAgorot: 36000,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "עגילי זהב גיאומטריים", en: "Geometric Gold Earrings" } }
    ],
    artist: tamarFriedman,
  },
  {
    slug: "art-sculpture-58",
    title: { he: "פסל ברונזה אורגני #12", en: "Organic Bronze Sculpture #12" },
    story: {
      he: "פסל ברונזה קטן במהדורה מוגבלת של 8 עותקים בלבד. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Small bronze sculpture in a limited edition of only 8 copies. Original handcrafted work from the studio."
    },
    materials: {
      he: ["ברונזה יצוקה"],
      en: ["Cast bronze"]
    },
    discipline: "sculpture",
    category: { he: "פיסול", en: "Sculpture" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 22, widthCm: 29, weightGrams: 1650 },
    priceAgorot: 342500,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "פסל ברונזה אורגני", en: "Organic Bronze Sculpture" } }
    ],
    artist: itamarGoldstein,
  },
  {
    slug: "art-sculpture-59",
    title: { he: "פיסול אבן גלילית #12", en: "Galilean Stone Sculpture #12" },
    story: {
      he: "עבודת סתתות ידנית באבן גיר גלילית בעלת טקסטורת מאובנים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Manual stone-cutting in Galilean limestone featuring fossil textures. Original handcrafted work from the studio."
    },
    materials: {
      he: ["אבן גיר מקומית"],
      en: ["Local limestone"]
    },
    discipline: "sculpture",
    category: { he: "פיסול", en: "Sculpture" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 23, widthCm: 30, weightGrams: 1700 },
    priceAgorot: 295000,
    shippingSizeBand: "LARGE",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.8, role: "primary", caption: { he: "פיסול אבן גלילית", en: "Galilean Stone Sculpture" } }
    ],
    artist: amitRaz,
  },
  {
    slug: "art-textile-60",
    title: { he: "שטיח קיר צמר #12", en: "Wool Wall Hanging #12" },
    story: {
      he: "אריגת יד עשירה בטקסטורות מכותנה וצמר כבשים ישראלי. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Hand-woven textile rich in textures from cotton and Israeli wool. Original handcrafted work from the studio."
    },
    materials: {
      he: ["צמר כבשים", "חוטי כותנה"],
      en: ["Sheep's wool", "Cotton yarn"]
    },
    discipline: "textile",
    category: { he: "טקסטיל", en: "Textile" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 24, widthCm: 31, weightGrams: 1750 },
    priceAgorot: 117500,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.33, role: "primary", caption: { he: "שטיח קיר צמר", en: "Wool Wall Hanging" } }
    ],
    artist: doritShacham,
  },
  {
    slug: "art-textile-61",
    title: { he: "תמונת טקסטיל מוזהבת #13", en: "Golden Textile Art #13" },
    story: {
      he: "עבודת ליבוד צמר ורקמת חוטי זהב עדינה במסגרת עץ. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Wool felt and gold thread embroidery framed in natural wood. Original handcrafted work from the studio."
    },
    materials: {
      he: ["כותנה ממוחזרת", "חוט זהב"],
      en: ["Recycled cotton", "Gold thread"]
    },
    discipline: "textile",
    category: { he: "טקסטיל", en: "Textile" },
    inventoryKind: "LIMITED_EDITION",
    availability: "available",
    editionSize: 20, editionNumber: 1,
    
    dimensions: { heightCm: 25, widthCm: 12, weightGrams: 300 },
    priceAgorot: 95000,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "תמונת טקסטיל מוזהבת", en: "Golden Textile Art" } }
    ],
    artist: adiNavon,
  },
  {
    slug: "art-judaica-62",
    title: { he: "פמוטי כסף מרוקעים #13", en: "Hammered Silver Candlesticks #13" },
    story: {
      he: "זוג פמוטי שבת בריקוע פטיש ידני ומסורתי בירושלים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Pair of Shabbat candlesticks with traditional hand hammering in Jerusalem. Original handcrafted work from the studio."
    },
    materials: {
      he: ["כסף טהור 925"],
      en: ["925 Fine silver"]
    },
    discipline: "judaica",
    category: { he: "יודאיקה", en: "Judaica" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 26, widthCm: 13, weightGrams: 350 },
    priceAgorot: 177500,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.33, role: "primary", caption: { he: "פמוטי כסף מרוקעים", en: "Hammered Silver Candlesticks" } }
    ],
    artist: yuvalArad,
  },
  {
    slug: "art-judaica-63",
    title: { he: "מזוזת בטון ופליז #13", en: "Concrete & Brass Mezuzah #13" },
    story: {
      he: "מזוזה בעיצוב ארכיטקטוני נקי מבטון מוברש ופליז מוזהב. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Clean architectural mezuzah crafted from concrete and gold brass. Original handcrafted work from the studio."
    },
    materials: {
      he: ["בטון אדריכלי", "פליז מוברש"],
      en: ["Architectural concrete", "Brushed brass"]
    },
    discipline: "judaica",
    category: { he: "יודאיקה", en: "Judaica" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 27, widthCm: 14, weightGrams: 400 },
    priceAgorot: 43000,
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "מזוזת בטון ופליז", en: "Concrete & Brass Mezuzah" } }
    ],
    artist: roniKatz,
  },
  {
    slug: "art-ceramics-64",
    title: { he: "אגרטל גלים #13", en: "Wave Vase #13" },
    story: {
      he: "אגרטל קרמיקה שנבנה ביד בהשראת תנועת גלי הים בחוף הבונים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Hand-built ceramic vase inspired by wave motion on Habonim beach. Original handcrafted work from the studio."
    },
    materials: {
      he: ["חימר מקומי", "גלזורה מבריקה"],
      en: ["Local clay", "Gloss glaze"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "MADE_TO_ORDER",
    availability: "available",
    
    leadTimeDays: 14,
    dimensions: { heightCm: 28, widthCm: 15, weightGrams: 450 },
    priceAgorot: 38000,
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "אגרטל גלים", en: "Wave Vase" } }
    ],
    artist: liorBenDavid,
  },
  {
    slug: "art-ceramics-65",
    title: { he: "ספל חול #13", en: "Sand Mug #13" },
    story: {
      he: "ספל קפה עדין מפורצלן בטקסטורת חול מוברשת. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Delicate porcelain coffee mug with a brushed sand texture. Original handcrafted work from the studio."
    },
    materials: {
      he: ["פורצלן לבן"],
      en: ["White porcelain"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 29, widthCm: 16, weightGrams: 500 },
    priceAgorot: 16500,
    shippingSizeBand: "SMALL",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "ספל חול", en: "Sand Mug" } }
    ],
    artist: anatShapira,
  },
  {
    slug: "art-ceramics-66",
    title: { he: "כד מדבר #14", en: "Desert Vessel #14" },
    story: {
      he: "כד פיסולי שנשרף בשריפת ראקו עם סימני עשן ייחודיים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Sculptural Raku-fired vessel with unique smoke patterns. Original handcrafted work from the studio."
    },
    materials: {
      he: ["חמר אדום", "גלזורת מט"],
      en: ["Red clay", "Matte glaze"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "LIMITED_EDITION",
    availability: "available",
    editionSize: 20, editionNumber: 6,
    
    dimensions: { heightCm: 30, widthCm: 17, weightGrams: 550 },
    priceAgorot: 54000,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1576020688413-40a2a194917a?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.6, role: "primary", caption: { he: "כד מדבר", en: "Desert Vessel" } }
    ],
    artist: giladOren,
  },
  {
    slug: "art-ceramics-67",
    title: { he: "צלחת הגשה עגולה #14", en: "Round Serving Platter #14" },
    story: {
      he: "צלחת הגשה רחבה בטקסטורת אבניים ידנית. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Broad serving platter with wheel-thrown texture. Original handcrafted work from the studio."
    },
    materials: {
      he: ["חימר לבן"],
      en: ["White clay"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "reserved",
    
    
    dimensions: { heightCm: 31, widthCm: 18, weightGrams: 600 },
    priceAgorot: 35500,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.33, role: "primary", caption: { he: "צלחת הגשה עגולה", en: "Round Serving Platter" } }
    ],
    artist: orlyMizrachi,
  },
  {
    slug: "art-ceramics-68",
    title: { he: "אגרטל אדמה גבוה #14", en: "Tall Earth Vase #14" },
    story: {
      he: "אגרטל גבוה ואלגנטי בגווני טרקוטה טבעיים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Tall, elegant vase in natural terracotta shades. Original handcrafted work from the studio."
    },
    materials: {
      he: ["חימר אדום מקומי"],
      en: ["Local red clay"]
    },
    discipline: "ceramics",
    category: { he: "קרמיקה", en: "Ceramics" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 32, widthCm: 19, weightGrams: 650 },
    priceAgorot: 52000,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.55, role: "primary", caption: { he: "אגרטל אדמה גבוה", en: "Tall Earth Vase" } }
    ],
    artist: hadarShachar,
  },
  {
    slug: "art-painting-69",
    title: { he: "שדות גליל #14", en: "Galilee Fields #14" },
    story: {
      he: "ציור שמן מופשט המבטא את ירוק השדות ואור השקיעה בגליל. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Abstract oil painting expressing field greens and Galilee sunset light. Original handcrafted work from the studio."
    },
    materials: {
      he: ["שמן על קנווס פשתן"],
      en: ["Oil on linen canvas"]
    },
    discipline: "painting",
    category: { he: "ציור", en: "Painting" },
    inventoryKind: "UNIQUE",
    availability: "sold",
    
    
    dimensions: { heightCm: 33, widthCm: 20, weightGrams: 700 },
    priceAgorot: 192500,
    shippingSizeBand: "LARGE",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "שדות גליל", en: "Galilee Fields" } }
    ],
    artist: arielWeinberg,
  },
  {
    slug: "art-painting-70",
    title: { he: "אור מדברי #14", en: "Desert Light #14" },
    story: {
      he: "קומפוזיציה פנורמית רחבה בגווני זהב, חול ואוקר מדברי. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Wide panoramic composition in gold, sand, and desert ochre. Original handcrafted work from the studio."
    },
    materials: {
      he: ["אקריליק ושמן"],
      en: ["Acrylic and oil"]
    },
    discipline: "painting",
    category: { he: "ציור", en: "Painting" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 34, widthCm: 21, weightGrams: 750 },
    priceAgorot: 255000,
    shippingSizeBand: "LARGE",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.6, role: "primary", caption: { he: "אור מדברי", en: "Desert Light" } }
    ],
    artist: netaShor,
  },
  {
    slug: "art-painting-71",
    title: { he: "נוף מופשט #4 #15", en: "Abstract Landscape #4 #15" },
    story: {
      he: "עבודה פיגורטיבית-מופשטת בשכבות צבע עבות ובמרקם רץ. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Figurative-abstract work in thick paint layers and rich texture. Original handcrafted work from the studio."
    },
    materials: {
      he: ["אקריליק על בד"],
      en: ["Acrylic on canvas"]
    },
    discipline: "painting",
    category: { he: "ציור", en: "Painting" },
    inventoryKind: "LIMITED_EDITION",
    availability: "available",
    editionSize: 20, editionNumber: 11,
    
    dimensions: { heightCm: 35, widthCm: 22, weightGrams: 800 },
    priceAgorot: 145000,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "נוף מופשט #4", en: "Abstract Landscape #4" } }
    ],
    artist: guyStern,
  },
  {
    slug: "art-painting-72",
    title: { he: "זריחה בים #15", en: "Sunrise at Sea #15" },
    story: {
      he: "ציור צבעי מים רך ומלא אור על נייר ארש 300 גרם. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Soft, light-filled watercolor painting on Arches 300gsm paper. Original handcrafted work from the studio."
    },
    materials: {
      he: ["צבעי מים על נייר"],
      en: ["Watercolor on paper"]
    },
    discipline: "painting",
    category: { he: "ציור", en: "Painting" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 36, widthCm: 23, weightGrams: 850 },
    priceAgorot: 97500,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.67, role: "primary", caption: { he: "זריחה בים", en: "Sunrise at Sea" } }
    ],
    artist: roeyAloni,
  },
  {
    slug: "art-wood-73",
    title: { he: "קערת זית פיסולית #15", en: "Sculptural Olive Bowl #15" },
    story: {
      he: "קערה שנחרטה מגוש עץ זית עתיק בן מאות שנים בגליל. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Bowl turned from a block of centuries-old Galilee olive wood. Original handcrafted work from the studio."
    },
    materials: {
      he: ["עץ זית עתיק"],
      en: ["Ancient olive wood"]
    },
    discipline: "wood",
    category: { he: "עץ", en: "Wood" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 37, widthCm: 24, weightGrams: 900 },
    priceAgorot: 63000,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1.33, role: "primary", caption: { he: "קערת זית פיסולית", en: "Sculptural Olive Bowl" } }
    ],
    artist: michaelKraus,
  },
  {
    slug: "art-wood-74",
    title: { he: "לוח חיתוך אגוז #15", en: "Walnut Cutting Board #15" },
    story: {
      he: "לוח הגשה וחיתוך בעבודת יד בגימור שמן מזון טבעי. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Handmade serving and cutting board finished with natural food-safe oil. Original handcrafted work from the studio."
    },
    materials: {
      he: ["עץ אגוז אמריקאי"],
      en: ["American walnut"]
    },
    discipline: "wood",
    category: { he: "עץ", en: "Wood" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 38, widthCm: 25, weightGrams: 950 },
    priceAgorot: 39500,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1546484475-7f7bd55792da?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "לוח חיתוך אגוז", en: "Walnut Cutting Board" } }
    ],
    artist: maayanLevin,
  },
  {
    slug: "art-wood-75",
    title: { he: "פסל עץ מינימליסטי #15", en: "Minimalist Wood Sculpture #15" },
    story: {
      he: "פסל עץ דקורטיבי בגימור מט חלק בעבודת גילוף ידנית. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Decorative wooden sculpture in a smooth matte finish, hand-carved. Original handcrafted work from the studio."
    },
    materials: {
      he: ["עץ אלון ממוחזר"],
      en: ["Reclaimed oak"]
    },
    discipline: "wood",
    category: { he: "עץ", en: "Wood" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 39, widthCm: 26, weightGrams: 1000 },
    priceAgorot: 99000,
    shippingSizeBand: "MEDIUM",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "פסל עץ מינימליסטי", en: "Minimalist Wood Sculpture" } }
    ],
    artist: talBarLev,
  },
  {
    slug: "art-jewelry-76",
    title: { he: "טבעת זהב וטורמלין #16", en: "Gold & Tourmaline Ring #16" },
    story: {
      he: "טבעת זהב בעבודת צורפות ידנית משובצת אבן טורמלין גולמית. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Hand-forged gold ring set with a raw green tourmaline gemstone. Original handcrafted work from the studio."
    },
    materials: {
      he: ["זהב 14 קראט", "טורמלין ירוק"],
      en: ["14k gold", "Green tourmaline"]
    },
    discipline: "jewelry",
    category: { he: "תכשיטים", en: "Jewelry" },
    inventoryKind: "LIMITED_EDITION",
    availability: "available",
    editionSize: 20, editionNumber: 1,
    
    dimensions: { heightCm: 15, widthCm: 27, weightGrams: 1050 },
    priceAgorot: 54500,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80", aspectRatio: 1, role: "primary", caption: { he: "טבעת זהב וטורמלין", en: "Gold & Tourmaline Ring" } }
    ],
    artist: noaBarak,
  },
  {
    slug: "art-jewelry-77",
    title: { he: "שרשרת כסף מוברש #16", en: "Brushed Silver Necklace #16" },
    story: {
      he: "תליון כסף בעל טקסטורה גיאומטרית עדינה וגימור מט. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Silver pendant with fine geometric texture and matte finish. Original handcrafted work from the studio."
    },
    materials: {
      he: ["כסף סטרלינג 925"],
      en: ["925 Sterling silver"]
    },
    discipline: "jewelry",
    category: { he: "תכשיטים", en: "Jewelry" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 16, widthCm: 28, weightGrams: 1100 },
    priceAgorot: 44000,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.8, role: "primary", caption: { he: "שרשרת כסף מוברש", en: "Brushed Silver Necklace" } }
    ],
    artist: yaelStudio,
  },
  {
    slug: "art-jewelry-78",
    title: { he: "עגילי זהב גיאומטריים #16", en: "Geometric Gold Earrings #16" },
    story: {
      he: "עגילי תלייה קלילים בזהב צהוב 18 קראט בעיצוב עכשווי. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Lightweight drop earrings in 18k yellow gold with contemporary design. Original handcrafted work from the studio."
    },
    materials: {
      he: ["זהב 18 קראט"],
      en: ["18k gold"]
    },
    discipline: "jewelry",
    category: { he: "תכשיטים", en: "Jewelry" },
    inventoryKind: "MADE_TO_ORDER",
    availability: "reserved",
    
    leadTimeDays: 14,
    dimensions: { heightCm: 17, widthCm: 29, weightGrams: 1150 },
    priceAgorot: 36000,
    shippingSizeBand: "SMALL",
    isFragile: false,
    images: [
      { publicId: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "עגילי זהב גיאומטריים", en: "Geometric Gold Earrings" } }
    ],
    artist: danWood,
  },
  {
    slug: "art-sculpture-79",
    title: { he: "פסל ברונזה אורגני #16", en: "Organic Bronze Sculpture #16" },
    story: {
      he: "פסל ברונזה קטן במהדורה מוגבלת של 8 עותקים בלבד. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Small bronze sculpture in a limited edition of only 8 copies. Original handcrafted work from the studio."
    },
    materials: {
      he: ["ברונזה יצוקה"],
      en: ["Cast bronze"]
    },
    discipline: "sculpture",
    category: { he: "פיסול", en: "Sculpture" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 18, widthCm: 30, weightGrams: 1200 },
    priceAgorot: 342500,
    shippingSizeBand: "MEDIUM",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.75, role: "primary", caption: { he: "פסל ברונזה אורגני", en: "Organic Bronze Sculpture" } }
    ],
    artist: michalAlon,
  },
  {
    slug: "art-sculpture-80",
    title: { he: "פיסול אבן גלילית #16", en: "Galilean Stone Sculpture #16" },
    story: {
      he: "עבודת סתתות ידנית באבן גיר גלילית בעלת טקסטורת מאובנים. עבודה מקורית בעבודת יד מוקפדת בסטודיו.",
      en: "Manual stone-cutting in Galilean limestone featuring fossil textures. Original handcrafted work from the studio."
    },
    materials: {
      he: ["אבן גיר מקומית"],
      en: ["Local limestone"]
    },
    discipline: "sculpture",
    category: { he: "פיסול", en: "Sculpture" },
    inventoryKind: "UNIQUE",
    availability: "available",
    
    
    dimensions: { heightCm: 19, widthCm: 31, weightGrams: 1250 },
    priceAgorot: 295000,
    shippingSizeBand: "LARGE",
    isFragile: true,
    images: [
      { publicId: "https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&w=1000&q=80", aspectRatio: 0.8, role: "primary", caption: { he: "פיסול אבן גלילית", en: "Galilean Stone Sculpture" } }
    ],
    artist: avnerCohen,
  },
];

const dynamicArtworksStore: Artwork[] = [];

export function addCustomArtwork(newArtwork: Artwork): void {
  if (!dynamicArtworksStore.some((a) => a.slug === newArtwork.slug)) {
    dynamicArtworksStore.unshift(newArtwork);
  }
  try {
    if (typeof window !== "undefined") {
      const existing: Artwork[] = JSON.parse(localStorage.getItem("boby_custom_artworks") || "[]");
      if (!existing.some((a) => a.slug === newArtwork.slug)) {
        localStorage.setItem("boby_custom_artworks", JSON.stringify([newArtwork, ...existing]));
      }
    }
  } catch {
    // Ignore storage error
  }
}

function getAllArtworks(): Artwork[] {
  let custom: Artwork[] = [];
  try {
    if (typeof window !== "undefined") {
      custom = JSON.parse(localStorage.getItem("boby_custom_artworks") || "[]");
    }
  } catch {
    custom = [];
  }
  const combined = [...dynamicArtworksStore, ...custom, ...artworks];
  const uniqueMap = new Map<string, Artwork>();
  for (const item of combined) {
    if (!uniqueMap.has(item.slug)) {
      uniqueMap.set(item.slug, item);
    }
  }
  return Array.from(uniqueMap.values());
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const all = getAllArtworks();
  return all.find((a) => a.slug === slug) ?? null;
}

export async function listArtworkSlugs(): Promise<string[]> {
  const all = getAllArtworks();
  return all.map((a) => a.slug);
}

export async function listArtworks(): Promise<Artwork[]> {
  return getAllArtworks();
}

export async function listArtistSlugs(): Promise<string[]> {
  const all = getAllArtworks();
  return [...new Set(all.map((a) => a.artist.slug))];
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const all = getAllArtworks();
  return all.find((a) => a.artist.slug === slug)?.artist ?? null;
}

export async function listArtworksByArtist(slug: string): Promise<Artwork[]> {
  const all = getAllArtworks();
  return all.filter((a) => a.artist.slug === slug);
}
