// src/components/shop/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCart } from '@/store/cartStore';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // 🔐 Neu: Pfad auslesen
  
  const { setCartOpen, cartCount, user, setUser } = useCart();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Live-Suche NUR auf der Startseite ausführen
  useEffect(() => {
    if (pathname !== '/') return; // 🔐 2026 Schutz: Blockiert das Flackern auf /login oder /register

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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-900/90 backdrop-blur-xl shadow-xl">
      <div className="max-w-[1400px] mx-auto px-4 h-20 flex items-center justify-between gap-8">
        
        <Link href="/" className="text-3xl font-black tracking-tighter uppercase select-none">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
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
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-800 bg-zinc-950/40 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs opacity-40">🔍</span>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {user ? (
            <div className="flex items-center gap-3 bg-zinc-950/50 border border-zinc-800/60 px-3 py-1.5 rounded-xl">
              <span className="text-xs font-bold text-zinc-300">
                👤 {user.firstName} <span className="text-[10px] text-zinc-500 uppercase font-black">({user.role})</span>
              </span>
              <div className="w-px h-3 bg-zinc-800" />
              <button onClick={() => setUser(null)} className="text-[10px] text-red-400 uppercase font-black hover:text-red-300">Logout</button>
            </div>
          ) : (
            // 🎯 WIE GEWÜNSCHT: Nur noch "Anmelden" Beschriftung
            <Link 
              href="/login"
              className="text-xs font-black uppercase tracking-wider text-zinc-300 hover:text-blue-400 transition-colors px-3 py-2 rounded-lg"
            >
              Anmelden
            </Link>
          )}
          
          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          <button onClick={() => setCartOpen(true)} className="relative h-11 w-11 flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/30 group">
            <span className="text-base group-hover:scale-110 transition-transform">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[9px] font-black h-5 w-5 rounded-md flex items-center justify-center border border-zinc-900 shadow-lg">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="bg-transparent block border-t border-zinc-800/30">
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
              className={`h-full px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center ${
                cat === currentCategory ? 'border-blue-500 text-blue-400 bg-blue-950/20' : 'border-transparent text-zinc-400 hover:text-zinc-100'
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