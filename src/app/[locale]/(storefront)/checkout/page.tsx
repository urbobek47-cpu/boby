"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/components/cart/cart-context";
import { useAuth } from "@/components/auth/auth-context";
import { Price } from "@/components/catalog/price";
import { Button } from "@/components/ui/button";
import { createOrderAtomic } from "@/lib/orders/reservation-engine";

export default function CheckoutPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const { user } = useAuth();
  const {
    cartId,
    items,
    subtotalAgorot,
    vatAgorot,
    estimatedShippingAgorot,
    totalAgorot,
    clearCart,
  } = useCart();

  // Form State
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [apartment, setApartment] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  // Gift Option State
  const [isGift, setIsGift] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync user details if user logs in on checkout page
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name);
      if (!email) setEmail(user.email);
    }
  }, [user, fullName, email]);

  // Handle Order Submit / Creation
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !street.trim() || !city.trim()) {
      setFormError("אנא המלאו את כל שדות החובה המסומנים בכוכבית (*)");
      return;
    }

    if (items.length === 0) {
      setFormError("סל הקניות שלך ריק. אנא הוסיפו יצירות לפני המעבר לקופה.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = createOrderAtomic({
        cartId: cartId || "guest_cart",
        buyer: {
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          shippingAddress: {
            street: street.trim(),
            city: city.trim(),
            apartment: apartment.trim(),
            postalCode: postalCode.trim(),
            notes: notes.trim(),
          },
        },
        gift: isGift
          ? {
              recipientName: recipientName.trim(),
              recipientPhone: recipientPhone.trim(),
              giftMessage: giftMessage.trim(),
            }
          : null,
        lines: items.map((item) => ({
          artworkId: item.artwork.slug,
          artworkTitle: item.artwork.title[locale] || item.artwork.title.he,
          artistId: item.artwork.artist.slug,
          artistName: item.artwork.artist.displayName[locale] || item.artwork.artist.displayName.he,
          artistLocation: item.artwork.artist.location[locale] || item.artwork.artist.location.he,
          quantity: item.quantity,
          inventoryKind: item.artwork.inventoryKind,
          priceAgorot: item.artwork.priceAgorot,
          lineTotalAgorot: item.artwork.priceAgorot * item.quantity,
          imagePublicId: item.artwork.images[0]?.publicId || "/mock/earth-bowl.jpg",
        })),
        totals: {
          subtotalAgorot,
          shippingAgorot: estimatedShippingAgorot,
          totalAgorot,
          vatAgorot,
        },
      });

      if (!result.success || !result.order) {
        setFormError(result.reason || "אירעה שגיאה ביצירת ההזמנה. אנא נסו שוב.");
        setIsSubmitting(false);
        return;
      }

      const orderData = result.order;

      // Store generated order in sessionStorage for Order Confirmation page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("boby_last_order", JSON.stringify(orderData));
      }

      // Clear the cart
      clearCart();

      // Redirect to Order Success Confirmation page
      router.push(`/checkout/success?orderId=${orderData.id}`);
    } catch {
      setFormError("אירעה שגיאה ביצירת ההזמנה. אנא נסו שוב.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isSubmitting) {
    return (
      <main className="mx-auto max-w-[var(--container-content)] px-4 py-12 md:py-20 text-center">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-panel bg-sand/60 p-8 border border-border">
          <span className="text-4xl">🎨</span>
          <h1 className="text-h2 font-medium text-text">סל הקניות שלך ריק</h1>
          <p className="text-text-muted text-small">
            לא ניתן להשלים הזמנה ללא יצירות בסל. מוזמנים לחזור לגלריה ולבחור פריטים מקוריים בעבודת יד.
          </p>
          <Link href="/works">
            <Button variant="primary" className="mt-2">
              לגלריית היצירות ←
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[var(--container-content)] px-4 py-6 md:px-10 md:py-12">
      {/* Header Breadcrumb & Title */}
      <div className="mb-8 border-b border-border pb-5">
        <div className="flex items-center gap-2 text-caption text-text-muted mb-2">
          <Link href="/" className="hover:text-accent-strong">דף הבית</Link>
          <span>·</span>
          <span className="text-text">קופה והשלמת הזמנה</span>
        </div>
        <h1 className="text-[length:var(--text-h1)] font-medium text-text md:text-[2.25rem]">
          השלמת הזמנה וקופה
        </h1>
        <p className="text-small text-text-muted mt-1">
          אנא מלאו את הפרטים למשלוח ישיר מהאמנים/יות. תשלום בטוח וחשבונית מס.
        </p>
      </div>

      {formError && (
        <div className="mb-6 rounded-card bg-error/10 border border-error/30 p-4 text-small text-error font-medium flex items-center gap-2">
          <span>⚠️</span>
          <span>{formError}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Buyer & Delivery Form (8 cols) */}
        <div className="flex flex-col gap-6 lg:col-span-7 xl:col-span-8">
          {/* Section 1: Buyer Details */}
          <section className="rounded-panel border border-border bg-surface p-5 sm:p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-strong text-surface text-caption font-bold">1</span>
              <h2 className="text-h3 font-medium text-text">פרטי מזמין/ת</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label htmlFor="fullName" className="text-caption font-semibold text-text">
                  שם מלא <span className="text-error">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ישראל ישראלי"
                  className="rounded-control border border-stone/40 bg-surface px-3.5 py-2.5 text-small text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-caption font-semibold text-text">
                  כתובת דוא״ל (לקבלת אישור וחשבונית) <span className="text-error">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  dir="ltr"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@example.com"
                  className="rounded-control border border-stone/40 bg-surface px-3.5 py-2.5 text-small text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-caption font-semibold text-text">
                  טלפון ליצירת קשר <span className="text-error">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  dir="ltr"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="050-1234567"
                  className="rounded-control border border-stone/40 bg-surface px-3.5 py-2.5 text-small text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Delivery Address */}
          <section className="rounded-panel border border-border bg-surface p-5 sm:p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-strong text-surface text-caption font-bold">2</span>
              <h2 className="text-h3 font-medium text-text">כתובת למשלוח מבוטח עד הבית</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="city" className="text-caption font-semibold text-text">
                  עיר / יישוב <span className="text-error">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="תל אביב-יפו / ירושלים / פרדס חנה"
                  className="rounded-control border border-stone/40 bg-surface px-3.5 py-2.5 text-small text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="street" className="text-caption font-semibold text-text">
                  רחוב ומספר בית <span className="text-error">*</span>
                </label>
                <input
                  id="street"
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="הרצל 12"
                  className="rounded-control border border-stone/40 bg-surface px-3.5 py-2.5 text-small text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="apartment" className="text-caption font-semibold text-text">
                  דירה / כניסה / קומה (אופציונלי)
                </label>
                <input
                  id="apartment"
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="דירה 4, כניסה ב', קומה 2"
                  className="rounded-control border border-stone/40 bg-surface px-3.5 py-2.5 text-small text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="postalCode" className="text-caption font-semibold text-text">
                  מיקוד (אופציונלי)
                </label>
                <input
                  id="postalCode"
                  type="text"
                  dir="ltr"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="6100000"
                  className="rounded-control border border-stone/40 bg-surface px-3.5 py-2.5 text-small text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label htmlFor="notes" className="text-caption font-semibold text-text">
                  הערות והוראות מיוחדות לשליח
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="למשל: להניח ליד השער, להתקשר חצי שעה לפני הגעה..."
                  className="rounded-control border border-stone/40 bg-surface px-3.5 py-2.5 text-small text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong resize-none"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Gift Option */}
          <section className="rounded-panel border border-border bg-surface p-5 sm:p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-strong text-surface text-caption font-bold">3</span>
                <h2 className="text-h3 font-medium text-text">משלוח כמתנה 🎁</h2>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                  className="h-4 w-4 rounded border-stone/40 text-accent-strong focus:ring-accent-strong"
                />
                <span className="text-small font-medium text-text">זוהי מתנה</span>
              </label>
            </div>

            {isGift ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 animate-in fade-in">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="recipientName" className="text-caption font-semibold text-text">
                    שם מקבל/ת המתנה
                  </label>
                  <input
                    id="recipientName"
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="שם המקבל/ת"
                    className="rounded-control border border-stone/40 bg-surface px-3.5 py-2.5 text-small text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="recipientPhone" className="text-caption font-semibold text-text">
                    טלפון המקבל/ת (לתתיאום משלוח)
                  </label>
                  <input
                    id="recipientPhone"
                    type="tel"
                    dir="ltr"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="054-9876543"
                    className="rounded-control border border-stone/40 bg-surface px-3.5 py-2.5 text-small text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label htmlFor="giftMessage" className="text-caption font-semibold text-text">
                    ברכה אישית (תצורף לאריזת המתנה)
                  </label>
                  <textarea
                    id="giftMessage"
                    rows={3}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="כתבו כאן את הברכה שלכם..."
                    className="rounded-control border border-stone/40 bg-surface px-3.5 py-2.5 text-small text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong resize-none"
                  />
                </div>
              </div>
            ) : (
              <p className="text-caption text-text-muted">
                מסמנים V במידה וההזמנה מיועדת כמתנה ישירות לכתובת מקבל/ת אחר/ת.
              </p>
            )}
          </section>
        </div>

        {/* Right Column: Order Summary (4 cols) */}
        <div className="flex flex-col gap-6 lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
          <section className="rounded-panel border border-border bg-surface p-5 sm:p-6 shadow-[var(--shadow-soft)] flex flex-col gap-4">
            <h2 className="text-h3 font-medium text-text border-b border-border pb-3">
              סיכום הזמנה ({items.length} פריטים)
            </h2>

            {/* Itemized List */}
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pe-1 divide-y divide-border/60">
              {items.map((item) => (
                <div key={item.artwork.slug} className="flex items-center gap-3 pt-3 first:pt-0">
                  <img
                    src={item.artwork.images[0]?.publicId || "/mock/earth-bowl.jpg"}
                    alt={item.artwork.title[locale]}
                    className="h-14 w-14 rounded-card object-cover border border-stone/30 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-small font-medium text-text truncate">
                      {item.artwork.title[locale]}
                    </p>
                    <p className="text-caption text-text-muted truncate">
                      מאת <bdi>{item.artwork.artist.displayName[locale]}</bdi>
                    </p>
                    <div className="flex items-center justify-between text-caption text-text-muted mt-0.5">
                      <span>כמות: {item.quantity}</span>
                      <Price agorot={item.artwork.priceAgorot * item.quantity} className="font-semibold text-text" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="flex flex-col gap-2 border-t border-border pt-4 text-small">
              <div className="flex justify-between text-text-muted">
                <span>סכום ביניים (כולל מע״מ):</span>
                <Price agorot={subtotalAgorot} className="font-medium text-text" />
              </div>
              <div className="flex justify-between text-caption text-text-muted/80">
                <span>מתוכו מע״מ (18%):</span>
                <Price agorot={vatAgorot} className="text-caption text-text-muted" />
              </div>
              <div className="flex justify-between text-text-muted">
                <span>משלוח מבוטח עד הבית:</span>
                <span>
                  {estimatedShippingAgorot === 0 ? (
                    <strong className="text-success">חינם</strong>
                  ) : (
                    <Price agorot={estimatedShippingAgorot} className="font-medium text-text" />
                  )}
                </span>
              </div>
              <div className="flex justify-between items-baseline border-t border-border pt-3 text-body font-bold text-text">
                <span>סה״כ לתשלום:</span>
                <Price agorot={totalAgorot} className="text-h2 font-bold text-text" />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full py-3.5 text-body font-semibold shadow-md mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>יוצר הזמנה במערכת...</span>
              ) : (
                <>
                  <span>אישור הזמנה (הדמיית קופה)</span>
                  <span>←</span>
                </>
              )}
            </Button>

            <div className="rounded-card bg-sand/60 p-3 text-caption text-text-muted text-center border border-stone/30">
              🔒 <strong>הערה:</strong> זוהי תשתית הקופה הפיננסית של BOBY. בשלב הבא תחובר סליקת PayPlus וחשבוניות Green Invoice.
            </div>
          </section>
        </div>
      </form>
    </main>
  );
}
