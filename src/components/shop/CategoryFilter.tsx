'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryFilterProps {
  categories: string[];
}

const BRAND_MAPPING: Record<string, string[]> = {
  'Notebooks': ['Apple', 'Samsung', 'Lenovo', 'Dell', 'HP'],
  'Smartphones': ['Apple', 'Samsung', 'Google', 'Xiaomi'],
  'TV': ['Samsung', 'LG', 'Sony', 'Philips'],
  'Audio': ['Sony', 'Bose', 'Apple', 'Sennheiser', 'JBL'],
  'Zubehör': ['Logitech', 'Razer', 'Anker', 'Corsair']
};

export default function CategoryFilter({ categories }: CategoryFilterProps) {
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

  const availableBrands = BRAND_MAPPING[currentCategory] || [];

  return (
    <div className="w-full bg-white">
      
      {/* LEVEL 1: Hauptleiste mit relativer Positionierung für echte Zentrierung */}
      <div className="max-w-[1400px] mx-auto px-4 h-14 relative flex items-center justify-center w-full border-b border-zinc-100">
        
        {/* 🎯 MITTE: Kategorien absolut zentriert, flüssig nebeneinander mit automatischer Scroll-Erlaubnis */}
        <div className="flex items-center justify-start md:justify-center gap-4 overflow-x-auto scrollbar-none h-full max-w-[70%] sm:max-w-[80%] overflow-y-hidden">
          {categories.map((cat) => {
            const isActive = cat === currentCategory;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`h-full px-3 text-[11px] font-mono tracking-widest uppercase border-b-2 transition-colors flex items-center cursor-pointer whitespace-nowrap ${
                  isActive ? 'border-black text-black font-bold' : 'border-transparent text-zinc-400 hover:text-black'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 🎯 RECHTS: Absolut positionierte Sortierung, klaut der Mitte keinen Platz mehr */}
        <div className="absolute right-4 hidden sm:flex items-center gap-3 h-full bg-white pl-4">
          <button
            onClick={() => handleSortChange('price_asc')}
            className={`text-[10px] font-mono uppercase tracking-widest transition-colors cursor-pointer whitespace-nowrap ${
              currentSort === 'price_asc' ? 'text-black font-bold underline underline-offset-4' : 'text-zinc-400 hover:text-black'
            }`}
          >
            Preis ↑
          </button>
          <div className="w-px h-3 bg-zinc-200" />
          <button
            onClick={() => handleSortChange('price_desc')}
            className={`text-[10px] font-mono uppercase tracking-widest transition-colors cursor-pointer whitespace-nowrap ${
              currentSort === 'price_desc' ? 'text-black font-bold underline underline-offset-4' : 'text-zinc-400 hover:text-black'
            }`}
          >
            Preis ↓
          </button>
        </div>
      </div>

      {/* LEVEL 2: Hersteller-Slider (Bleibt perfekt zentriert) */}
      <div 
        className={`w-full overflow-hidden transition-all duration-300 bg-zinc-50 border-b border-zinc-200/50 ${
          currentCategory !== 'Produkte' && availableBrands.length > 0
            ? 'max-h-28 opacity-100 py-3' 
            : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col items-center justify-center gap-1.5">
          <div className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase text-center">
            Hersteller filtern
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-1">
            {availableBrands.map((brand) => {
              const isBrandActive = currentBrand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => handleBrandChange(brand)}
                  className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-all rounded-none cursor-pointer border-none ${
                    isBrandActive 
                      ? 'bg-black text-white font-bold' 
                      : 'bg-transparent text-zinc-400 hover:text-black'
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