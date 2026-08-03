# BOBY — נקודת המשך וחפיפה (Handover Notes)

**תאריך ושעה**: 3 באוגוסט 2026, 16:40
**מאגר GitHub**: `https://github.com/urbobek47-cpu/boby.git` (ענף `main`)

---

## 📌 סטטוס נוכחי (מה הושלם 100%)

1. **חיבור מלא ל-GitHub**:
   - המאגר המקומי אותחל, חוברו כל הקבצים ובוצע `push` מלא לענף `main`.
   - הוגדר מפתח SSH במחשב וחוברו הרשאות Access Token במידת הצורך.

2. **הגדרה ופריסה ב-Vercel**:
   - הוגדרה תמיכה מלאה ב-Monorepo (תיקיית `apps/storefront`).
   - נוספו קבצי `vercel.json` ו-`package.json` ראשיים המריצים `npm install && npm run build` מתוך תיקיית האפליקציה.
   - האתר עלה בהצלחה ב-Vercel.

3. **סביבת פיתוח מקומית (Local Dev)**:
   - התקנת תלויות הושלמה בהצלחה (`npm install`).
   - שרת פיתוח נבדק ב-Node 20 ופועל בכתובת `http://localhost:3000`.

---

## 🚀 השלב הבא בדיוק (Phase 2 — Commerce)

כשנמשיך, המשימה הבאה לפי תוכנית העבודה (`BUILD-PLAN.md` §5):

1. **בניית עגלת הקניות (Cart UI & State)**:
   - יצירת רכיב Cart Drawer/Modal ב-`apps/storefront/src/components/cart/`.
   - ניהול Local State / Context לשמירת הפריטים בסל.

2. **מנגנון שריון פריטים יחידים (qty=1 Reservation)**:
   - הטמעת לוגיקת הנעילה האטומית של פריטים מסוג `UNIQUE` עם TTL של 15 דקות (לפי Proof-of-Concept ב-`spikes/spike-4-reservation-race/`).

3. **אינטגרציית תשלומים וחשבוניות**:
   - חיבור סליקה ב-PayPlus (Spike 1).
   - חיבור הפקת חשבוניות מס / מספרי הקצאה ב-Green Invoice (Spike 2).

---

## 💡 איך להמשיך בפעם הבאה?

כשפותחים את הצ'אט / המחשב מחדש, פשוט אמור לי או לסוכן:
> **"תקרא את נקודת ההמשך ב-docs/handover-notes.md ונמשיך ב-Phase 2 לבניית עגלת הקניות"**
