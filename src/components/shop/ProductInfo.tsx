'use client';

import React from 'react';
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

  return (
    <div className="flex flex-col justify-between h-full py-2 rounded-none text-black selection:bg-black selection:text-white">
      
      {/* Oberer Block: Meta & Content */}
      <div className="flex flex-col gap-4">
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

      {/* Unterer Block: Preis, Status & Action */}
      <div className="mt-8 pt-8 border-t border-zinc-200 flex flex-col gap-6">
        
        {/* Preisanzeige: Reduziert auf eine feine Box ohne Farbverläufe */}
        <div className="bg-zinc-50 p-6 rounded-none border border-zinc-200 flex items-baseline justify-between">
          <span className="text-[11px] font-normal text-zinc-400 uppercase tracking-widest">Unverbindliche Preisempfehlung:</span>
          <span className="text-3xl font-normal text-black tracking-tight">
            {product.price.toFixed(2)} €
          </span>
        </div>

        {/* Status-Indikator: Clean mit einer quadratischen Statusbox */}
        <div className="flex items-center gap-3 bg-white border border-zinc-200 px-4 py-3 rounded-none">
          <span className="h-2 w-2 bg-black shrink-0" />
          <span className="text-xs font-normal text-zinc-600 uppercase tracking-wider">
            Sofort lieferbar — Online bestellen & blitzschnell erhalten
          </span>
        </div>

        {/* Der massive, schwarze Kauf-Button mit harten Kanten */}
        <button 
          onClick={() => addToCart(product)}
          className="w-full h-14 rounded-none bg-black text-white font-medium hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2 tracking-widest text-xs uppercase cursor-pointer"
        >
          <span>🛒</span> In den Warenkorb legen
        </button>
      </div>

    </div>
  );
}