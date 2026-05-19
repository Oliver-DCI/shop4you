'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductImagesProps {
  images: string[];
  title: string;
}

export default function ProductImages({ images, title }: ProductImagesProps) {
  const fallbackImage = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';
  const productImages = images && images.length > 0 ? images : [fallbackImage];
  const [activeImage, setActiveImage] = useState(productImages[0]);

  return (
    <div className="flex flex-col gap-3 w-full rounded-none">
      
      {/* Hauptbild */}
      <div className="relative aspect-square w-full bg-zinc-50 rounded-none border border-zinc-200">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-200 grayscale hover:grayscale-0"
        />
      </div>

      {/* Daumennägel */}
      <div className="grid grid-cols-5 gap-2">
        {productImages.map((img, index) => {
          const isActive = img === activeImage;
          
          return (
            <button
              key={index}
              onClick={() => setActiveImage(img)}
              className={`relative aspect-square w-full rounded-none overflow-hidden bg-zinc-50 border transition-colors ${
                isActive 
                  ? 'border-black' 
                  : 'border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <Image
                src={img}
                alt={`${title} Ansicht ${index + 1}`}
                fill
                sizes="(max-width: 768px) 20vw, 10vw"
                className="object-cover object-center grayscale"
              />
            </button>
          );
        })}
      </div>
      
    </div>
  );
}