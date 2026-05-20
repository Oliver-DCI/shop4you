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
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    // Wir nehmen h-full raus oder setzen es auf self-stretch, damit es sich an die Bildhöhe anpasst
    <div className="flex flex-col h-full py-0 rounded-none text-black selection:bg-black selection:text-white">
      
      {/* 1. Trust-Bar: Jetzt bündig mit dem Start der Bild-Galerie */}
      <div className="bg-black text-white py-2 px-4 mb-6 flex justify-between items-center text-[9px] uppercase tracking-[0.2em] font-mono">
        <span>PREMIUM SELECTION</span>
        <span>VERSAND DURCH SHOP4YOU</span>
      </div>

      {/* Oberer Block */}
      <div className="flex flex-col gap-4 flex-grow">
        <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-none self-start">
          {product.category}
        </span>
        
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-black uppercase">
          {product.title}
        </h1>
        
        <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-normal mt-2">
          {product.description}
        </p>
      </div>

      {/* Unterer Block */}
      <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-col gap-4">
        
        {/* Preis-Div: p-6 auf p-4 reduziert für schlankeren Look */}
        <div className="bg-zinc-50 p-4 rounded-none border border-zinc-200 flex items-center justify-between">
          <span className="text-[10px] font-normal text-zinc-400 uppercase tracking-widest">Preis</span>
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