'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCart } from '@/context/cartContext';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); 
  
  const { setCartOpen, cartCount, user, logout } = useCart();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

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

  useEffect(() => {
    if (pathname === '/') {
      setSearchQuery(searchParams.get('search') || '');
    }
  }, [searchParams, pathname]);

  const currentCategory = searchParams.get('category') || 'Alle Hardware';
  const categories = ['Alle Hardware', 'Notebooks', 'Smartphones', 'Tablets', 'Komponenten', 'Zubehör'];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-zinc-200">
      
      {/* Haupt-Header: 3-Spalten Grid für perfekte Symmetrie */}
      <div className="max-w-[1400px] mx-auto px-4 h-20 grid grid-cols-3 items-center gap-4">
        
        {/* Brand (Links) */}
        <div className="flex justify-start">
          <Link href="/" className="text-2xl font-normal tracking-widest uppercase select-none text-black">
            SHOP<span className="font-light text-zinc-400">4YOU</span>
          </Link>
        </div>

        {/* Suchfeld (Mitte) */}
        <div className="w-full hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SUCHEN..."
              className="w-full h-11 pl-11 pr-4 rounded-none border border-zinc-200 bg-zinc-50 text-xs text-black focus:outline-none focus:border-black focus:bg-white transition-colors placeholder-zinc-400 uppercase tracking-wider"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs opacity-40">🔍</span>
          </div>
        </div>

        {/* User & Actions (Rechts) */}
        <div className="flex items-center justify-end gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-white border border-zinc-200 p-1.5 rounded-none">
              
              {/* 🎯 Initialen-Badge als Link zum Profil */}
              <Link 
                href="/account/profile"
                className="w-8 h-8 bg-black text-white flex items-center justify-center text-[11px] font-mono font-normal tracking-tighter select-none rounded-none hover:bg-zinc-800 transition-colors"
                title="Zum persönlichen Profil"
              >
                {user.firstName.charAt(0).toUpperCase()}
                {user.role.charAt(0).toUpperCase()}
              </Link>

              {/* Status & Dashboard-Shortcut */}
              <div className="flex items-center gap-2 pr-1.5">
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest hidden sm:inline">
                  [{user.role}]
                </span>

                {(user.role === 'seller' || user.role === 'admin') && (
                  <>
                    <div className="w-px h-3 bg-zinc-200" />
                    <Link 
                      href={user.role === 'admin' ? '/admin' : '/seller/dashboard'}
                      className="text-[10px] text-black font-bold uppercase tracking-wider hover:underline underline-offset-4"
                    >
                      Dashboard
                    </Link>
                  </>
                )}

                <div className="w-px h-3 bg-zinc-200" />
                <button 
                  onClick={logout} 
                  className="text-[10px] text-zinc-500 uppercase font-medium hover:text-black transition-colors cursor-pointer tracking-wider"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link 
              href="/login"
              className="text-xs font-medium uppercase tracking-widest text-black hover:text-zinc-500 transition-colors px-2 py-2"
            >
              Anmelden
            </Link>
          )}
          
          <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

          {/* Warenkorb-Trigger */}
          <button onClick={() => setCartOpen(true)} className="relative h-11 w-11 flex items-center justify-center rounded-none border border-zinc-200 bg-white transition-colors hover:bg-zinc-50 hover:border-black cursor-pointer">
            <span className="text-sm">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-medium h-4 w-4 rounded-none flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Kategorienleiste */}
      <div className="bg-white">
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
              className={`h-full px-4 text-[11px] font-normal uppercase tracking-widest border-b-2 transition-colors flex items-center cursor-pointer ${
                cat === currentCategory ? 'border-black text-black bg-zinc-50' : 'border-transparent text-zinc-400 hover:text-black'
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

