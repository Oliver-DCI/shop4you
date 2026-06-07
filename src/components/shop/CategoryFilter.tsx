'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryFilterProps {
  categories: string[];
  brandsByCategory?: Record<string, string[]>;
}

export default function CategoryFilter({ 
  categories = [], 
  brandsByCategory = {} 
}: CategoryFilterProps) {
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentSort = searchParams.get('sort') || '';

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams();
    params.set('category', cat);
    router.push(`/?${params.toString()}`);
  };

  const handleBrandChange = (brand: string, cat: string) => {
    const params = new URLSearchParams();
    params.set('category', cat);
    if (currentBrand !== brand) {
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

  // Filtert das alte "Produkte" Label heraus
  const cleanCategories = categories.filter(cat => cat !== 'Produkte');

  return (
    <div className="w-full bg-white relative z-30">
      
      {/* LEVEL 1: Hauptleiste (🎯 Trennlinie entfernt, um Überschneidungen zu verhindern) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-14 relative flex items-center justify-center w-full">
        
        {/* Mittiger Bereich: Kategorien */}
        <div className="flex items-center justify-center gap-8 h-full">
          {cleanCategories.map((cat) => {
            const isActive = cat === currentCategory;
            const availableBrands = brandsByCategory[cat] || [];
            
            return (
              <div key={cat} className="group relative h-full flex items-center">
                
                {/* Kategorie Link */}
                <button
                  onClick={() => handleCategoryChange(cat)}
                  className={`h-full px-2 text-xs font-mono tracking-widest uppercase transition-colors flex items-center cursor-pointer whitespace-nowrap ${
                    isActive ? 'text-black font-bold' : 'text-samsung-muted font-normal hover:text-black'
                  }`}
                >
                  {cat}
                </button>

                {/* LEVEL 2: Mega-Dropdown im toom.de-Style */}
                {availableBrands.length > 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block bg-white border border-zinc-200 shadow-xl p-5 min-w-[650px] z-50">
                    
                    <div className="text-[9px] font-mono tracking-widest text-samsung-muted uppercase mb-3 border-b border-zinc-100 pb-1.5 text-center w-full">
                      Hersteller filtern ({cat})
                    </div>
                    
                    {/* Das 5-Spalten-Grid für die Hersteller-Buttons */}
                    <div className="grid grid-cols-5 gap-2 w-full">
                      {availableBrands.map((brand) => {
                        const isBrandActive = currentBrand === brand && isActive;
                        return (
                          <button
                            key={brand}
                            onClick={() => handleBrandChange(brand, cat)}
                            className={`text-center py-2 px-1 text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer truncate border ${
                              isBrandActive 
                                ? 'bg-black border-black text-white font-bold' 
                                : 'bg-zinc-50 border-zinc-100 text-zinc-700 hover:bg-zinc-100 hover:text-black hover:border-zinc-300'
                            }`}
                            title={brand}
                          >
                            {brand}
                          </button>
                        );
                      })}
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* Rechter Bereich: Sortierung */}
        <div className="absolute right-4 sm:right-6 lg:right-8 flex items-center gap-3 h-full bg-white pl-4">
          <button
            onClick={() => handleSortChange('price_asc')}
            className={`text-[10px] font-mono uppercase tracking-widest transition-colors cursor-pointer whitespace-nowrap ${
              currentSort === 'price_asc' ? 'text-black font-bold underline underline-offset-4' : 'text-samsung-muted hover:text-black'
            }`}
          >
            Preis ↑
          </button>
          <div className="w-px h-3 bg-zinc-200" />
          <button
            onClick={() => handleSortChange('price_desc')}
            className={`text-[10px] font-mono uppercase tracking-widest transition-colors cursor-pointer whitespace-nowrap ${
              currentSort === 'price_desc' ? 'text-black font-bold underline underline-offset-4' : 'text-samsung-muted hover:text-black'
            }`}
          >
            Preis ↓
          </button>
        </div>

      </div>
    </div>
  );
}