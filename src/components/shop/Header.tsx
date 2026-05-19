// src/components/shop/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCart } from '@/context/cartContext';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); 
  
  // ✨ logout aus dem Context geholt, um den TS2339 Fehler endgültig zu killen!
  const { setCartOpen, cartCount, user, logout } = useCart();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Live-Suche NUR auf der Startseite ausführen
  useEffect(() => {
    if (pathname !== '/') return; 

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      } else {
        params.delete('search');
      }
      router.push(`/?${params.toString()}`);
    }, 250);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router, searchParams, pathname]);

  // Suchfeld zurücksetzen, wenn man die Startseite verlässt
  useEffect(() => {
    if (pathname === '/') {
      setSearchQuery(searchParams.get('search') || '');
    }
  }, [searchParams, pathname]);

  const currentCategory = searchParams.get('category') || 'Alle Hardware';
  const categories = ['Alle Hardware', 'Notebooks', 'Smartphones', 'Tablets', 'Komponenten', 'Zubehör'];

  return (
    /* 🎨 Clean White Glassmorphism Header – perfekt transparent & verschwommen */
    <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.04)]">
      <div className="max-w-[1400px] mx-auto px-4 h-20 flex items-center justify-between gap-8">
        
        {/* SHOP4YOU erstrahlt jetzt im markanten, zweifarbigen Live-Chat-Blauverlauf */}
        <Link href="/" className="text-3xl font-black tracking-tighter uppercase select-none">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 drop-shadow-[0_2px_8px_rgba(59,130,246,0.25)]">
            SHOP4YOU
          </span>
        </Link>

        <div className="flex-1 max-w-2xl hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tippen zum Suchen..."
              /* Helles, mattes Glas-Design für das Suchfeld */
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 bg-white/50 text-xs text-zinc-800 focus:outline-none focus:border-zinc-400 focus:bg-white transition-all placeholder-zinc-400 shadow-inner"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs opacity-50">🔍</span>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {user ? (
            /* Das Profil-Badge im hellen Milchglas-Look */
            <div className="flex items-center gap-3 bg-white/80 border border-zinc-200 px-3 py-1.5 rounded-xl shadow-sm">
              <span className="text-xs font-bold text-zinc-700 flex items-center gap-1">
                👤 {user.firstName} <span className="text-[10px] text-zinc-500 uppercase font-black">({user.role})</span>
              </span>
              <div className="w-px h-3 bg-zinc-200" />
              <button onClick={logout} className="text-[10px] text-red-600 uppercase font-black hover:text-red-500 transition-colors cursor-pointer">Logout</button>
            </div>
          ) : (
            <Link 
              href="/login"
              className="text-xs font-black uppercase tracking-wider text-zinc-600 hover:text-zinc-900 transition-colors px-3 py-2 rounded-lg"
            >
              Anmelden
            </Link>
          )}
          
          <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

          {/* Hell-mattes Warenkorb-Icon */}
          <button onClick={() => setCartOpen(true)} className="relative h-11 w-11 flex items-center justify-center rounded-xl border border-zinc-200 bg-white/50 group transition-all hover:bg-white hover:border-zinc-300 shadow-sm cursor-pointer">
            <span className="text-base group-hover:scale-110 transition-transform">🛒</span>
            {cartCount > 0 && (
              /* Schicker, minimaler Counter-Badge */
              <span className="absolute -top-1.5 -right-1.5 bg-zinc-900 text-white text-[9px] font-black h-5 w-5 rounded-md flex items-center justify-center border border-white shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* KATEGORIEN-LEISTE (Komplett ohne die obere Trennlinie) */}
      <div className="bg-transparent block">
        <div className="max-w-[1400px] mx-auto px-4 h-12 flex items-center justify-center overflow-x-auto gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete('search');
                if (cat === 'Alle Hardware') params.delete('category');
                else params.set('category', cat);
                router.push(`/?${params.toString()}`);
              }}
              /* Dezent dunkler Akzent für den aktiven Kategorie-Tab */
              className={`h-full px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center cursor-pointer ${
                cat === currentCategory ? 'border-zinc-900 text-zinc-900 bg-zinc-900/5' : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}