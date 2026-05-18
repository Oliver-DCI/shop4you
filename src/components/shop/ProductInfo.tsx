// src/components/shop/ProductInfo.tsx
'use client';

import React from 'react';
import { useCart } from '@/store/cartStore'; // ✨ Neu importiert

interface ProductInfoProps {
  product: {
    id: string;       // ✨ ID hinzugefügt
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[]; // ✨ Images hinzugefügt
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart } = useCart(); // ✨ Holt die globale Hinzufügen-Funktion aus dem Store

  return (
    <div className="flex flex-col justify-between h-full py-2">
      
      {/* Oberer Block: Meta & Content */}
      <div className="flex flex-col gap-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md self-start shadow-xs">
          {product.category}
        </span>
        
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 uppercase">
          {product.title}
        </h1>
        
        <p className="text-sm text-zinc-600 leading-relaxed font-medium mt-2">
          {product.description}
        </p>
      </div>

      {/* Unterer Block: Preis, Status & Action (Klassische toom-Struktur in Modern) */}
      <div className="mt-8 pt-8 border-t border-zinc-200/80 flex flex-col gap-6">
        
        {/* Preisanzeige */}
        <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/30 p-6 rounded-2xl border border-blue-100 flex items-baseline justify-between">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Unverbindliche Preisempfehlung:</span>
          <span className="text-3xl font-black text-zinc-950 tracking-tight">
            {product.price.toFixed(2)} €
          </span>
        </div>

        {/* Status-Indikator */}
        <div className="flex items-center gap-2.5 bg-white border border-zinc-200 px-4 py-3 rounded-xl shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-zinc-700">
            Sofort lieferbar – Online bestellen & blitzschnell erhalten
          </span>
        </div>

        {/* Der massive, eisblaue Warenkorb-Button */}
        <button 
          onClick={() => addToCart(product)} // ✨ Triggert die Warenkorb-Öffnung und fügt das Item hinzu
          className="w-full h-12 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-600/10 tracking-wider text-sm uppercase"
        >
          <span>🛒</span> IN DEN WARENKORB LEGEN
        </button>
      </div>

    </div>
  );
}