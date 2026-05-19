'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryFilterProps {
  categories: string[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'Alle Hardware';

  const handleCategoryChange = (category: string) => {
    if (category === 'Alle Hardware') {
      router.push('/');
    } else {
      router.push(`/?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none rounded-none">
      {categories.map((cat) => {
        const isActive = cat === currentCategory;
        
        return (
          <button 
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-none text-xs font-normal uppercase tracking-widest border transition-colors whitespace-nowrap cursor-pointer ${
              isActive 
                ? 'bg-black border-transparent text-white' 
                : 'bg-white border-zinc-200 text-zinc-500 hover:border-black hover:text-black'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}