// src/components/shop/ProductCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  const displayImage = product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';

  return (
    <Link 
      href={`/product/${product.id}`}
      className="group flex flex-col bg-white/90 backdrop-blur-md rounded-2xl border border-zinc-200/60 overflow-hidden transition-all duration-300 max-h-[440px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-blue-500/30 hover:shadow-[0_16px_32px_rgba(37,99,235,0.08)] hover:-translate-y-1"
    >
      {/* Bild-Bereich: Quadratisch (aspect-square) – skaliert jetzt perfekt in der 4er-Reihe */}
      <div className="relative aspect-square w-full bg-zinc-50 overflow-hidden border-b border-zinc-100">
        <Image
          src={displayImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-103"
        />
        {/* Kategorie-Badge */}
        <span className="absolute top-3 left-3 bg-white/95 text-blue-600 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border border-zinc-200/60 shadow-2xs z-20">
          {product.category}
        </span>
      </div>

      {/* Content-Bereich: Genug Platz für Text und Preis */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2 bg-white">
        <div>
          <h3 className="font-black text-sm text-zinc-950 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1 uppercase">
            {product.title}
          </h3>
          <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed font-medium">
            {product.description}
          </p>
        </div>

        {/* Preis- & Aktionszeile */}
        <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 mt-auto">
          <div className="flex flex-col">
            <span className="text-sm font-black text-zinc-950 group-hover:text-blue-600 transition-colors">
              {product.price.toFixed(2)} €
            </span>
          </div>
          {/* Diskreter Aktionspfeil */}
          <div className="h-6 w-6 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-200 flex items-center justify-center font-bold text-xs">
            ➔
          </div>
        </div>
      </div>
    </Link>
  );
}