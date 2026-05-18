// src/components/shop/CategoryFilter.tsx
'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryFilterProps {
  categories: string[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Aktuelle Kategorie aus der URL holen (z. B. ?category=Notebooks). Wenn leer, dann "Alle Hardware"
  const currentCategory = searchParams.get('category') || 'Alle Hardware';

  const handleCategoryChange = (category: string) => {
    if (category === 'Alle Hardware') {
      router.push('/'); // Zurück zur Gesamtübersicht
    } else {
      router.push(`/?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const isActive = cat === currentCategory;
        
        return (
          <button 
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap shadow-xs ${
              isActive 
                ? 'bg-blue-600 border-transparent text-white' 
                : 'bg-white border-zinc-200 text-zinc-600 hover:border-blue-500/40 hover:text-blue-600'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}