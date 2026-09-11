"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Artwork } from "@/lib/catalog/types";

export interface CartItem {
  artwork: Artwork;
  quantity: number;
  addedAt: string;
  expiresAt: string; // 15-min hold TTL simulation matching spike 4
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (artwork: Artwork) => { success: boolean; message?: string };
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalAgorot: number;
  vatAgorot: number;
  estimatedShippingAgorot: number;
  totalAgorot: number;
  notification: string | null;
  clearNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "boby_cart_v1";
const HOLD_DURATION_MINUTES = 15;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          const parsed: CartItem[] = JSON.parse(stored);
          // Filter out expired unique reservations if past 15 min hold
          const now = new Date().getTime();
          const validItems = parsed.filter((item) => {
            if (item.artwork.inventoryKind === "UNIQUE" && item.expiresAt) {
              const expireTime = new Date(item.expiresAt).getTime();
              return expireTime > now;
            }
            return true;
          });
          setItems(validItems);
        }
      }
    } catch {
      // Fallback to empty cart on error
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      }
    } catch {
      // Ignore storage write error
    }
  }, [items, isInitialized]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const clearNotification = () => setNotification(null);

  const addToCart = (artwork: Artwork): { success: boolean; message?: string } => {
    const existingIndex = items.findIndex((i) => i.artwork.slug === artwork.slug);

    if (artwork.inventoryKind === "UNIQUE") {
      if (existingIndex > -1) {
        const msg = "פריט יחיד מסוגו — כבר נמצא בסל הקניות שלך";
        setNotification(msg);
        setIsCartOpen(true);
        return { success: false, message: msg };
      }
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + HOLD_DURATION_MINUTES * 60 * 1000).toISOString();

    if (existingIndex > -1) {
      // Increment quantity for non-unique items
      const updated = [...items];
      const currentItem = updated[existingIndex];
      const maxQty = artwork.inventoryKind === "LIMITED_EDITION" && artwork.editionSize
        ? artwork.editionSize
        : 10;
      
      const newQty = Math.min(currentItem.quantity + 1, maxQty);
      updated[existingIndex] = { ...currentItem, quantity: newQty, expiresAt };
      setItems(updated);
    } else {
      // New item entry
      setItems((prev) => [
        ...prev,
        {
          artwork,
          quantity: 1,
          addedAt: now.toISOString(),
          expiresAt,
        },
      ]);
    }

    setNotification(null);
    setIsCartOpen(true);
    return { success: true };
  };

  const removeFromCart = (slug: string) => {
    setItems((prev) => prev.filter((i) => i.artwork.slug !== slug));
  };

  const updateQuantity = (slug: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(slug);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.artwork.slug === slug) {
          // Enforce quantity = 1 for unique artworks
          if (item.artwork.inventoryKind === "UNIQUE") {
            return { ...item, quantity: 1 };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch {
      // Ignore cleanup error
    }
  };

  // Calculations in Agorot
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalAgorot = items.reduce((acc, item) => acc + item.artwork.priceAgorot * item.quantity, 0);
  
  // Israeli VAT is 18% inclusive (VAT = Subtotal * 0.18 / 1.18)
  const vatAgorot = Math.round(subtotalAgorot * (0.18 / 1.18));
  
  // Shipping estimate: Free shipping above ₪350 (35,000 agorot), otherwise ₪35 (3,500 agorot)
  const estimatedShippingAgorot = subtotalAgorot > 0 ? (subtotalAgorot >= 35000 ? 0 : 3500) : 0;
  const totalAgorot = subtotalAgorot + estimatedShippingAgorot;

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotalAgorot,
        vatAgorot,
        estimatedShippingAgorot,
        totalAgorot,
        notification,
        clearNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
