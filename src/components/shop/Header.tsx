// src/components/shop/Header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/store/cartStore';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCartOpen, cartCount } = useCart();

  // Aktuelle Kategorie aus URL ermitteln
  const currentCategory = searchParams.get('category') || 'Alle Hardware';

  // Festgelegte Tech-Kategorien im toom-Style
  const categories = ['Alle Hardware', 'Notebooks', 'Smartphones', 'Tablets', 'Komponenten', 'Zubehör'];

  const handleCategoryChange = (category: string) => {
    if (category === 'Alle Hardware') {
      router.push('/');
    } else {
      router.push(`/?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    /* ✨ bg-white/80 und backdrop-blur-xl sorgen hier für den edlen Glas-Effekt beim Scrollen */
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl shadow-xs">
      
      {/* OBERE EBENE: Logo, Suche, Kasse (Auf bg-transparent geändert, um den Glas-Effekt nicht zu blockieren) */}
      <div className="bg-transparent">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          
          {/* Brand-Logo */}
          <Link href="/" className="text-3xl font-black tracking-tighter uppercase transition-opacity hover:opacity-90 shrink-0 select-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 drop-shadow-xs">
              SHOP4YOU
            </span>
            <span className="text-blue-600 font-serif lowercase">.</span>
          </Link>

          {/* Suchleiste */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Suchen Sie nach High-End Laptops, Tablets, Smartphones..."
                className="w-full h-11 pl-4 pr-11 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs font-medium placeholder-zinc-400 focus:outline-hidden focus:border-blue-500/50 focus:bg-white focus:shadow-[0_0_15px_rgba(37,99,235,0.05)] transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs pointer-events-none opacity-60">
                🔍
              </div>
            </div>
          </div>

          {/* Rechte Aktionen */}
          <div className="flex items-center gap-4 shrink-0">
            <button className="text-xs font-black uppercase tracking-wider text-zinc-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-zinc-50/50">
              Mein Konto
            </button>
            
            <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

            {/* Funktionales Warenkorb-Icon */}
            <button 
              onClick={() => setCartOpen(true)}
              className="relative h-11 w-11 flex items-center justify-center rounded-xl border border-zinc-200 hover:border-blue-500/30 hover:bg-blue-50/30 bg-white transition-all shadow-xs group"
            >
              <span className="text-base group-hover:scale-110 transition-transform">🛒</span>
              
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-black h-5 w-5 rounded-md flex items-center justify-center border border-white shadow-xs animate-scale-up">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* UNTERE EBENE: Zentrierte Filter-Navigationsleiste (Ebenfalls bg-transparent für den vollen Durchblick) */}
      <div className="bg-transparent block">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-center overflow-x-auto scrollbar-none gap-2">
          {categories.map((cat) => {
            const isActive = cat === currentCategory;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`h-full px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-blue-50/40 font-black'
                    : 'border-transparent text-zinc-500 hover:text-zinc-950 hover:border-zinc-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
}