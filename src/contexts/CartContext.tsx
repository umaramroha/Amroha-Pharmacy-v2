"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const MAX_QTY_PER_PRODUCT = 10;

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("a2z-cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Cap quantities at max per product
        const cleaned = parsed.map((item: CartItem) => ({
          ...item,
          quantity: Math.min(MAX_QTY_PER_PRODUCT, item.quantity),
        }));
        setItems(cleaned);
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("a2z-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        // Cap at MAX_QTY_PER_PRODUCT
        const newQty = Math.min(
          MAX_QTY_PER_PRODUCT,
          existing.quantity + item.quantity
        );
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: newQty } : i
        );
      }
      // New item — cap at MAX_QTY_PER_PRODUCT
      return [
        ...prev,
        { ...item, quantity: Math.min(MAX_QTY_PER_PRODUCT, item.quantity) },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    // Cap at MAX_QTY_PER_PRODUCT
    const capped = Math.min(MAX_QTY_PER_PRODUCT, quantity);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: capped } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
