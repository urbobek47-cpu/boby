"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { useCart } from "./cart-context";
import { Price } from "@/components/catalog/price";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    itemCount,
    subtotalAgorot,
    vatAgorot,
    estimatedShippingAgorot,
    totalAgorot,
    notification,
    clearNotification,
  } = useCart();

  const locale = useLocale() as Locale;
  const t = useTranslations("Cart");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (!isCartOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeCart();
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen || !mounted) return null;

  const drawerContent = (
    <>
      {/* Full Overlay Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Fixed, full-height sliding cart drawer */}
      <div
        className="fixed top-0 bottom-0 end-0 z-[9999] h-screen h-dvh w-[420px] max-w-[90vw] flex flex-col bg-surface shadow-[4px_0_24px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out animate-in slide-in-from-end border-s border-border"
        role="dialog"
        aria-modal="true"
        aria-label="סל הקניות שלך"
      >
        {/* Header: pinned at top */}
        <div className="flex items-center justify-between border-b border-border p-5 shrink-0 bg-surface">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">🛒</span>
            <div>
              <h2 className="text-h3 font-medium text-text">סל הקניות שלך</h2>
              <p className="text-caption text-text-muted">
                {itemCount === 0 ? "הסל ריק כרגע" : `${itemCount} פריטים בסל`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="סגירת סל הקניות"
            className="rounded-control p-2 text-text-muted transition-colors hover:bg-sand hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Notification Banner (e.g. Unique item protection notice) */}
        {notification && (
          <div className="bg-sand border-b border-stone/30 px-5 py-3 flex items-center justify-between gap-3 text-small text-accent-strong shrink-0 animate-in fade-in">
            <span className="flex items-center gap-2 font-medium">
              <span>⚠️</span>
              <span>{notification}</span>
            </span>
            <button
              type="button"
              onClick={clearNotification}
              className="text-caption text-text-muted hover:text-text shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* Body: vertical scroll list of cart items */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-text-muted my-auto">
              <span className="text-4xl">🎨</span>
              <p className="text-body font-medium text-text">סל הקניות שלך ריק</p>
              <p className="text-small text-text-muted max-w-xs">
                מוזמנים להתרשם מיצירות האמנות המקוריות בעבודת יד בגלריה שלנו.
              </p>
              <Button
                variant="secondary"
                onClick={closeCart}
                className="mt-2 text-small"
              >
                חזרה לגלריה
              </Button>
            </div>
          ) : (
            items.map((item) => {
              const { artwork, quantity } = item;
              const isUnique = artwork.inventoryKind === "UNIQUE";
              const primaryImage = artwork.images[0]?.publicId || "/mock/earth-bowl.jpg";

              return (
                <div
                  key={artwork.slug}
                  className="flex gap-3.5 rounded-panel border border-border/80 bg-sand/30 p-3.5 transition-all hover:border-border shrink-0 relative group"
                >
                  {/* Item Image Thumbnail */}
                  <Link
                    href={`/works/${artwork.slug}`}
                    onClick={closeCart}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-card bg-sand/60 border border-stone/20"
                  >
                    <img
                      src={primaryImage}
                      alt={artwork.title[locale]}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </Link>

                  {/* Item Details */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/works/${artwork.slug}`}
                          onClick={closeCart}
                          className="text-small font-medium text-text hover:text-accent-strong truncate block"
                        >
                          {artwork.title[locale]}
                        </Link>
                        <p className="text-caption text-text-muted truncate">
                          מאת <bdi className="font-medium text-text">{artwork.artist.displayName[locale]}</bdi>
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(artwork.slug)}
                        aria-label={`הסר ${artwork.title[locale]} מהסל`}
                        className="text-caption text-text-muted hover:text-error transition-colors p-1 shrink-0"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2">
                      {/* Quantity Controls / Unique Badge */}
                      {isUnique ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-accent-strong bg-sand px-2 py-0.5 rounded-full border border-stone/30 shrink-0">
                          🔒 פריט יחיד מסוגו (כמות: 1)
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5 rounded-control border border-stone/40 bg-surface px-2 py-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(artwork.slug, quantity - 1)}
                            className="text-small font-bold text-text-muted hover:text-text px-1"
                          >
                            -
                          </button>
                          <span className="text-caption font-semibold px-1">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(artwork.slug, quantity + 1)}
                            className="text-small font-bold text-text-muted hover:text-text px-1"
                          >
                            +
                          </button>
                        </div>
                      )}

                      {/* Unit / Total Price */}
                      <Price
                        agorot={artwork.priceAgorot * quantity}
                        className="text-small font-semibold text-text shrink-0"
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Pinned at bottom with subtotal, VAT breakdown, shipping estimate and Checkout CTA */}
        {items.length > 0 && (
          <div className="border-t border-border p-5 shrink-0 bg-surface flex flex-col gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col gap-1.5 text-small">
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
              <div className="flex justify-between items-baseline border-t border-border/80 pt-2 text-body font-bold text-text">
                <span>סה״כ לתשלום:</span>
                <Price agorot={totalAgorot} className="text-h3 font-bold text-text" />
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full"
            >
              <Button
                variant="primary"
                className="w-full py-3.5 text-body font-semibold shadow-md flex items-center justify-center gap-2"
              >
                <span>המשך לתשלום וקופה</span>
                <span>←</span>
              </Button>
            </Link>

            <p className="text-caption text-text-muted text-center">
              🔒 רכישה מאובטחת · משלוח ישיר מהאמן/ית בכל הארץ
            </p>
          </div>
        )}
      </div>
    </>
  );

  return createPortal(drawerContent, document.body);
}
