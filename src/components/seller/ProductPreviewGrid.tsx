'use client';

import React from 'react';

interface ProductPreviewGridProps {
  products: any[];
  onRemoveItem: (index: number) => void;
}

export default function ProductPreviewGrid({ products, onRemoveItem }: ProductPreviewGridProps) {
  return (
    <div className="border border-black p-6 bg-zinc-50 flex flex-col gap-4 animate-in fade-in duration-200 w-full">
      <div className="border-b border-zinc-200 pb-3 flex justify-between items-center">
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-black font-mono">
          ⚡ [ Live-Parsing Vorschau ]
        </h3>
        <span className="text-[8px] font-mono text-zinc-400 uppercase font-bold tracking-wider">
          Visuelle Qualitätskontrolle vor DB-Eintrag
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((prod, idx) => {
          const mainImage = prod.images && prod.images.length > 0 && prod.images[0].trim() !== ''
            ? prod.images[0] 
            : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';

          return (
            <div 
              key={idx} 
              className="border border-zinc-200 bg-white flex flex-col h-full relative group hover:border-black transition-colors"
            >
              <button
                onClick={() => onRemoveItem(idx)}
                className="absolute top-2 right-2 z-10 bg-white border border-zinc-200 text-black hover:bg-black hover:text-white px-2 py-1 text-[9px] font-mono uppercase tracking-widest cursor-pointer transition-colors"
              >
                ✕ Löschen
              </button>

              <div className="w-full aspect-square bg-zinc-50 border-b border-zinc-100 overflow-hidden relative flex items-center justify-center">
                <img 
                  src={mainImage} 
                  alt={prod.title} 
                  className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-300" 
                />
              </div>

              <div className="p-4 flex flex-col flex-1 gap-1.5">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">{prod.category}</span>
                <h4 className="text-xs uppercase font-bold tracking-wider text-black line-clamp-1">{prod.title}</h4>
                <p className="text-[11px] text-zinc-500 font-sans line-clamp-2 leading-tight flex-1">{prod.description}</p>
                
                <div className="flex justify-between items-baseline mt-2 pt-2 border-t border-zinc-100">
                  <span className="text-[10px] font-mono text-zinc-400">Lager: {prod.stock || 1} Stk.</span>
                  <span className="text-xs font-mono font-bold text-black">{Number(prod.price || 0).toFixed(2)} €</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}