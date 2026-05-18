'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductImages({ images, title }: { images: string[], title: string }) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Hauptbild mit modernem, leichtem Rundungseffekt */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <Image 
          src={activeImage} 
          alt={title} 
          fill 
          className="object-cover object-center transition-all duration-300 hover:scale-105"
          priority
        />
      </div>
      
      {/* Thumbnails */}
      <div className="flex gap-4">
        {images.map((img, index) => (
          <button 
            key={index}
            onClick={() => setActiveImage(img)}
            className={`relative w-24 aspect-square overflow-hidden rounded-xl border-2 transition-all ${
              activeImage === img ? 'border-black dark:border-white scale-95' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <Image src={img} alt={`${title}-thumb-${index}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}