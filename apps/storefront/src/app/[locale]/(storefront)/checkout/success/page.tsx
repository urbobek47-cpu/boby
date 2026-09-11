"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Price } from "@/components/catalog/price";
import { Button } from "@/components/ui/button";

interface OrderLine {
  artworkId: string;
  artworkTitle: string;
  artistName: string;
  quantity: number;
  priceAgorot: number;
  lineTotalAgorot: number;
  imagePublicId: string;
}

interface OrderData {
  id: string;
  humanReadableNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  buyer: {
    name: string;
    email: string;
    phone: string;
    shippingAddress: {
      street: string;
      city: string;
      apartment?: string;
      postalCode?: string;
      notes?: string;
    };
  };
  gift?: {
    recipientName: string;
    recipientPhone: string;
    giftMessage: string;
  } | null;
  lines: OrderLine[];
  totals: {
    subtotalAgorot: number;
    shippingAgorot: number;
    totalAgorot: number;
    vatAgorot: number;
  };
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("boby_last_order");
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as OrderData;
          if (!queryOrderId || parsed.id === queryOrderId) {
            setOrder(parsed);
          }
        } catch (e) {
          console.error("Failed to parse order session data", e);
        }
      }
    }
    setLoading(false);
  }, [queryOrderId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-[var(--container-content)] px-4 py-16 text-center">
        <p className="text-text-muted">טוען פרטי הזמנה...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[var(--container-content)] px-4 py-10 md:px-10 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* Success Header */}
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sand text-3xl mb-6 shadow-sm">
          ✨
        </div>

        <h1 className="font-heading text-h1 font-bold text-text mb-3">
          תודה על הזמנתך!
        </h1>
        <p className="text-body text-text-muted mb-6 max-w-lg mx-auto leading-relaxed">
          ההזמנה שלך נקלטה בהצלחה במערכת BOBY. היצירות שנבחרו ייארזו בקפידה על ידי האמנים וישלחו ישירות אליך.
        </p>

        {order ? (
          <div className="rounded-panel border border-border bg-sand/40 p-6 md:p-8 text-start mb-8 shadow-xs">
            {/* Order Meta Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4 mb-6">
              <div>
                <span className="text-caption text-text-muted block">מספר הזמנה</span>
                <span className="font-mono text-body font-semibold text-text" dir="ltr">
                  {order.humanReadableNumber}
                </span>
              </div>
              <div>
                <span className="text-caption text-text-muted block">סטטוס תשלום</span>
                <span className="inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-caption font-medium text-accent-strong">
                  {order.paymentStatus === "pending_payment" ? "ממתין לסליקה (הדגמה)" : order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Buyer & Delivery Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border text-small">
              <div>
                <h3 className="font-semibold text-text mb-2">פרטי המזמין/ה</h3>
                <p className="text-text-muted">{order.buyer.name}</p>
                <p className="text-text-muted" dir="ltr">{order.buyer.email}</p>
                <p className="text-text-muted" dir="ltr">{order.buyer.phone}</p>
              </div>

              <div>
                <h3 className="font-semibold text-text mb-2">כתובת למשלוח</h3>
                <p className="text-text-muted">
                  {order.buyer.shippingAddress.street}
                  {order.buyer.shippingAddress.apartment ? `, דירה ${order.buyer.shippingAddress.apartment}` : ""}
                </p>
                <p className="text-text-muted">{order.buyer.shippingAddress.city}</p>
                {order.buyer.shippingAddress.notes && (
                  <p className="text-caption text-text-muted mt-1 italic">
                    הערות: {order.buyer.shippingAddress.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Gift Message (if present) */}
            {order.gift && (
              <div className="py-4 border-b border-border text-small bg-sand/60 -mx-6 md:-mx-8 px-6 md:px-8">
                <h3 className="font-semibold text-text mb-1">🎁 הזמנה כמתנה</h3>
                <p className="text-text-muted">
                  עבור: {order.gift.recipientName} ({order.gift.recipientPhone})
                </p>
                {order.gift.giftMessage && (
                  <p className="text-text font-serif italic mt-2 border-s-2 border-accent ps-3">
                    &ldquo;{order.gift.giftMessage}&rdquo;
                  </p>
                )}
              </div>
            )}

            {/* Items List */}
            <div className="pt-6">
              <h3 className="font-semibold text-text mb-4">יצירות בהזמנה</h3>
              <div className="space-y-3">
                {order.lines.map((line, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 text-small">
                    <div>
                      <span className="font-medium text-text">{line.artworkTitle}</span>
                      <span className="text-text-muted block text-caption">
                        מאת <bdi>{line.artistName}</bdi> (כמות: {line.quantity})
                      </span>
                    </div>
                    <div className="font-semibold text-text">
                      <Price agorot={line.lineTotalAgorot} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals Summary */}
              <div className="mt-6 pt-4 border-t border-border space-y-2 text-small">
                <div className="flex justify-between text-text-muted">
                  <span>סכום ביניים:</span>
                  <Price agorot={order.totals.subtotalAgorot} />
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>דמי משלוח מבוטחים:</span>
                  <Price agorot={order.totals.shippingAgorot} />
                </div>
                <div className="flex justify-between text-caption text-text-muted">
                  <span>מתוך זה מע&quot;מ (18%):</span>
                  <Price agorot={order.totals.vatAgorot} />
                </div>
                <div className="flex justify-between text-body font-bold text-text pt-2 border-t border-border/80">
                  <span>סה&quot;כ כולל מע&quot;מ:</span>
                  <Price agorot={order.totals.totalAgorot} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-panel border border-border bg-sand/40 p-6 mb-8 text-center">
            <p className="text-text-muted mb-2">מספר הזמנה: <span className="font-mono font-semibold text-text" dir="ltr">{queryOrderId || "בטיפול"}</span></p>
            <p className="text-caption text-text-muted">אישור ההזמנה יישלח אליך בדוא&quot;ל ברגע השלמת הסליקה.</p>
          </div>
        )}

        {/* Technical Status note for Phase 2 readiness */}
        <div className="mb-8 p-4 rounded-control bg-deep/5 border border-deep/10 text-caption text-text-muted text-start">
          <p className="font-semibold text-deep mb-1">ℹ️ מידע למפתחים / בעלי האתר (שלב 2):</p>
          <p>
            מבנה הנתונים של ההזמנה נוצר במלואו לפי המפרט ב-BUILD-PLAN.md. בעת חיבור PayPlus, הלקוח יישלח לעמוד התשלום והסליקה תופק אוטומטית ביחד עם חשבונית ירוקה (Green Invoice) לאחר קבלת webhook מאושר.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/works">
            <Button variant="primary" size="md" className="w-full sm:w-auto">
              חזרה לגלריית היצירות
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" size="md" className="w-full sm:w-auto">
              לעמוד הבית
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-[var(--container-content)] px-4 py-16 text-center">
          <p className="text-text-muted">טוען פרטי הזמנה...</p>
        </main>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
