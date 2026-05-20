'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProductImagesProps {
  images: string[];
  title: string;
}

export default function ProductImages({ images, title }: ProductImagesProps) {
  // Falls keine Bilder da sind, starten wir mit einem leeren Array
  const validImages = images && images.length > 0 ? images : ['NO_IMAGE'];
  
  const [activeImage, setActiveImage] = useState(validImages[0]);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (validImages.length > 0) {
      setActiveImage(validImages[0]);
    }
  }, [images]);

  // Einzigartiges, minimalistisches Fallback-Element im shop4you-Look
  const renderFallbackPlaceholder = (text = "KEIN BILD VERFÜGBAR") => (
    <div className="absolute inset-0 bg-zinc-100 flex flex-col items-center justify-center border border-zinc-200 select-none p-4">
      <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase border border-zinc-300 px-3 py-1.5 animate-pulse">
        ⚠️ {text}
      </div>
      <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-tight mt-2">
        shop4you // Core Architecture
      </span>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 w-full rounded-none">
      
      {/* Hauptbild-Container */}
      <div className="relative aspect-square w-full bg-zinc-50 rounded-none border border-zinc-200 overflow-hidden">
        {activeImage === 'NO_IMAGE' || brokenImages[activeImage] ? (
          renderFallbackPlaceholder("PRODUKTBILD FEHLT")
        ) : (
          <Image
            src={activeImage}
            alt={title}
            fill
            priority
            loading="eager"
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center transition-all duration-200 grayscale hover:grayscale-0"
            onError={() => {
              setBrokenImages(prev => ({ ...prev, [activeImage]: true }));
            }}
          />
        )}
      </div>

      {/* Daumennägel (Thumbnails) */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {validImages.map((img, index) => {
            const isActive = img === activeImage;
            const isBroken = brokenImages[img];
            
            return (
              <button
                key={index}
                type="button"
                onClick={() => !isBroken && setActiveImage(img)}
                className={`relative aspect-square w-full rounded-none overflow-hidden bg-zinc-50 border transition-colors ${
                  isActive 
                    ? 'border-black' 
                    : 'border-zinc-200 hover:border-zinc-400'
                } ${isBroken ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {isBroken ? (
                  <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center text-[8px] font-mono text-zinc-400">
                    Kein Bild
                  </div>
                ) : (
                  <Image
                    src={img}
                    alt={`${title} Ansicht ${index + 1}`}
                    fill
                    loading="eager"
                    sizes="(max-width: 768px) 20vw, 10vw"
                    className="object-cover object-center grayscale"
                    onError={() => {
                      setBrokenImages(prev => ({ ...prev, [img]: true }));
                      if (isActive) {
                        // Wenn das aktive Bild bricht, suchen wir das nächste funktionierende oder blenden Platzhalter ein
                        setActiveImage('NO_IMAGE');
                      }
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
      
    </div>
  );
}