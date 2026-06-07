'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/cartContext';

interface ProductInfoProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    brand: string | null;
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const isFreeShipping = product.price >= 500;

  return (
    <div className="flex flex-col h-full rounded-none text-black selection:bg-black selection:text-white">
      
      {/* OBERER BLOCK: Textinhalt */}
      <div>
        {/* 1. Trust-Bar */}
        <div className="bg-black text-white py-2 px-4 mb-6 flex justify-between items-center text-[9px] uppercase tracking-[0.2em] font-mono">
          <span>PREMIUM SELECTION</span>
          <span>VERSAND DURCH SHOP4YOU</span>
        </div>

        <div className="flex flex-col gap-1">
          {/* Kategorie-Badge */}
          {/* 🎯 KOSMETIK: text-zinc-500 -> text-samsung-muted */}
          <span className="text-[10px] font-medium uppercase tracking-widest text-samsung-muted bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-none self-start mb-5">
            {product.category}
          </span>
          
          {/* Der Hersteller */}
          {/* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */}
          <span className="text-xs font-mono tracking-widest text-samsung-muted uppercase">
            {product.brand || 'Premium Brand'}
          </span>
        </div>
        
        {/* Titel */}
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-black uppercase">
          {product.title}
        </h1>
        
        {/* Beschreibung */}
        {/* 🎯 KOSMETIK: text-zinc-500 -> text-samsung-muted */}
        <p className="text-xs sm:text-sm text-samsung-muted leading-relaxed font-normal mt-2">
          {product.description}
        </p>
      </div>

      {/* UNTERER BLOCK */}
      <div className="mt-auto flex flex-col">
        
        {/* Die zwei Fulfillment-Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          
          {/* Container 1: Lieferung nach Hause */}
          <div className="border border-zinc-200 p-4 flex flex-col justify-between rounded-none bg-white">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-none bg-black"></span>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-black">01 // Lieferung</h4>
              </div>
              <p className="text-xs font-normal text-zinc-950">Lieferzeit: ca. 2-4 Werktage</p>
              {/* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */}
              <p className="text-[11px] text-samsung-muted mt-0.5 leading-tight">Standard-Kurierdienst (DHL/UPS)</p>
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider mt-4 pt-2 border-t border-zinc-100">
              {isFreeShipping ? (
                <span className="text-black bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 font-bold">Gratis Versand</span>
              ) : (
                /* 🎯 KOSMETIK: text-zinc-500 -> text-samsung-muted */
                <span className="text-samsung-muted">Zzgl. 6,90 € Versand</span>
              )}
            </div>
          </div>

          {/* Container 2: Abholung im Studio / Markt */}
          <div className="border border-zinc-200 p-4 flex flex-col justify-between rounded-none bg-zinc-50/50">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-none bg-black"></span>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-black">02 // Abholung</h4>
              </div>
              <p className="text-xs font-bold text-zinc-950">Sofort verfügbar</p>
              {/* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */}
              <p className="text-[11px] text-samsung-muted mt-0.5 leading-tight">Im Studio Offenbach hinterlegt</p>
            </div>
            {/* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */}
            <div className="text-[10px] font-mono uppercase tracking-wider text-samsung-muted mt-4 pt-2 border-t border-zinc-100">
              3 Tage Reserviert • Kostenlos
            </div>
          </div>

        </div>
        
        {/* Preis-Div */}
        <div className="bg-zinc-50 py-4 px-4 rounded-none border border-zinc-200 flex items-center justify-between mb-3">
          {/* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */}
          <span className="text-[10px] font-normal text-samsung-muted uppercase tracking-widest">Preis</span>
          <span className="text-xl font-bold text-black tracking-tight">
            {product.price.toFixed(2)} €
          </span>
        </div>

        {/* Mengen-Input & Kauf-Button */}
        <div className="flex gap-2">
          <input 
            type="number" 
            min="1" 
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 h-12 border border-zinc-200 text-center font-medium focus:outline-none focus:border-black transition-colors"
          />
          <button 
            onClick={() => addToCart({ ...product, quantity })}
            className="flex-1 h-12 rounded-none bg-black text-white font-medium hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2 tracking-widest text-xs uppercase cursor-pointer"
          >
            In den Warenkorb
          </button>
        </div>
      </div>

    </div>
  );
}