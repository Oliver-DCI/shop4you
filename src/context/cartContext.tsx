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

interface ProductInput {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  quantity?: number;
}

export interface User {
  firstName: string;
  lastName: string;
  role: 'customer' | 'seller' | 'admin';
}

interface CartStoreType {
  cart: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: ProductInput) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const CartStoreContext = createContext<CartStoreType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('shop4you_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("[SHOP4YOU CORE] Fehler beim Synchronisieren des Warenkorbs:", e);
      }
    }

    const activeUser = localStorage.getItem('active_user');
    if (activeUser) {
      try {
        const parsedUser = JSON.parse(activeUser);
        
        if (!parsedUser.lastName && parsedUser.firstName.includes(' ')) {
          const parts = parsedUser.firstName.trim().split(/\s+/);
          parsedUser.firstName = parts[0];
          parsedUser.lastName = parts.slice(1).join(' ');
        }

        setUser(parsedUser);
      } catch (e) {
        console.error("[SHOP4YOU AUTH] Session-Wiederherstellung fehlgeschlagen:", e);
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('shop4you_cart', JSON.stringify(newCart));
  };

  const addToCart = (product: ProductInput) => {
    const qtyToAdd = product.quantity || 1;
    const existingItem = cart.find((item) => item.id === product.id);
    
    let updatedCart: CartItem[];
    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + qtyToAdd } : item
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
          quantity: qtyToAdd,
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

  const logout = () => {
    localStorage.removeItem('active_user');
    setUser(null);
  };

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
        authOpen,
        setAuthOpen,
        user,
        setUser,
        logout
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