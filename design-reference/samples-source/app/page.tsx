"use client";

import { useState } from "react";

type View = "style" | "home" | "artwork" | "corporate";

const views: Array<{ id: View; label: string; number: string }> = [
  { id: "style", label: "מדריך סגנון", number: "01" },
  { id: "home", label: "דף הבית", number: "02" },
  { id: "artwork", label: "עמוד יצירה", number: "03" },
  { id: "corporate", label: "מתנות לעסקים", number: "04" },
];

function SiteHeader({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <>
      <div className="shipping-note">
        משלוח חינם בקנייה מעל <bdi>₪400</bdi>
      </div>
      <header className="site-header">
        <button className="mobile-menu" type="button" aria-label="פתיחת תפריט">
          <span />
          <span />
        </button>
        <nav className="main-nav" aria-label="ניווט ראשי">
          <button type="button" onClick={() => onNavigate("home")}>
            בית
          </button>
          <button type="button" onClick={() => onNavigate("artwork")}>
            יצירות
          </button>
          <button type="button">אמנים</button>
          <button type="button" onClick={() => onNavigate("corporate")}>
            מתנות לעסקים
          </button>
        </nav>
        <button
          className="wordmark"
          type="button"
          onClick={() => onNavigate("home")}
          aria-label="BOBY — דף הבית"
        >
          BOBY
        </button>
        <div className="header-actions">
          <button type="button">חיפוש</button>
          <button type="button">
            סל <bdi>(0)</bdi>
          </button>
        </div>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <div className="footer-mark">BOBY</div>
        <p>אמנות ומלאכת יד ישראלית, שנבחרה אחת־אחת.</p>
      </div>
      <div className="footer-links">
        <a href="#works">יצירות</a>
        <a href="#artists">אמנים</a>
        <a href="#about">עלינו</a>
        <a href="#accessibility">נגישות</a>
      </div>
      <div className="footer-small">
        <span>ישראל בלבד · מחירים כוללים מע״מ</span>
        <span dir="ltr">© 2026 BOBY</span>
      </div>
    </footer>
  );
}

function ArtworkCard({
  visual,
  title,
  artist,
  price,
  status,
  onOpen,
}: {
  visual: string;
  title: string;
  artist: string;
  price: string;
  status?: string;
  onOpen?: () => void;
}) {
  return (
    <article className="artwork-card">
      <button
        type="button"
        className={`art-visual ${visual}`}
        onClick={onOpen}
        aria-label={`פתיחת ${title}`}
      >
        {status && <span className="visual-status">{status}</span>}
        <span className="art-object" aria-hidden="true" />
        <span className="placeholder-label">מקום לצילום יצירה</span>
      </button>
      <div className="card-copy">
        <div>
          <h3>{title}</h3>
          <p>{artist}</p>
        </div>
        <bdi className="card-price">{price}</bdi>
      </div>
    </article>
  );
}

function StyleGuide() {
  return (
    <main className="style-page">
      <section className="style-intro">
        <p className="eyebrow">BOBY · מערכת עיצוב ראשונית</p>
        <h1>גלריה שקטה.<br />מסחר ברור.</h1>
        <p className="lead">
          השפה משלבת את האיפוק של חלל תצוגה עם החום של חומר שנעשה ביד.
          היצירות הן הצבע; הממשק הוא הקיר שמאחוריהן.
        </p>
        <div className="style-meta">
          <span>RTL מלידה</span>
          <span>WCAG AA</span>
          <span>מובייל קודם</span>
        </div>
      </section>

      <section className="style-section">
        <div className="section-kicker">01 · צבע</div>
        <div className="swatch-grid">
          {[
            ["#FAFAFA", "רקע גלריה", "swatch-gallery"],
            ["#FFFFFF", "משטח", "swatch-surface"],
            ["#111827", "דיו", "swatch-ink"],
            ["#4B5563", "טקסט משני", "swatch-muted"],
            ["#C17F59", "חומר / עיטור", "swatch-clay"],
            ["#8A5335", "פעולה נגישה", "swatch-action"],
          ].map(([hex, name, className]) => (
            <article className="swatch" key={hex}>
              <div className={className} />
              <bdi>{hex}</bdi>
              <span>{name}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="style-section type-section">
        <div className="section-kicker">02 · טיפוגרפיה</div>
        <div className="type-grid">
          <div className="display-sample">
            <span>Frank Ruhl Libre · כותרת</span>
            <h2>יצירה ישראלית,<br />שנבחרה אחת־אחת</h2>
          </div>
          <div className="body-sample">
            <span>Assistant · גוף וממשק</span>
            <p>
              עבודות מקוריות מאמנים עצמאיים ברחבי הארץ. לכל יצירה יש חומר,
              ידיים וסיפור — ואנחנו מביאים את כולם אליכם הביתה.
            </p>
            <div className="type-scale">
              <strong>כותרת משנה</strong>
              <span>טקסט גוף</span>
              <small>מידע משני ותוויות</small>
            </div>
          </div>
        </div>
      </section>

      <section className="style-section">
        <div className="section-kicker">03 · רכיבים</div>
        <div className="component-grid">
          <div className="component-panel">
            <h3>כפתורים</h3>
            <button className="button primary" type="button">לגלות יצירות</button>
            <button className="button secondary" type="button">לקרוא על האמן</button>
            <button className="button primary" type="button" disabled>לא זמין</button>
            <a className="text-link" href="#details">לפרטים נוספים</a>
          </div>
          <div className="component-panel">
            <h3>שדות</h3>
            <label className="field">
              <span>כתובת דוא״ל</span>
              <input type="email" placeholder="name@example.com" dir="ltr" />
            </label>
            <label className="field">
              <span>תקציב למתנה</span>
              <select defaultValue="">
                <option value="" disabled>בחירת טווח</option>
                <option>עד ₪300</option>
                <option>₪300–₪500</option>
                <option>מעל ₪500</option>
              </select>
            </label>
          </div>
          <div className="component-panel">
            <h3>מצבים ותגיות</h3>
            <div className="tag-row">
              <span className="tag">יצירה יחידה</span>
              <span className="tag light">חדש בגלריה</span>
              <span className="tag reserved">בסל של מישהו אחר</span>
            </div>
            <div className="notice">
              <strong>משלוח עד הבית</strong>
              <span>הגעה משוערת תוך 3–5 ימי עסקים</span>
            </div>
          </div>
        </div>
      </section>

      <section className="style-section">
        <div className="section-kicker">04 · כרטיסים</div>
        <div className="sample-cards">
          <ArtworkCard
            visual="visual-a"
            title="קערת אדמה"
            artist="נועה ברק · קרמיקה"
            price="₪340"
          />
          <article className="artist-card">
            <div className="artist-portrait">
              <span>מקום לפורטרט אמן</span>
            </div>
            <div>
              <p className="eyebrow">האמן שמאחורי היצירה</p>
              <h3>נועה ברק</h3>
              <p>עובדת בחומר מקומי ובשריפה פתוחה בסטודיו קטן בפרדס חנה.</p>
              <a className="text-link" href="#artist">לביקור בסטודיו</a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

function HomePage({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <div className="site-sample">
      <SiteHeader onNavigate={onNavigate} />
      <main>
        <section className="home-hero">
          <div className="hero-copy">
            <p className="eyebrow">אמנות ומלאכת יד ישראלית</p>
            <h1>יצירה ישראלית,<br />שנבחרה אחת־אחת.</h1>
            <p>
              עבודות מקוריות מאמנים עצמאיים ברחבי הארץ — עם הסיפור, החומר
              והידיים שמאחוריהן.
            </p>
            <div className="hero-actions">
              <button className="button primary" type="button" onClick={() => onNavigate("artwork")}>
                לגלות יצירות
              </button>
              <button className="button secondary" type="button" onClick={() => onNavigate("corporate")}>
                מתנות לעסקים
              </button>
            </div>
          </div>
          <div className="hero-art">
            <span className="hero-object" aria-hidden="true" />
            <div className="hero-caption">
              <span>מקום לצילום יצירה מובילה</span>
              <bdi>נועה ברק · 2026</bdi>
            </div>
          </div>
        </section>

        <section className="trust-row" aria-label="יתרונות">
          <span>אוצרות מקומית</span>
          <span>משלוח בישראל</span>
          <span>מחירים כוללים מע״מ</span>
          <span>תשלום מאובטח</span>
        </section>

        <section className="intent-section">
          <div className="section-heading">
            <p className="eyebrow">מתחילים מהסיבה</p>
            <h2>מה אתם מחפשים?</h2>
          </div>
          <div className="intent-grid">
            {[
              ["מתנה לחתונה", "יצירה שתישאר הרבה אחרי האירוע"],
              ["לבית חדש", "חומר, צבע ואופי לחלל"],
              ["עד ₪500", "מתנה מקורית בתקציב ברור"],
            ].map(([title, copy], index) => (
              <button className={`intent-card intent-${index + 1}`} type="button" key={title}>
                <span className="intent-number">0{index + 1}</span>
                <strong>{title}</strong>
                <span>{copy}</span>
                <i aria-hidden="true">←</i>
              </button>
            ))}
          </div>
        </section>

        <section className="works-section" id="works">
          <div className="section-heading row-heading">
            <div>
              <p className="eyebrow">נבחרו השבוע</p>
              <h2>חדשות בגלריה</h2>
            </div>
            <button className="text-link button-link" type="button">לכל היצירות</button>
          </div>
          <div className="art-grid">
            <ArtworkCard
              visual="visual-a"
              title="קערת אדמה"
              artist="נועה ברק · קרמיקה"
              price="₪340"
              status="חדש"
              onOpen={() => onNavigate("artwork")}
            />
            <ArtworkCard
              visual="visual-b"
              title="קו פתוח"
              artist="יעל שלו · תכשיטים"
              price="₪420"
              onOpen={() => onNavigate("artwork")}
            />
            <ArtworkCard
              visual="visual-c"
              title="אור אחר הצהריים"
              artist="עמית שחר · ציור"
              price="₪2,800"
              status="יצירה יחידה"
              onOpen={() => onNavigate("artwork")}
            />
          </div>
        </section>

        <section className="artist-feature" id="artists">
          <div className="studio-visual">
            <span>מקום לצילום סטודיו</span>
            <div className="studio-shape" aria-hidden="true" />
          </div>
          <div className="artist-story">
            <p className="eyebrow">מאחורי החומר</p>
            <h2>״כל כלי מתחיל<br />בשיחה עם האדמה״</h2>
            <p>
              נועה ברק יוצרת כלי קרמיקה שימושיים מחומר מקומי. כל קערה נבנית
              ביד, עוברת שריפה פתוחה ונושאת סימנים שאי אפשר לשחזר.
            </p>
            <a className="button secondary" href="#artist">להכיר את נועה</a>
          </div>
        </section>

        <section className="corporate-teaser">
          <div>
            <p className="eyebrow light-eyebrow">מתנות לעסקים</p>
            <h2>לא עוד מארז<br />יין ודבש.</h2>
          </div>
          <div>
            <p>
              מתנה ישראלית מקורית. מארזים אוצרותיים לפי תקציב, אספקה מרוכזת
              או לבתי העובדים — וחשבונית אחת.
            </p>
            <button className="button light-button" type="button" onClick={() => onNavigate("corporate")}>
              לגלות את המארזים
            </button>
          </div>
        </section>

        <section className="newsletter">
          <div>
            <p className="eyebrow">מכתב מהגלריה</p>
            <h2>יצירות חדשות, פעם בשבוע.</h2>
          </div>
          <form className="newsletter-form">
            <label className="sr-only" htmlFor="newsletter-email">כתובת דוא״ל</label>
            <input id="newsletter-email" type="email" placeholder="כתובת דוא״ל" />
            <button type="submit">להצטרפות</button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ArtworkPage({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <div className="site-sample">
      <SiteHeader onNavigate={onNavigate} />
      <main className="product-page">
        <nav className="breadcrumbs" aria-label="פירורי לחם">
          <button type="button" onClick={() => onNavigate("home")}>בית</button>
          <span>·</span>
          <button type="button">קרמיקה</button>
          <span>·</span>
          <span>קערת אדמה</span>
        </nav>

        <section className="product-layout">
          <div className="product-gallery">
            <div className="product-main-image">
              <span className="large-object" aria-hidden="true" />
              <span className="placeholder-label">צילום ראשי · יחס מקורי</span>
              <button className="zoom-button" type="button">הגדלה</button>
            </div>
            <div className="product-thumbs" aria-label="תמונות נוספות">
              <button type="button" className="thumb active-thumb" aria-label="תמונה ראשית"><span /></button>
              <button type="button" className="thumb detail-thumb" aria-label="פרט החומר"><span /></button>
              <button type="button" className="thumb scale-thumb" aria-label="היצירה בקנה מידה"><span /></button>
            </div>
          </div>

          <div className="product-info">
            <span className="tag">יצירה יחידה</span>
            <h1>קערת אדמה</h1>
            <button className="artist-byline" type="button">
              נועה ברק · פרדס חנה
            </button>
            <bdi className="product-price">₪340</bdi>
            <p className="product-story">
              קערה שנבנתה ביד מחומר מקומי, עם שכבות דקות של גלזורה מינרלית.
              סימני השריפה משתנים מכלי לכלי והופכים כל אחת ליחידה.
            </p>

            <dl className="product-specs">
              <div>
                <dt>חומרים</dt>
                <dd>קרמיקה, גלזורה מינרלית</dd>
              </div>
              <div>
                <dt>מידות</dt>
                <dd dir="ltr">28 × 12 cm</dd>
              </div>
              <div>
                <dt>אספקה</dt>
                <dd>3–5 ימי עסקים</dd>
              </div>
            </dl>

            <div className="delivery-panel">
              <div>
                <strong>משלוח עד הבית</strong>
                <span>אריזה מוגנת ושליח עם מעקב</span>
              </div>
              <bdi>₪35</bdi>
            </div>

            <button className="button primary product-cta" type="button">
              הוספה לסל · <bdi>₪340</bdi>
            </button>
            <p className="colour-note">הצבעים עשויים להשתנות מעט בין מסכים.</p>
            <div className="policy-links">
              <button type="button">משלוחים והחזרות</button>
              <button type="button">שאלות על היצירה</button>
            </div>
          </div>
        </section>

        <section className="story-block">
          <div>
            <p className="eyebrow">הסיפור של היצירה</p>
            <h2>חומר מקומי,<br />אש פתוחה,<br />כלי אחד.</h2>
          </div>
          <p>
            נועה אוספת חלק מן החומר בשדות שסביב הסטודיו. אחרי סינון וייבוש,
            הקערה נבנית במשך יומיים ונשרפת עם ענפי זית. הכתמים הכהים אינם
            צבע — הם הזיכרון של האש על פני הכלי.
          </p>
        </section>

        <section className="room-section">
          <div className="room-copy">
            <p className="eyebrow">היצירה בחלל</p>
            <h2>להרגיש את קנה המידה.</h2>
            <p>
              ההדמיה מציגה את היצירה ביחס לפריטים מוכרים. המידות המדויקות:
              <span dir="ltr"> 28 × 12 cm</span>.
            </p>
          </div>
          <div className="room-visual">
            <div className="room-art" aria-hidden="true" />
            <div className="room-table" aria-hidden="true" />
            <span>הדמיית חדר בקנה מידה</span>
          </div>
        </section>

        <section className="maker-panel">
          <div className="maker-portrait">
            <span>פורטרט אמן</span>
          </div>
          <div>
            <p className="eyebrow">האמן שמאחורי היצירה</p>
            <h2>נועה ברק</h2>
            <p>
              קרמיקאית ויוצרת בפרדס חנה. נועה חוקרת את המפגש בין כלי שימושי,
              חומר מקומי ושיטות שריפה עתיקות.
            </p>
            <a className="text-link" href="#artist">לכל העבודות של נועה</a>
          </div>
        </section>
      </main>
      <div className="mobile-buy-bar">
        <div><strong>קערת אדמה</strong><bdi>₪340</bdi></div>
        <button className="button primary" type="button">הוספה לסל</button>
      </div>
      <Footer />
    </div>
  );
}

function CorporatePage({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <div className="site-sample">
      <SiteHeader onNavigate={onNavigate} />
      <main className="corporate-page">
        <section className="corporate-hero">
          <div className="corporate-hero-copy">
            <p className="eyebrow light-eyebrow">מתנות לעובדים וללקוחות</p>
            <h1>מתנה ישראלית מקורית.<br />אפס כאב ראש לוגיסטי.</h1>
            <p>
              מארזים אוצרותיים מאמנים עצמאיים, לפי תקציב ובכמות שמתאימה לכם.
              אנחנו מרכזים, אורזים ומספקים — עם חשבונית אחת.
            </p>
            <div className="hero-actions">
              <a className="button light-button" href="#consultation">לקביעת שיחה קצרה</a>
              <a className="button outline-light" href="#packages">לצפייה במארזים</a>
            </div>
          </div>
          <div className="gift-visual" aria-label="מקום לצילום מארז מתנה">
            <div className="gift-box">
              <span className="gift-object one" />
              <span className="gift-object two" />
              <span className="gift-object three" />
            </div>
            <span>מקום לצילום מארז אמיתי</span>
          </div>
        </section>

        <section className="business-benefits">
          {[
            ["01", "יצירה ישראלית אמיתית", "כל פריט מגיע מאמן עצמאי עם שם וסיפור."],
            ["02", "לוגיסטיקה מקצה לקצה", "לכתובת אחת או ישירות לבתי העובדים."],
            ["03", "חשבונית אחת", "אנחנו מרכזים את כל האמנים להזמנה מסודרת אחת."],
          ].map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h2>{title}</h2>
              <p>{copy}</p>
            </article>
          ))}
        </section>

        <section className="packages-section" id="packages">
          <div className="section-heading centered-heading">
            <p className="eyebrow">מארזים לפי תקציב</p>
            <h2>נקודת התחלה ברורה.<br />התאמה מלאה אחר כך.</h2>
            <p>המחירים כוללים מע״מ, אריזה וכרטיס עם סיפור האמנים.</p>
          </div>
          <div className="package-grid">
            {[
              ["₪300", "מחווה מקומית", "כלי קרמיקה קטן · פריט טקסטיל · כרטיס אמן"],
              ["₪450", "בית ישראלי", "קערת הגשה · נר סטודיו · אריזה ממותגת"],
              ["₪550", "מארז הגלריה", "יצירה מרכזית · פריט משלים · הקדשה אישית"],
            ].map(([price, title, copy], index) => (
              <article className={`package-card package-${index + 1}`} key={price}>
                <div className="package-visual">
                  <span className="package-shape" aria-hidden="true" />
                  <small>מקום לצילום המארז</small>
                </div>
                <div className="package-copy">
                  <bdi>{price}</bdi>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <button className="text-link button-link" type="button">לפרטי המארז</button>
                </div>
              </article>
            ))}
          </div>
          <p className="minimum-note">מינימום הזמנה מוצע: 20 מארזים · זמן הכנה: 4–6 שבועות</p>
        </section>

        <section className="process-section">
          <div className="section-heading">
            <p className="eyebrow">איך זה עובד</p>
            <h2>ארבעה צעדים,<br />כתובת אחת לכל דבר.</h2>
          </div>
          <ol className="process-list">
            <li><span>01</span><div><strong>שיחה של 20 דקות</strong><p>תקציב, כמות, מועד והעדפות.</p></div></li>
            <li><span>02</span><div><strong>הצעה ודוגמה פיזית</strong><p>רואים ומרגישים לפני שמחליטים.</p></div></li>
            <li><span>03</span><div><strong>ייצור ואריזה</strong><p>אנחנו מרכזים את העבודה מול האמנים.</p></div></li>
            <li><span>04</span><div><strong>אספקה בזמן</strong><p>מרוכזת או לבית כל עובד ועובדת.</p></div></li>
          </ol>
        </section>

        <section className="consultation" id="consultation">
          <div>
            <p className="eyebrow">בואו נתחיל</p>
            <h2>החג הבא יכול<br />להיראות אחרת.</h2>
            <p>השאירו פרטים ונחזור עם שלוש הצעות שמתאימות לתקציב ולכמות שלכם.</p>
          </div>
          <form className="consultation-form">
            <label className="field">
              <span>שם מלא</span>
              <input type="text" placeholder="השם שלך" />
            </label>
            <label className="field">
              <span>חברה</span>
              <input type="text" placeholder="שם החברה" />
            </label>
            <label className="field">
              <span>מספר עובדים משוער</span>
              <select defaultValue="">
                <option value="" disabled>בחירה</option>
                <option>20–50</option>
                <option>51–150</option>
                <option>151–500</option>
                <option>מעל 500</option>
              </select>
            </label>
            <label className="field">
              <span>דוא״ל</span>
              <input type="email" placeholder="name@company.co.il" dir="ltr" />
            </label>
            <button className="button primary" type="submit">לקבלת הצעה ראשונית</button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("home");

  return (
    <div className="prototype-shell" dir="rtl">
      <header className="review-bar">
        <div className="review-title">
          <span className="review-dot" aria-hidden="true" />
          <div>
            <strong>BOBY · דוגמאות עיצוב ראשוניות</strong>
            <small>כיוון: White Cube × Material Warmth</small>
          </div>
        </div>
        <nav className="review-tabs" aria-label="בחירת מסך לדוגמה">
          {views.map((item) => (
            <button
              type="button"
              key={item.id}
              className={view === item.id ? "active" : ""}
              onClick={() => setView(item.id)}
              aria-pressed={view === item.id}
            >
              <span>{item.number}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="review-note">
        <span>דוגמה אינטראקטיבית</span>
        <p>החליפו בין המסכים למעלה. התמונות הן מצייני מקום מכוונים.</p>
      </div>

      <div className="prototype-canvas">
        {view === "style" && <StyleGuide />}
        {view === "home" && <HomePage onNavigate={setView} />}
        {view === "artwork" && <ArtworkPage onNavigate={setView} />}
        {view === "corporate" && <CorporatePage onNavigate={setView} />}
      </div>
    </div>
  );
}
