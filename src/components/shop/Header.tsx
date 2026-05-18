// src/components/shop/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/store/cartStore';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCartOpen, cartCount } = useCart();

  // Suchzustand lokal verwalten
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Wenn sich die URL von außen ändert (z.B. Zurück-Button), Input synchronisieren
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const currentCategory = searchParams.get('category') || 'Alle Hardware';
  const categories = ['Alle Hardware', 'Notebooks', 'Smartphones', 'Tablets', 'Komponenten', 'Zubehör'];

  // Such-Handler beim Abschicken (Enter)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    } else {
      params.delete('search');
    }
    
    // Zurück zur Startseite mit den neuen Such-Parametern
    router.push(`/?${params.toString()}`);
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Bei Kategorie-Wechsel löschen wir die Suche, um Verwirrung zu vermeiden
    params.delete('search');

    if (category === 'Alle Hardware') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl shadow-xs">
      
      {/* OBERE EBENE: Logo, Suche, Kasse */}
      <div className="bg-transparent">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          
          {/* Brand-Logo */}
          <Link href="/" className="text-3xl font-black tracking-tighter uppercase transition-opacity hover:opacity-90 shrink-0 select-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 drop-shadow-xs">
              SHOP4YOU
            </span>
            <span className="text-blue-600 font-serif lowercase">.</span>
          </Link>

          {/* ✨ Suchleiste: Jetzt als Formular eingebunden */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Suchen Sie nach High-End Laptops, Tablets, Smartphones..."
                className="w-full h-11 pl-4 pr-11 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs font-medium placeholder-zinc-400 focus:outline-hidden focus:border-blue-500/50 focus:bg-white focus:shadow-[0_0_15px_rgba(37,99,235,0.05)] transition-all"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-xs opacity-60 hover:opacity-100 transition-opacity">
                🔍
              </button>
            </div>
          </form>

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

      {/* UNTERE EBENE: Zentrierte Filter-Navigationsleiste */}
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