'use client';

import React from 'react';
import { useCart } from '@/context/cartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const { isCartOpen, setCartOpen, cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop ohne Blur, rein minimalistische Abdunkelung */}
      <div 
        className="absolute inset-0 bg-black/20 transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="relative w-screen max-w-md bg-white border-l border-zinc-200 flex flex-col rounded-none shadow-xl">
          <div className="relative z-10 flex flex-col h-full">
            
            {/* Header */}
            <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-normal uppercase tracking-widest text-black">Warenkorb</h2>
                <span className="bg-zinc-100 text-black font-medium text-[10px] px-2 py-0.5 border border-zinc-300 rounded-none">
                  {cartCount}
                </span>
              </div>
              {/* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */}
              <button 
                onClick={() => setCartOpen(false)}
                className="h-8 w-8 rounded-none border border-zinc-200 text-samsung-muted hover:text-black flex items-center justify-center font-normal text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Produktliste */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {cart.length === 0 ? (
                /* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */
                <div className="flex flex-col items-center justify-center h-full text-samsung-muted text-center gap-2">
                  <p className="text-xs font-normal uppercase tracking-widest">Warenkorb leer</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-none border border-zinc-200 bg-white items-center justify-between">
                    <div className="relative h-14 w-14 rounded-none overflow-hidden border border-zinc-200 shrink-0 bg-zinc-50">
                      <Image src={item.image} alt={item.title} fill className="object-cover grayscale" />
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <div>
                        {/* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */}
                        <span className="text-[9px] font-medium text-samsung-muted uppercase tracking-widest block">{item.category}</span>
                        <h4 className="text-xs font-normal text-black truncate uppercase tracking-wider">{item.title}</h4>
                        {/* 🎯 KOSMETIK: text-zinc-500 -> text-samsung-muted */}
                        <p className="text-[10px] text-samsung-muted font-medium mt-0.5">{item.price.toFixed(2)} €</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-5 w-5 rounded-none bg-zinc-50 border border-zinc-200 text-black hover:bg-zinc-100 flex items-center justify-center text-xs transition-colors"
                        >
                          -
                        </button>
                        <span className="text-xs font-medium text-black w-6 text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-5 w-5 rounded-none bg-zinc-50 border border-zinc-200 text-black hover:bg-zinc-100 flex items-center justify-center text-xs transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-300 hover:text-black text-xs font-normal px-2 py-1 transition-colors self-start cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-zinc-200 bg-zinc-50 flex flex-col gap-3">
                <div className="flex items-center justify-between mb-1">
                  {/* 🎯 KOSMETIK: text-zinc-500 -> text-samsung-muted */}
                  <span className="text-xs font-normal text-samsung-muted uppercase tracking-widest">Gesamtsumme:</span>
                  <span className="text-base font-normal text-black tracking-tight">{cartTotal.toFixed(2)} €</span>
                </div>
                
                <Link 
                  href="/checkout" 
                  onClick={() => setCartOpen(false)}
                  className="w-full bg-black text-white font-normal text-xs uppercase tracking-widest py-4 rounded-none hover:bg-zinc-900 transition-colors text-center"
                >
                  Zur Kasse gehen →
                </Link>

                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full bg-white border border-zinc-200 text-zinc-600 font-normal text-xs uppercase tracking-widest py-3 rounded-none hover:bg-zinc-50 hover:text-black transition-colors cursor-pointer"
                >
                  ✕ Schließen
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}