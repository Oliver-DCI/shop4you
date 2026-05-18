// src/components/shop/ProductImages.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductImagesProps {
  images: string[];
  title: string;
}

export default function ProductImages({ images, title }: ProductImagesProps) {
  // Das erste Bild aus dem Array ist der Standard-Favorit
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Großes Hauptbild im edlen, hellen Rahmen */}
      <div className="relative aspect-square w-full rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
        <Image
          src={activeImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          loading="eager" // Verhindert die LCP-Warnung im Browser!
          className="object-cover object-center transition-all duration-300"
        />
      </div>

      {/* 2. Die 3 kleinen Vorschaubilder darunter (Exakt wie bei toom.de) */}
      <div className="grid grid-cols-3 gap-4">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(img)}
            onMouseEnter={() => setActiveImage(img)} // Wechselt das Bild auch elegant beim Drüberfahren
            className={`relative aspect-square rounded-xl overflow-hidden border bg-white transition-all shadow-xs ${
              activeImage === img
                ? 'border-blue-600 ring-2 ring-blue-600/10 scale-[1.02]'
                : 'border-zinc-200 hover:border-blue-500/50'
            }`}
          >
            <Image
              src={img}
              alt={`${title} Ansicht ${index + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 15vw"
              className="object-cover object-center"
            />
          </button>
        ))}
      </div>
    </div>
  );
}