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

  // Optimiertes Such-Verhalten gegen ungewollte Redirect-Schleifen
  useEffect(() => {
    if (!searchQuery.trim() && pathname !== '/') return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      } else {
        if (pathname === '/') {
          params.delete('search');
        } else {
          return;
        }
      }
      
      router.push(`/?${params.toString()}`);
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router, searchParams, pathname]);

  // Synchronisiert das Suchfeld bei URL-Änderung
  useEffect(() => {
    if (pathname === '/') {
      setSearchQuery(searchParams.get('search') || '');
    } else {
      setSearchQuery('');
    }
  }, [searchParams, pathname]);

  const userRoleNormalized = (user?.role || '').toUpperCase();

  // Liefert nur noch den ersten Buchstaben des Vornamens
  const getInitials = () => {
    if (!user) return '?';
    
    const fName = (user.firstName || '').trim();
    // @ts-ignore
    const fallbackName = (user.name || user.username || '').trim();

    // 1. Prio: Erster Buchstabe des Vornamens
    if (fName) {
      return fName.charAt(0).toUpperCase();
    }

    // 2. Prio: Erster Buchstabe des Kombi-/Usernamens als Fallback
    if (fallbackName) {
      return fallbackName.charAt(0).toUpperCase();
    }

    return '?';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* 🎯 FIX: Padding auf px-4 sm:px-6 lg:px-8 angepasst, damit es perfekt mit der Seite fluchtet */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 grid grid-cols-3 items-center gap-4">
        
        {/* Spalte 1: Brand / Logo (Symmetrisch & Gleichmäßig) */}
        <div className="flex justify-start">
          <Link href="/" className="flex items-center select-none text-black group">
            {/* "SHOP" - font-light */}
            <span className="text-3xl font-light tracking-[0.25em] uppercase text-black">
              {/* 🎯 KOSMETIK: text-zinc-400 -> text-samsung-muted */}
              SHOP<span className="text-samsung-muted font-extralight">[4]YOU</span>
            </span>
          </Link>
        </div>

        {/* Spalte 2: Suchfeld */}
        <div className="w-full hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SUCHEN..."
              className="w-full h-11 pl-11 pr-4 rounded-none border border-samsung-gray-200 bg-samsung-gray-50 text-xs text-black focus:outline-none focus:border-black focus:bg-white transition-colors placeholder-samsung-muted uppercase tracking-wider"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs opacity-40">🔍</span>
          </div>
        </div>

        {/* Spalte 3: User-Status & Aktionen */}
        <div className="flex items-center justify-end gap-6">
          {user ? (
            <div className="flex items-center gap-4 bg-white">
              
              {/* Avatar-Button zum Profil */}
              <Link 
                href="/account/profile"
                className="w-8 h-8 bg-black text-white flex items-center justify-center text-[11px] font-mono font-normal tracking-tighter select-none rounded-none hover:bg-zinc-800 transition-colors"
                title="Zum persönlichen Profil"
              >
                {getInitials()}
              </Link>

              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono font-normal text-zinc-400 uppercase tracking-widest hidden sm:inline">
                  [{user.role}]
                </span>

                {(userRoleNormalized === 'SELLER' || userRoleNormalized === 'ADMIN') && (
                  <Link 
                    href={userRoleNormalized === 'ADMIN' ? '/admin/dashboard' : '/seller/dashboard'}
                    className="text-[10px] text-black font-bold uppercase tracking-wider hover:text-zinc-500 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}

                <button 
                  onClick={logout} 
                  className="text-[10px] text-samsung-muted uppercase font-medium hover:text-black transition-colors cursor-pointer tracking-wider"
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

          {/* Warenkorb-Trigger */}
          <button 
            onClick={() => setCartOpen(true)} 
            className="relative h-11 w-11 flex items-center justify-center rounded-none border border-samsung-gray-200 bg-white transition-colors hover:bg-samsung-gray-50 hover:border-black cursor-pointer"
          >
            <span className="text-sm">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-medium h-4 w-4 rounded-none flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}