// src/store/cartStore.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

interface CartStoreType {
  cart: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: { id: string; title: string; price: number; images: string[]; category: string }) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  
  // 🔐 HIER SIND DIE NEUEN FUNKTIONEN FÜR DEN LOGIN:
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  // ✨ HIER ERWEITERT: 'admin' hinzugefügt
  user: { firstName: string; role: 'customer' | 'seller' | 'admin' } | null;
  setUser: (user: { firstName: string; role: 'customer' | 'seller' | 'admin' } | null) => void;
}

const CartStoreContext = createContext<CartStoreType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  
  // 🔐 Hier speichern wir, ob das Login-Fenster offen ist und wer eingeloggt ist
  const [authOpen, setAuthOpen] = useState(false);
  
  // ✨ HIER EBENSO ERWEITERT: Dem useState mitgeteilt, dass auch 'admin' erlaubt ist
  const [user, setUser] = useState<{ firstName: string; role: 'customer' | 'seller' | 'admin' } | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('shop4you_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Fehler beim Laden des Warenkorbs", e);
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('shop4you_cart', JSON.stringify(newCart));
  };

  const addToCart = (product: { id: string; title: string; price: number; images: string[]; category: string }) => {
    const existingItem = cart.find((item) => item.id === product.id);
    let updatedCart: CartItem[];
    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
          category: product.category,
          quantity: 1,
        },
      ];
    }
    saveCart(updatedCart);
    setCartOpen(true);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedCart);
  };

  const removeFromCart = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    saveCart(updatedCart);
  };

  const clearCart = () => saveCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const count = cart.reduce((totalCount, item) => totalCount + item.quantity, 0);

  return (
    <CartStoreContext.Provider
      value={{
        cart,
        isCartOpen,
        setCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount: count,
        // 🔐 Diese Werte geben wir nach außen weiter:
        authOpen,
        setAuthOpen,
        user,
        setUser
      }}
    >
      {children}
    </CartStoreContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartStoreContext);
  if (!context) throw new Error('useCart muss innerhalb eines CartProviders verwendet werden');
  return context;
}