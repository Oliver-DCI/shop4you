// src/components/shop/ProductImages.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductImagesProps {
  images: string[];
  title: string;
}

export default function ProductImages({ images, title }: ProductImagesProps) {
  // Falls das Array unerwartet leer sein sollte, nutzen wir ein Fallback-Bild
  const fallbackImage = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';
  const productImages = images && images.length > 0 ? images : [fallbackImage];
  
  // State für das aktuell ausgewählte Hauptbild
  const [activeImage, setActiveImage] = useState(productImages[0]);

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* 1. Hauptbild-Container (Großes Fokusbild) */}
      <div className="relative aspect-square w-full bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-200/60 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
        />
      </div>

      {/* 2. Daumennagel-Leiste (Genaue Aufteilung für 5 Spalten) */}
      <div className="grid grid-cols-5 gap-2.5">
        {productImages.map((img, index) => {
          const isActive = img === activeImage;
          
          return (
            <button
              key={index}
              onClick={() => setActiveImage(img)}
              className={`relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-100 border transition-all duration-200 ${
                isActive 
                  ? 'border-blue-600 ring-2 ring-blue-600/10 scale-98 shadow-xs' 
                  : 'border-zinc-200 hover:border-zinc-400 hover:scale-102 shadow-2xs'
              }`}
            >
              <Image
                src={img}
                alt={`${title} Ansicht ${index + 1}`}
                fill
                sizes="(max-width: 768px) 20vw, 10vw"
                className="object-cover object-center"
              />
              {/* Sanfter Overlay-Effekt bei nicht-aktiven Bildern */}
              {!isActive && (
                <div className="absolute inset-0 bg-zinc-950/0 hover:bg-zinc-950/5 transition-colors duration-200" />
              )}
            </button>
          );
        })}
      </div>
      
    </div>
  );
}