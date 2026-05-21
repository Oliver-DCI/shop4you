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

  // Optimiertes Such-Verhalten
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!searchQuery.trim() && pathname !== '/') return;

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

  // Synchronisiert das Suchfeld bei URL-Änderung
  useEffect(() => {
    if (pathname === '/') {
      setSearchQuery(searchParams.get('search') || '');
    }
  }, [searchParams, pathname]);

  const userRoleNormalized = (user?.role || '').toUpperCase();

  const getInitials = () => {
    if (!user) return '??';
    
    const fName = (user.firstName || '').trim();
    const lName = (user.lastName || '').trim();
    // @ts-ignore
    const fallbackName = (user.name || user.username || '').trim();

    if (fName && lName) {
      return (fName.charAt(0) + lName.charAt(0)).toUpperCase();
    }

    const combined = fName || fallbackName;
    if (combined.includes(' ')) {
      const parts = combined.split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
      }
    }

    if (combined.length >= 2) {
      return combined.substring(0, 2).toUpperCase();
    }

    return combined ? combined.toUpperCase() : '??';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="max-w-[1400px] mx-auto px-4 h-20 grid grid-cols-3 items-center gap-4">
        
        {/* Spalte 1: Brand / Logo */}
        <div className="flex justify-start">
          <Link href="/" className="text-3xl font-light tracking-[0.25em] uppercase select-none text-black">
            SHOP<span className="text-samsung-muted font-extralight">4YOU</span>
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
              
              {/* Avatar-Button zum Profil (🎯 Hover-Grün entfernt -> wird jetzt zu Zink-Grau) */}
              <Link 
                href="/account/profile"
                className="w-8 h-8 bg-black text-white flex items-center justify-center text-[11px] font-mono font-normal tracking-tighter select-none rounded-none hover:bg-zinc-800 transition-colors"
                title="Zum persönlichen Profil"
              >
                {getInitials()}
              </Link>

              <div className="flex items-center gap-4">
                {/* 🎯 Text-Grün entfernt -> ist jetzt dezent grau im Monospace-Look */}
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
            {/* 🎯 Badge-Grün entfernt -> wird jetzt zu edlem Schwarz */}
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