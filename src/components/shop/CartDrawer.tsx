// src/components/shop/CartDrawer.tsx
'use client';

import React from 'react';
import { useCart } from '@/store/cartStore';
import Image from 'next/image';

export default function CartDrawer() {
  const { isCartOpen, setCartOpen, cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart(); // ✨ updateQuantity hinzugefügt

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-zinc-200 flex flex-col shadow-2xl animate-fade-in">
          
          {/* Header */}
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black uppercase tracking-tight text-zinc-950">Warenkorb</h2>
              <span className="bg-blue-50 text-blue-600 font-bold text-xs px-2 py-0.5 rounded-md border border-blue-100">
                {cartCount}
              </span>
            </div>
            <button 
              onClick={() => setCartOpen(false)}
              className="h-8 w-8 rounded-lg border border-zinc-200 text-zinc-400 hover:text-zinc-950 flex items-center justify-center font-bold text-sm transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Produktliste */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-400 text-center gap-2">
                <span className="text-3xl">🛒</span>
                <p className="text-xs font-medium uppercase tracking-wider">Dein Warenkorb ist leer</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-zinc-100 bg-zinc-50/50 items-center justify-between">
                  {/* Bild */}
                  <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-zinc-200 shrink-0 bg-white">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  
                  {/* Content & Mengenregler */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <div>
                      <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest block">{item.category}</span>
                      <h4 className="text-xs font-black text-zinc-950 truncate uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[10px] text-zinc-400 font-bold mt-0.5">{(item.price * item.quantity).toFixed(2)} €</p>
                    </div>

                    {/* ✨ NEU: Kompakter + / - Mengenwähler */}
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-5 w-5 rounded bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 active:bg-zinc-100 flex items-center justify-center text-xs font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="text-[11px] font-black text-zinc-950 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-5 w-5 rounded bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 active:bg-zinc-100 flex items-center justify-center text-xs font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Löschen Mülleimer */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-zinc-300 hover:text-red-500 text-[11px] font-bold px-2 py-1 transition-colors self-start"
                    title="Artikel entfernen"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Gesamtsumme:</span>
                <span className="text-lg font-black text-zinc-950">{cartTotal.toFixed(2)} €</span>
              </div>
              <button className="w-full bg-blue-600 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-xs flex items-center justify-center gap-2">
                Zur Kasse gehen ➔
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}