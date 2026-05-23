'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryFilterProps {
  categories: string[];
  brandsByCategory?: Record<string, string[]>; // 🎯 Mit '?' optional machen!
}

// 🎯 Hier setzen wir direkt leere Arrays/Objekte als Fallback ein, falls nichts übergeben wird
export default function CategoryFilter({ 
  categories = ['Produkte'], 
  brandsByCategory = {} 
}: CategoryFilterProps) {
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get('category') || 'Produkte';
  const currentBrand = searchParams.get('brand') || '';
  const currentSort = searchParams.get('sort') || '';

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams();
    if (cat !== 'Produkte') {
      params.set('category', cat);
    }
    router.push(`/?${params.toString()}`);
  };

  const handleBrandChange = (brand: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentBrand === brand) {
      params.delete('brand');
    } else {
      params.set('brand', brand);
    }
    router.push(`/?${params.toString()}`);
  };

  const handleSortChange = (sortType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentSort === sortType) {
      params.delete('sort');
    } else {
      params.set('sort', sortType);
    }
    router.push(`/?${params.toString()}`);
  };

  // 🎯 Absicherung: Wenn brandsByCategory undefined ist, greift das leere Objekt {}
  const availableBrands = brandsByCategory[currentCategory] || [];
  const showBrands = currentCategory !== 'Produkte' && availableBrands.length > 0;

  return (
    <div className="w-full bg-white relative z-20">
      
      {/* LEVEL 1: Hauptleiste */}
      {/* 🎯 FIX: Padding auf px-4 sm:px-6 lg:px-8 angepasst, damit es fluchtet */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 relative flex items-center justify-center w-full">
        <div className="flex items-center justify-start md:justify-center gap-4 overflow-x-auto scrollbar-none h-full max-w-[70%] sm:max-w-[80%] overflow-y-hidden">
          {categories.map((cat) => {
            const isActive = (cat === currentCategory && searchParams.has('category')) || (cat === 'Produkte' && !searchParams.has('category'));
            
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                /* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */
                className={`h-full px-3 text-[11px] font-mono tracking-widest uppercase border-b-2 transition-colors flex items-center cursor-pointer whitespace-nowrap ${
                  isActive ? 'border-black text-black font-bold' : 'border-transparent text-samsung-muted hover:text-black'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 🎯 FIX: right Positionierung fluchtend mit den neuen Paddings (right-4 sm:right-6 lg:right-8) */}
        <div className="absolute right-4 sm:right-6 lg:right-8 hidden sm:flex items-center gap-3 h-full bg-white pl-4">
          <button
            onClick={() => handleSortChange('price_asc')}
            /* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */
            className={`text-[10px] font-mono uppercase tracking-widest transition-colors cursor-pointer whitespace-nowrap ${
              currentSort === 'price_asc' ? 'text-black font-bold underline underline-offset-4' : 'text-samsung-muted hover:text-black'
            }`}
          >
            Preis ↑
          </button>
          <div className="w-px h-3 bg-zinc-200" />
          <button
            onClick={() => handleSortChange('price_desc')}
            /* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */
            className={`text-[10px] font-mono uppercase tracking-widest transition-colors cursor-pointer whitespace-nowrap ${
              currentSort === 'price_desc' ? 'text-black font-bold underline underline-offset-4' : 'text-samsung-muted hover:text-black'
            }`}
          >
            Preis ↓
          </button>
        </div>
      </div>

      {/* LEVEL 2: Dynamischer Hersteller-Slider */}
      <div 
        className={`w-full overflow-hidden transition-all duration-300 bg-white ${
          showBrands 
            ? 'max-h-28 opacity-100 py-3' 
            : 'max-h-0 opacity-0 py-0 -mb-[1px]'
        }`}
      >
        {/* 🎯 FIX: Padding auch hier auf px-4 sm:px-6 lg:px-8 angepasst */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-1.5">
          {/* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */}
          <div className="text-[9px] font-mono tracking-widest text-samsung-muted uppercase text-center">
            Hersteller filtern
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-1">
            {availableBrands.map((brand) => {
              const isBrandActive = currentBrand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => handleBrandChange(brand)}
                  /* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */
                  className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-all rounded-none cursor-pointer border-none ${
                    isBrandActive 
                      ? 'bg-black text-white font-bold' 
                      : 'bg-transparent text-samsung-muted hover:text-black'
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}