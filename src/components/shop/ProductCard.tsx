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

// 🎯 Interface erweitert, um das optionale priority-Prop zu erlauben
interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

// 🎯 Destructuring angepasst: nimmt jetzt product und priority (Standard: false) entgegen
export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const displayImage = product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';

  return (
    <Link 
      href={`/product/${product.id}`}
      prefetch={false}
      scroll={false} // 🎯 Verhindert das automatische Hochspringen auf der Hauptseite bei asynchronen Bild-Fehlern
      className="group flex flex-col bg-white rounded-none border border-zinc-200 overflow-hidden transition-colors duration-200 max-h-[440px] hover:border-black"
    >
      {/* Bild mit harter Kante */}
      <div className="relative aspect-square w-full bg-zinc-50 overflow-hidden border-b border-zinc-200">
        <Image
          src={displayImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center grayscale hover:grayscale-0 transition-[filter] duration-300"
          priority={priority} // 🎯 Wird jetzt fehlerfrei an die Next.js-Image-Komponente übergeben
        />
        {/* Kategorie-Badge */}
        <span className="absolute top-0 left-0 bg-black text-white text-[9px] font-medium uppercase tracking-widest px-2 py-1 rounded-none z-20">
          {product.category}
        </span>
      </div>

      {/* Inhaltsblock */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2 bg-white">
        <div>
          <h3 className="font-normal text-sm text-black tracking-wide group-hover:text-zinc-600 transition-colors line-clamp-1 uppercase">
            {product.title}
          </h3>
          <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed font-normal">
            {product.description}
          </p>
        </div>

        {/* Preiszeile */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 mt-auto">
          <span className="text-sm font-normal text-black tracking-tight">
            {product.price.toFixed(2)} €
          </span>
          <div className="h-6 w-6 rounded-none bg-zinc-50 border border-zinc-200 text-black flex items-center justify-center font-normal text-xs group-hover:bg-black group-hover:text-white group-hover:border-transparent transition-colors duration-200">
            →
          </div>
        </div>
      </div>
    </Link>
  );
}